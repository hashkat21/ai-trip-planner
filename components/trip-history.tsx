"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  History,
  Search,
  Heart,
  MoreVertical,
  Trash2,
  Eye,
  Copy,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Filter,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getTripHistory, toggleTripFavorite, deleteTripFromHistory } from "@/lib/trip-history"
import type { TripHistoryItem } from "@/lib/trip-history"
import { formatDistanceToNow } from "date-fns"

interface TripHistoryProps {
  onSelectTrip?: (trip: TripHistoryItem) => void
  onViewItinerary?: (trip: TripHistoryItem) => void
}

export default function TripHistory({ onSelectTrip, onViewItinerary }: TripHistoryProps) {
  const [trips, setTrips] = useState<TripHistoryItem[]>([])
  const [filteredTrips, setFilteredTrips] = useState<TripHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState<"all" | "favorites">("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tripToDelete, setTripToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadTripHistory()
  }, [])

  useEffect(() => {
    filterTrips()
  }, [trips, searchQuery, filterBy])

  const loadTripHistory = async () => {
    try {
      setLoading(true)
      const history = await getTripHistory()
      setTrips(history)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load trip history.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterTrips = () => {
    let filtered = trips

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (trip) =>
          trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.trip_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.additional_requests?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by favorites
    if (filterBy === "favorites") {
      filtered = filtered.filter((trip) => trip.is_favorite)
    }

    setFilteredTrips(filtered)
  }

  const handleToggleFavorite = async (tripId: string, currentFavorite: boolean) => {
    try {
      const result = await toggleTripFavorite(tripId, !currentFavorite)
      if (result.success) {
        setTrips((prev) => prev.map((trip) => (trip.id === tripId ? { ...trip, is_favorite: !currentFavorite } : trip)))
        toast({
          title: currentFavorite ? "Removed from favorites" : "Added to favorites",
          description: currentFavorite ? "Trip removed from favorites." : "Trip added to favorites.",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTrip = async (tripId: string) => {
    try {
      const result = await deleteTripFromHistory(tripId)
      if (result.success) {
        setTrips((prev) => prev.filter((trip) => trip.id !== tripId))
        toast({
          title: "Trip deleted",
          description: "Trip has been removed from your history.",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trip.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setTripToDelete(null)
    }
  }

  const handleCopyPreferences = async (trip: TripHistoryItem) => {
    try {
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

      await navigator.clipboard.writeText(JSON.stringify(preferences, null, 2))
      toast({
        title: "Preferences copied",
        description: "Trip preferences have been copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy preferences.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Trip History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Trip History
          </CardTitle>
          <CardDescription>View and manage your previously planned trips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trips by destination, title, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  {filterBy === "all" ? "All Trips" : "Favorites"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterBy("all")}>All Trips</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("favorites")}>Favorites Only</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || filterBy === "favorites" ? "No trips found" : "No trip history yet"}
              </h3>
              <p className="text-gray-600">
                {searchQuery || filterBy === "favorites"
                  ? "Try adjusting your search or filter criteria."
                  : "Start planning your first trip to see it here!"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTrips.map((trip) => (
                <Card key={trip.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{trip.trip_title || `${trip.destination} Trip`}</h3>
                          {trip.is_favorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {trip.destination}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {trip.duration}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            {trip.travelers}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            {trip.budget}
                          </div>
                        </div>

                        {trip.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {trip.interests.slice(0, 3).map((interest) => (
                              <Badge key={interest} variant="secondary" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                            {trip.interests.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{trip.interests.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            Created {formatDistanceToNow(new Date(trip.created_at), { addSuffix: true })}
                          </p>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewItinerary?.(trip)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSelectTrip?.(trip)}
                              className="flex items-center gap-1"
                            >
                              <Copy className="h-3 w-3" />
                              Reuse
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => handleToggleFavorite(trip.id, trip.is_favorite)}
                                  className="flex items-center gap-2"
                                >
                                  <Heart className={`h-4 w-4 ${trip.is_favorite ? "text-red-500 fill-current" : ""}`} />
                                  {trip.is_favorite ? "Remove from favorites" : "Add to favorites"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleCopyPreferences(trip)}
                                  className="flex items-center gap-2"
                                >
                                  <Copy className="h-4 w-4" />
                                  Copy preferences
                                </DropdownMenuItem>
                                <Separator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setTripToDelete(trip.id)
                                    setDeleteDialogOpen(true)
                                  }}
                                  className="flex items-center gap-2 text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete trip
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this trip from your history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => tripToDelete && handleDeleteTrip(tripToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
