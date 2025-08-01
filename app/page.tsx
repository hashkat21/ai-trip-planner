import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import LandingPage from "@/components/landing-page"
import TravelPlanner from "@/components/travel-planner"
import SetupScreen from "@/components/setup-screen"
import { Suspense } from "react"

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}

async function AuthenticatedContent() {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return <SetupScreen />
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return <TravelPlanner />
  }

  return <LandingPage />
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthenticatedContent />
    </Suspense>
  )
}
