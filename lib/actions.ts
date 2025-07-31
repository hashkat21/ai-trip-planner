"use server"

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

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

export async function generateItinerary(preferences: TravelPreferences): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Groq API key is not configured. Please add GROQ_API_KEY to your environment variables.")
  }

  const prompt = `Create a detailed, personalized travel itinerary based on the following preferences:

Destination: ${preferences.destination}
Duration: ${preferences.duration}
Budget: ${preferences.budget}
Number of travelers: ${preferences.travelers}
Interests: ${preferences.interests.join(", ")}
Accommodation preference: ${preferences.accommodation || "No preference"}
Transportation preference: ${preferences.transportation || "No preference"}
Additional requests: ${preferences.additionalRequests || "None"}

Please create a comprehensive itinerary that includes:

1. A brief overview of the destination and why it's perfect for this trip
2. Day-by-day detailed schedule with:
   - Morning, afternoon, and evening activities
   - Specific attractions, restaurants, and experiences
   - Estimated costs and time requirements
   - Transportation between locations
3. Accommodation recommendations that fit the budget and preferences
4. Local tips and cultural insights
5. Budget breakdown and money-saving tips
6. Packing suggestions based on the destination and activities
7. Important travel information (best time to visit, local customs, etc.)

Make the itinerary engaging, practical, and tailored to the specified interests and budget. Include specific names of places, restaurants, and attractions where possible. Format the response with clear headings and sections for easy reading.`

  try {
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      maxTokens: 4000,
    })

    return text
  } catch (error) {
    console.error("Error generating itinerary:", error)
    throw new Error("Failed to generate itinerary. Please check your Groq API configuration.")
  }
}
