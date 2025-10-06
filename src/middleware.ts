import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/role-selection',
  '/post-signup',
  '/database-test',
  '/test-connection',
  '/debug-complete',
  '/test-redirect',
  '/test-complete-flow',
  '/redirect',
  '/api/webhooks(.*)',
  '/api/database',
  '/api/test-database',
  '/api/simple-db-test',
  '/api/test-direct-connection',
  '/api/test-all-connections',
  '/api/test-hostnames',
  '/api/test-usernames',
  '/api/debug-database',
  '/api/auth-test',
  '/debug',
  '/simple-dashboard'
])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
