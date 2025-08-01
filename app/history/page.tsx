"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin } from "lucide-react"
import TripHistory from "@/components/trip-history"
import ItineraryDisplay from "@/components/itinerary-display"
import { createClient } from "@/lib/supabase/client"
import type { TripHistoryItem } from "@/lib/trip-history"

export default function HistoryPage() {
  const [selectedTrip, setSelectedTrip] = useState<TripHistoryItem | null>(null)
  const [viewMode, setViewMode] = useState<"history" | "itinerary">("history")
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const handleViewItinerary = (trip: TripHistoryItem) => {
    setSelectedTrip(trip)
    setViewMode("itinerary")
  }

  const handleSelectTrip = (trip: TripHistoryItem) => {
    // Redirect to planner with pre-filled preferences
    const preferences = {
      destination: trip.destination,
      duration: trip.duration,
      budget: trip.budget,
      travelers: trip.travelers,
      interests: trip.interests,
      accommodation: trip.accommodation || "",
      transportation: trip.transportation || "",
      additionalRequests: trip.additional_requests || "",
    }

    // Store preferences in sessionStorage and redirect
    sessionStorage.setItem("prefillPreferences", JSON.stringify(preferences))
    window.location.href = "/planner"
  }

  const handleBackToHistory = () => {
    setSelectedTrip(null)
    setViewMode("history")
  }

  const handleBackToPlanner = () => {
    window.location.href = "/planner"
  }

  if (viewMode === "itinerary" && selectedTrip) {
    // Convert trip to the format expected by ItineraryDisplay
    const preferences = {
      destination: selectedTrip.destination,
      duration: selectedTrip.duration,
      budget: selectedTrip.budget,
      travelers: selectedTrip.travelers,
      interests: selectedTrip.interests,
      accommodation: selectedTrip.accommodation,
      transportation: selectedTrip.transportation,
      additionalRequests: selectedTrip.additional_requests,
    }

    return (
      <ItineraryDisplay
        itinerary={selectedTrip.itinerary_content}
        preferences={preferences}
        onBack={handleBackToHistory}
        onSignOut={handleSignOut}
      />
    )
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
              <h1 className="text-2xl font-bold text-gray-900">Trip History</h1>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <TripHistory onSelectTrip={handleSelectTrip} onViewItinerary={handleViewItinerary} />
        </div>
      </div>
    </div>
  )
}
