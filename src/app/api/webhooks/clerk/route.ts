import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local')
    }

    // Get the headers
    const headerPayload = request.headers
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occured -- no svix headers', {
        status: 400,
      })
    }

    // Get the body
    const payload = await request.text()
    const body = JSON.parse(payload)

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: any

    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      })
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return new Response('Error occured', {
        status: 400,
      })
    }

    // Handle the webhook
    const eventType = evt.type

    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name } = evt.data

      // Create user in database
      await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          firstName: first_name || 'User',
          lastName: last_name || 'Name',
          role: 'real_estate_agent', // Default role
        },
      })

      console.log('User created:', { id, email: email_addresses[0].email_address })
      
      // Note: We'll redirect to role selection page after sign-up
      // The user will be created with default role and can change it
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt.data

      // Update user in database
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: email_addresses[0].email_address,
          firstName: first_name || 'User',
          lastName: last_name || 'Name',
        },
      })

      console.log('User updated:', { id, email: email_addresses[0].email_address })
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data

      // Delete user from database
      await prisma.user.delete({
        where: { clerkId: id },
      })

      console.log('User deleted:', { id })
    }

    return NextResponse.json({ message: 'Webhook processed successfully' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
