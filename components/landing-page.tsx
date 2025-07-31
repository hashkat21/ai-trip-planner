"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, DollarSign, Sparkles, Users, Globe } from "lucide-react"
import AuthModal from "@/components/auth-modal"
import { useState } from "react"

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup")
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleGetStarted = () => {
    setAuthMode("signup")
    setShowAuth(true)
  }

  const handleSignIn = () => {
    setAuthMode("signin")
    setShowAuth(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">TravelAI</h1>
        </div>
        <Button variant="outline" onClick={handleSignIn}>
          Sign In
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Plan Your Perfect Trip with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              AI Intelligence
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get personalized travel itineraries tailored to your preferences, budget, and interests. Let AI handle the
            planning while you focus on the adventure.
          </p>
          <Button size="lg" className="text-lg px-8 py-6" onClick={handleGetStarted}>
            <Sparkles className="mr-2 h-5 w-5" />
            Start Planning Your Trip
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose TravelAI?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Smart Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI-powered recommendations based on your interests, weather, and local events
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Optimized Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Intelligent itinerary planning that maximizes your time and minimizes travel stress
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Budget Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get the best value recommendations that fit your budget without compromising quality
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">1. Tell Us About You</h4>
              <p className="text-gray-600">Share your travel preferences, interests, and budget</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">2. AI Magic</h4>
              <p className="text-gray-600">Our AI analyzes millions of data points to create your perfect trip</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">3. Get Your Itinerary</h4>
              <p className="text-gray-600">Receive a detailed, day-by-day plan with activities and recommendations</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">4. Explore & Enjoy</h4>
              <p className="text-gray-600">Follow your personalized itinerary and make amazing memories</p>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuth}
        onClose={() => {
          if (!isAuthenticating) {
            setShowAuth(false)
          }
        }}
        mode={authMode}
        onModeChange={setAuthMode}
        onAuthStart={() => setIsAuthenticating(true)}
        onAuthComplete={() => {
          setIsAuthenticating(false)
          setShowAuth(false)
        }}
      />
    </div>
  )
}
