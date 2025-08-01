"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Download, Share, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ItineraryDisplayProps {
  itinerary: string
  preferences: any
  onBack: () => void
  onSignOut: () => void
}

export default function ItineraryDisplay({ itinerary, preferences, onBack, onSignOut }: ItineraryDisplayProps) {
  const { toast } = useToast()

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `My ${preferences.destination} Travel Itinerary`,
        text: itinerary,
      })
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(itinerary)
      toast({
        title: "Copied to clipboard!",
        description: "Your itinerary has been copied to the clipboard.",
      })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([itinerary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${preferences.destination.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_itinerary.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download started!",
      description: "Your itinerary is being downloaded.",
    })
  }

  // Parse the itinerary into sections for better display
  const sections = itinerary.split("\n\n").filter((section) => section.trim())

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Planner
            </Button>
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Your Travel Itinerary</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Trip Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Trip Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="font-medium">{preferences.destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{preferences.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-medium capitalize">{preferences.budget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Travelers</p>
                    <p className="font-medium capitalize">{preferences.travelers}</p>
                  </div>
                </div>
              </div>

              {preferences.interests.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Selected Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {preferences.interests.map((interest: string) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Itinerary Content */}
          <Card>
            <CardHeader>
              <CardTitle>Your Personalized Itinerary</CardTitle>
              <CardDescription>AI-generated travel plan based on your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                {sections.map((section, index) => (
                  <div key={index} className="mb-6">
                    {section.startsWith("Day ") || section.startsWith("## ") ? (
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                        {section.replace("## ", "")}
                      </h3>
                    ) : section.startsWith("# ") ? (
                      <h2 className="text-xl font-bold text-gray-900 mb-4">{section.replace("# ", "")}</h2>
                    ) : (
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{section}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={onBack} variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Plan Another Trip
            </Button>
            <Button onClick={handleDownload} size="lg">
              <Download className="mr-2 h-4 w-4" />
              Save Itinerary
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
