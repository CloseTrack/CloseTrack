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
  '/test-role-api',
  '/redirect',
  '/api/webhooks(.*)',
  '/api/database',
  '/api/test-database',
  '/api/simple-db-test',
  '/api/test-direct-connection',
  '/api/test-all-connections',
  '/api/test-hostnames',
  '/api/test-usernames',
  '/api/user/check',
  '/api/debug-user-creation',
  '/api/test-schema-fix',
  '/api/test-final-schema',
  '/api/debug-database',
  '/api/auth-test',
  '/api/debug-role-creation',
  '/api/test-user-creation',
  '/api/check-enum',
  '/debug',
  '/simple-dashboard'
])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
