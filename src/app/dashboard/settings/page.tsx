import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import SettingsPage from '@/components/settings/SettingsPage'

export default async function Settings() {
  const user = await requireAuth()

  // Fetch user's subscription info
  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id }
  })

  return (
    <div className="space-y-6">
      <SettingsPage user={user} subscription={subscription} />
    </div>
  )
}
