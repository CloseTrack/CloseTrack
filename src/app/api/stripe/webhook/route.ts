import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          
          // Update user subscription
          await prisma.user.update({
            where: { clerkId: session.metadata?.clerkId },
            data: {
              subscriptionId: subscription.id,
              subscriptionStatus: subscription.status
            }
          })

          // Create subscription record
          await prisma.subscription.create({
            data: {
              userId: session.metadata?.userId!,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              planId: subscription.items.data[0].price.id,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000)
            }
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Update subscription status
        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
          }
        })

        // Update user subscription status
        await prisma.user.updateMany({
          where: { subscriptionId: subscription.id },
          data: { subscriptionStatus: subscription.status }
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Cancel subscription
        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'canceled' }
        })

        // Update user subscription status
        await prisma.user.updateMany({
          where: { subscriptionId: subscription.id },
          data: { subscriptionStatus: 'canceled' }
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          // Update subscription status to active
          await prisma.subscription.update({
            where: { stripeSubscriptionId: invoice.subscription as string },
            data: { status: 'active' }
          })

          await prisma.user.updateMany({
            where: { subscriptionId: invoice.subscription as string },
            data: { subscriptionStatus: 'active' }
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          // Update subscription status to past_due
          await prisma.subscription.update({
            where: { stripeSubscriptionId: invoice.subscription as string },
            data: { status: 'past_due' }
          })

          await prisma.user.updateMany({
            where: { subscriptionId: invoice.subscription as string },
            data: { subscriptionStatus: 'past_due' }
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
