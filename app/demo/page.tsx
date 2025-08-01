"use client"

import { useState } from "react"
import TravelPlanner from "@/components/travel-planner"
import ItineraryDisplay from "@/components/itinerary-display"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

// Mock demo itinerary
const demoItinerary = `# Your Perfect Paris Adventure

## Trip Overview
Welcome to the City of Light! This 5-day Paris itinerary is designed for a couple seeking a perfect blend of culture, romance, and culinary delights on a mid-range budget.

## Day 1: Classic Paris Icons
**Morning (9:00 AM - 12:00 PM)**
- Start at the Eiffel Tower (Trocadéro viewpoint for photos)
- Take elevator to the second floor (€16.60 per person)
- Walk along the Seine River

**Afternoon (12:00 PM - 6:00 PM)**
- Lunch at Café de l'Homme (€45-60 per person)
- Visit Arc de Triomphe (€13 per person)
- Stroll down Champs-Élysées for shopping

**Evening (6:00 PM - 10:00 PM)**
- Seine River cruise at sunset (€15 per person)
- Dinner at Le Comptoir du Relais (€35-50 per person)

## Day 2: Art & Culture
**Morning (9:00 AM - 1:00 PM)**
- Louvre Museum (€17 per person, book in advance)
- See Mona Lisa, Venus de Milo, and Winged Victory

**Afternoon (1:00 PM - 6:00 PM)**
- Lunch at Angelina (famous hot chocolate, €25 per person)
- Walk through Tuileries Garden
- Visit Musée d'Orsay (€14 per person)

**Evening (6:00 PM - 10:00 PM)**
- Aperitif in Saint-Germain-des-Prés
- Dinner at L'Ami Jean (€40-55 per person)

## Day 3: Montmartre & Sacré-Cœur
**Morning (9:00 AM - 1:00 PM)**
- Take funicular to Montmartre
- Visit Sacré-Cœur Basilica (free entry)
- Explore Place du Tertre (street artists)

**Afternoon (1:00 PM - 6:00 PM)**
- Lunch at La Consigne (€30-40 per person)
- Visit Moulin Rouge area (photos only)
- Browse vintage shops in Montmartre

**Evening (6:00 PM - 10:00 PM)**
- Wine tasting at Le Mary Celeste (€35-45 per person)
- Dinner at Pink Mamma (€25-35 per person)

## Day 4: Hidden Gems & Local Life
**Morning (9:00 AM - 1:00 PM)**
- Explore Le Marais district
- Visit Place des Vosges (oldest planned square)
- Browse Jewish quarter and vintage boutiques

**Afternoon (1:00 PM - 6:00 PM)**
- Lunch at L'As du Fallafel (€8-12 per person)
- Visit Père Lachaise Cemetery (free)
- See Jim Morrison's grave and other famous tombs

**Evening (6:00 PM - 10:00 PM)**
- Cocktails at Hemingway Bar (€18-25 per drink)
- Dinner at Le Train Bleu (€50-70 per person)

## Day 5: Palace & Gardens
**Morning (9:00 AM - 2:00 PM)**
- Day trip to Palace of Versailles (€20 per person + €8.50 transport)
- Explore the palace and Hall of Mirrors
- Walk through the magnificent gardens

**Afternoon (2:00 PM - 6:00 PM)**
- Lunch at La Petite Venise in Versailles (€25-35 per person)
- Return to Paris
- Last-minute shopping at Galeries Lafayette

**Evening (6:00 PM - 10:00 PM)**
- Farewell dinner at Le Grand Véfour (€80-120 per person)
- Evening walk along the illuminated Seine

## Accommodation Recommendations
- **Hotel des Grands Boulevards** (€150-200/night) - Boutique hotel in central Paris
- **Hotel Malte Opera** (€120-160/night) - Charming hotel near Opera
- **Hotel des Batignolles** (€100-140/night) - Modern hotel in trendy area

## Transportation
- Purchase a 5-day Navigo Easy card (€30) for unlimited metro/bus
- Walking is highly recommended for short distances
- Uber/taxi for late-night returns (€10-20 per ride)

## Budget Breakdown (Per Couple)
- **Accommodation**: €750-1000 (5 nights)
- **Food & Dining**: €800-1200
- **Attractions**: €200-300
- **Transportation**: €100-150
- **Shopping/Miscellaneous**: €300-500
- **Total**: €2,150-3,150 for the trip

## Local Tips
- Learn basic French phrases - locals appreciate the effort
- Restaurants typically open at 7:30 PM for dinner
- Many museums are free on first Sunday mornings
- Tip 10% at restaurants if service charge isn't included
- Carry a reusable water bottle - public fountains are everywhere

## Packing Essentials
- Comfortable walking shoes (you'll walk 15,000+ steps daily)
- Light jacket (Paris weather can be unpredictable)
- Portable phone charger
- Small day bag for museum visits
- Dressy outfit for nice dinners

Bon voyage! Your Parisian adventure awaits! 🇫🇷✨`

const demoPreferences = {
  destination: "Paris, France",
  duration: "5-7 days",
  budget: "mid-range",
  travelers: "couple",
  interests: ["Culture & History", "Food & Dining", "Art & Museums"],
  accommodation: "boutique",
  transportation: "public",
  additionalRequests: "Looking for romantic experiences and local hidden gems",
}

export default function DemoPage() {
  const [showItinerary, setShowItinerary] = useState(false)

  const handleDemoGenerate = () => {
    // Simulate loading time
    setTimeout(() => {
      setShowItinerary(true)
    }, 2000)
  }

  if (showItinerary) {
    return (
      <div>
        <Alert className="m-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            This is a demo mode. To save itineraries and access full features, please configure Supabase and Groq
            integrations.
          </AlertDescription>
        </Alert>
        <ItineraryDisplay
          itinerary={demoItinerary}
          preferences={demoPreferences}
          onBack={() => setShowItinerary(false)}
          onSignOut={() => (window.location.href = "/")}
        />
      </div>
    )
  }

  return (
    <div>
      <Alert className="m-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          This is a demo mode with sample data. To access full features, please configure Supabase and Groq
          integrations.
        </AlertDescription>
      </Alert>
      <TravelPlanner isDemoMode onDemoGenerate={handleDemoGenerate} />
    </div>
  )
}
