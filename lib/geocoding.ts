"use server"

interface GeocodeResult {
  lat: number
  lng: number
  address: string
}

// Free geocoding service using OpenStreetMap Nominatim
export async function geocodeLocation(locationName: string): Promise<GeocodeResult | null> {
  try {
    const encodedLocation = encodeURIComponent(locationName)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}&limit=1`,
      {
        headers: {
          "User-Agent": "TravelAI-App/1.0",
        },
      },
    )

    const data = await response.json()

    if (data && data.length > 0) {
      const result = data[0]
      return {
        lat: Number.parseFloat(result.lat),
        lng: Number.parseFloat(result.lon),
        address: result.display_name,
      }
    }

    return null
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
  }
}

// Enhanced function to extract and geocode locations from itinerary text
export async function extractLocationsFromItinerary(itinerary: string): Promise<any[]> {
  // This is a simplified example - you'd want to use more sophisticated NLP
  const locations: any[] = []

  // Regular expressions to find location mentions
  const locationPatterns = [
    /visit\s+([A-Z][a-zA-Z\s]+(?:Museum|Tower|Cathedral|Palace|Park|Square|Bridge))/gi,
    /lunch\s+at\s+([A-Z][a-zA-Z\s]+)/gi,
    /dinner\s+at\s+([A-Z][a-zA-Z\s]+)/gi,
    /stay\s+at\s+([A-Z][a-zA-Z\s]+(?:Hotel|Inn|Resort))/gi,
  ]

  let dayCounter = 1
  const lines = itinerary.split("\n")

  for (const line of lines) {
    // Check if this line indicates a new day
    if (line.toLowerCase().includes("day ")) {
      const dayMatch = line.match(/day\s+(\d+)/i)
      if (dayMatch) {
        dayCounter = Number.parseInt(dayMatch[1])
      }
    }

    // Extract locations from this line
    for (const pattern of locationPatterns) {
      const matches = [...line.matchAll(pattern)]
      for (const match of matches) {
        const locationName = match[1].trim()

        // Try to geocode the location
        const geocoded = await geocodeLocation(locationName)

        if (geocoded) {
          locations.push({
            id: `${dayCounter}-${locations.length}`,
            name: locationName,
            address: geocoded.address,
            lat: geocoded.lat,
            lng: geocoded.lng,
            day: dayCounter,
            type: determineLocationType(locationName, line),
          })
        }
      }
    }
  }

  return locations
}

function determineLocationType(locationName: string, context: string): string {
  const name = locationName.toLowerCase()
  const contextLower = context.toLowerCase()

  if (
    name.includes("museum") ||
    name.includes("tower") ||
    name.includes("cathedral") ||
    name.includes("palace") ||
    name.includes("monument")
  ) {
    return "attraction"
  }

  if (
    contextLower.includes("lunch") ||
    contextLower.includes("dinner") ||
    contextLower.includes("restaurant") ||
    contextLower.includes("café")
  ) {
    return "restaurant"
  }

  if (name.includes("hotel") || name.includes("inn") || name.includes("resort") || contextLower.includes("stay")) {
    return "hotel"
  }

  return "activity"
}
