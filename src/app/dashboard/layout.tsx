export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The main DashboardLayout wrapper is already applied in the root layout
  // This just passes through the children
  return <>{children}</>
}
