"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface TripHistoryItem {
  id: string
  user_id: string
  destination: string
  duration: string
  budget: string
  travelers: string
  interests: string[]
  accommodation?: string
  transportation?: string
  additional_requests?: string
  itinerary_content: string
  preferences?: any
  created_at: string
  updated_at: string
  is_favorite: boolean
  trip_title?: string
  estimated_cost?: string
}

export interface TravelPreferences {
  destination: string
  duration: string
  budget: string
  travelers: string
  interests: string[]
  accommodation: string
  transportation: string
  additionalRequests: string
}

export async function saveTripToHistory(
  preferences: TravelPreferences,
  itinerary: string,
  tripTitle?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const { error } = await supabase.from("trip_history").insert({
      user_id: user.id,
      destination: preferences.destination,
      duration: preferences.duration,
      budget: preferences.budget,
      travelers: preferences.travelers,
      interests: preferences.interests,
      accommodation: preferences.accommodation,
      transportation: preferences.transportation,
      additional_requests: preferences.additionalRequests,
      itinerary_content: itinerary,
      preferences: preferences,
      trip_title: tripTitle || `${preferences.destination} Trip`,
      estimated_cost: preferences.budget,
    })

    if (error) {
      console.error("Error saving trip to history:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/history")
    return { success: true }
  } catch (error) {
    console.error("Error saving trip to history:", error)
    return { success: false, error: "Failed to save trip to history" }
  }
}

export async function getTripHistory(): Promise<TripHistoryItem[]> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from("trip_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching trip history:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching trip history:", error)
    return []
  }
}

export async function toggleTripFavorite(
  tripId: string,
  isFavorite: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const { error } = await supabase
      .from("trip_history")
      .update({ is_favorite: isFavorite })
      .eq("id", tripId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error updating trip favorite:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/history")
    return { success: true }
  } catch (error) {
    console.error("Error updating trip favorite:", error)
    return { success: false, error: "Failed to update trip favorite" }
  }
}

export async function deleteTripFromHistory(tripId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const { error } = await supabase.from("trip_history").delete().eq("id", tripId).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting trip from history:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/history")
    return { success: true }
  } catch (error) {
    console.error("Error deleting trip from history:", error)
    return { success: false, error: "Failed to delete trip from history" }
  }
}

export async function searchTripHistory(query: string): Promise<TripHistoryItem[]> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from("trip_history")
      .select("*")
      .eq("user_id", user.id)
      .or(`destination.ilike.%${query}%,trip_title.ilike.%${query}%,additional_requests.ilike.%${query}%`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error searching trip history:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error searching trip history:", error)
    return []
  }
}
