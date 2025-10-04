import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
    '/api/database',
    '/api/auth-test',
    '/debug',
    '/simple-dashboard'
  ],
  // Routes that can always be accessed, even by unauthenticated users
  ignoredRoutes: [
    '/api/webhooks/clerk',
    '/api/database',
    '/api/auth-test'
  ],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
