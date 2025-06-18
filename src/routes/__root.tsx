import { createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { RootLayout } from '@/components/Layout/RootLayout'

function RootLayoutWithDevtools() {
  return (
    <>
      <RootLayout />
      {/* DevTools apenas em desenvolvimento */}
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayoutWithDevtools,
}) 