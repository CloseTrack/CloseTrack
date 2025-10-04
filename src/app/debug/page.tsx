import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export default async function DebugPage() {
  try {
    const { userId } = await auth()
    const clerkUser = await currentUser()
    
    let dbUser = null
    if (userId) {
      dbUser = await prisma.user.findUnique({
        where: { clerkId: userId }
      })
    }

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
              <div className="space-y-2">
                <p><strong>Clerk User ID:</strong> {userId || 'Not authenticated'}</p>
                <p><strong>Clerk User Email:</strong> {clerkUser?.emailAddresses[0]?.emailAddress || 'N/A'}</p>
                <p><strong>Clerk User Name:</strong> {clerkUser?.firstName} {clerkUser?.lastName}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Database Status</h2>
              <div className="space-y-2">
                <p><strong>User exists in DB:</strong> {dbUser ? 'Yes' : 'No'}</p>
                {dbUser && (
                  <>
                    <p><strong>DB User ID:</strong> {dbUser.id}</p>
                    <p><strong>DB User Email:</strong> {dbUser.email}</p>
                    <p><strong>DB User Name:</strong> {dbUser.firstName} {dbUser.lastName}</p>
                    <p><strong>DB User Role:</strong> {dbUser.role}</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
              <div className="space-y-2">
                <p><strong>DATABASE_URL:</strong> {process.env.DATABASE_URL ? 'Set' : 'Missing'}</p>
                <p><strong>CLERK_SECRET_KEY:</strong> {process.env.CLERK_SECRET_KEY ? 'Set' : 'Missing'}</p>
                <p><strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</strong> {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Missing'}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <div className="space-x-4">
                <a 
                  href="/api/auth-test" 
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Test Auth API
                </a>
                <a 
                  href="/api/database" 
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Test Database API
                </a>
                <a 
                  href="/dashboard" 
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Try Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Error</h1>
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <p className="text-red-800">
              <strong>Error:</strong> {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </div>
    )
  }
}
