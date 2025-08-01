"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, DollarSign, Users, Sparkles, LogOut, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import ItineraryDisplay from "@/components/itinerary-display"
import { generateItinerary } from "@/lib/actions"

interface TravelPreferences {
  destination: string
  duration: string
  budget: string
  travelers: string
  interests: string[]
  accommodation: string
  transportation: string
  additionalRequests: string
}

interface TravelPlannerProps {
  isDemoMode?: boolean
  onDemoGenerate?: () => void
}

const interests = [
  "Adventure & Outdoor",
  "Culture & History",
  "Food & Dining",
  "Nightlife & Entertainment",
  "Shopping",
  "Art & Museums",
  "Nature & Wildlife",
  "Beach & Water Sports",
  "Photography",
  "Local Experiences",
]

export default function TravelPlanner({ isDemoMode = false, onDemoGenerate }: TravelPlannerProps = {}) {
  const [preferences, setPreferences] = useState<TravelPreferences>({
    destination: "",
    duration: "",
    budget: "",
    travelers: "",
    interests: [],
    accommodation: "",
    transportation: "",
    additionalRequests: "",
  })

  const [itinerary, setItinerary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSignOut = async () => {
    if (isDemoMode) {
      window.location.href = "/"
      return
    }
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleInterestToggle = (interest: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleGenerateItinerary = async () => {
    if (!preferences.destination || !preferences.duration || !preferences.budget) {
      toast({
        title: "Missing Information",
        description: "Please fill in destination, duration, and budget.",
        variant: "destructive",
      })
      return
    }

    if (isDemoMode) {
      setLoading(true)
      toast({
        title: "Generating Demo Itinerary...",
        description: "Creating a sample Paris itinerary for you.",
      })
      onDemoGenerate?.()
      return
    }

    setLoading(true)
    try {
      const result = await generateItinerary(preferences)
      setItinerary(result)
      toast({
        title: "Itinerary Generated!",
        description: "Your personalized travel plan is ready.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (itinerary) {
    return (
      <ItineraryDisplay
        itinerary={itinerary}
        preferences={preferences}
        onBack={() => setItinerary(null)}
        onSignOut={handleSignOut}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">TravelAI</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Perfect Trip</h2>
            <p className="text-gray-600">
              Tell us about your travel preferences and let AI create your personalized itinerary
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Travel Preferences
              </CardTitle>
              <CardDescription>
                Provide details about your trip to get the most personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Trip Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Destination
                  </Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Paris, France"
                    value={preferences.destination}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, destination: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Duration
                  </Label>
                  <Select
                    value={preferences.duration}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 days">1-2 days</SelectItem>
                      <SelectItem value="3-4 days">3-4 days</SelectItem>
                      <SelectItem value="5-7 days">5-7 days</SelectItem>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2+ weeks">2+ weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Budget Range
                  </Label>
                  <Select
                    value={preferences.budget}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, budget: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget ($50-100/day)</SelectItem>
                      <SelectItem value="mid-range">Mid-range ($100-250/day)</SelectItem>
                      <SelectItem value="luxury">Luxury ($250+/day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelers" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Number of Travelers
                  </Label>
                  <Select
                    value={preferences.travelers}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, travelers: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select travelers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo traveler</SelectItem>
                      <SelectItem value="couple">Couple (2 people)</SelectItem>
                      <SelectItem value="small-group">Small group (3-5 people)</SelectItem>
                      <SelectItem value="large-group">Large group (6+ people)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Interests */}
              <div className="space-y-3">
                <Label>Interests & Activities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interests.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={preferences.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label htmlFor={interest} className="text-sm font-normal">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
                {preferences.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {preferences.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Accommodation & Transportation */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accommodation">Accommodation Preference</Label>
                  <Select
                    value={preferences.accommodation}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, accommodation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select accommodation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                      <SelectItem value="airbnb">Airbnb/Vacation Rental</SelectItem>
                      <SelectItem value="resort">Resort</SelectItem>
                      <SelectItem value="boutique">Boutique Hotel</SelectItem>
                      <SelectItem value="any">No preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transportation">Transportation Preference</Label>
                  <Select
                    value={preferences.transportation}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, transportation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transportation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public Transportation</SelectItem>
                      <SelectItem value="rental-car">Rental Car</SelectItem>
                      <SelectItem value="rideshare">Rideshare/Taxi</SelectItem>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="mixed">Mixed/Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Requests */}
              <div className="space-y-2">
                <Label htmlFor="additional">Additional Requests or Special Requirements</Label>
                <Textarea
                  id="additional"
                  placeholder="Any dietary restrictions, accessibility needs, specific attractions you want to visit, or other special requests..."
                  value={preferences.additionalRequests}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, additionalRequests: e.target.value }))}
                  rows={3}
                />
              </div>

              <Button onClick={handleGenerateItinerary} className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Perfect Itinerary...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate AI-Powered Itinerary
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
