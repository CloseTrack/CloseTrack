import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
      console.error('CLERK_WEBHOOK_SECRET not configured')
      throw new Error('Please add CLERK_WEBHOOK_SECRET to environment variables')
    }

    // Get the headers
    const headerPayload = request.headers
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Missing svix headers')
      return new Response('Error occurred -- no svix headers', {
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
      return new Response('Error occurred', {
        status: 400,
      })
    }

    // Handle the webhook
    const eventType = evt.type
    console.log('Webhook event type:', eventType)

    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name } = evt.data
      const email = email_addresses[0]?.email_address

      if (!email) {
        console.error('No email found in user.created event')
        return new Response('No email found', { status: 400 })
      }

      try {
        // Check if DATABASE_URL is available
        if (!process.env.DATABASE_URL) {
          console.error('DATABASE_URL not configured')
          return new Response('Database not configured', { status: 500 })
        }

        // Create user in database
        const user = await prisma.user.create({
          data: {
            clerkId: id,
            email: email,
            firstName: first_name || 'User',
            lastName: last_name || 'Name',
            role: UserRole.agent, // Use enum
          },
        })

        console.log('User created successfully:', { id, email, userId: user.id })
      } catch (dbError) {
        console.error('Database error creating user:', dbError)
        return new Response('Database error', { status: 500 })
      }
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt.data
      const email = email_addresses[0]?.email_address

      if (!email) {
        console.error('No email found in user.updated event')
        return new Response('No email found', { status: 400 })
      }

      try {
        // Update user in database
        await prisma.user.update({
          where: { clerkId: id },
          data: {
            email: email,
            firstName: first_name || 'User',
            lastName: last_name || 'Name',
          },
        })

        console.log('User updated successfully:', { id, email })
      } catch (dbError) {
        console.error('Database error updating user:', dbError)
        // Don't fail the webhook if user doesn't exist yet
        console.log('User not found in database, skipping update')
      }
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data

      try {
        // Delete user from database
        await prisma.user.delete({
          where: { clerkId: id },
        })

        console.log('User deleted successfully:', { id })
      } catch (dbError) {
        console.error('Database error deleting user:', dbError)
        // Don't fail the webhook if user doesn't exist
        console.log('User not found in database, skipping deletion')
      }
    }

    return NextResponse.json({ message: 'Webhook processed successfully' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
