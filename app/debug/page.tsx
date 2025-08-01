"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin } from "lucide-react"
import DebugTripHistory from "@/components/debug-trip-history"
import { createClient } from "@/lib/supabase/client"

export default function DebugPage() {
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const handleBackToPlanner = () => {
    window.location.href = "/planner"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBackToPlanner}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Planner
            </Button>
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Debug Trip History</h1>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <DebugTripHistory />
        </div>
      </div>
    </div>
  )
}
