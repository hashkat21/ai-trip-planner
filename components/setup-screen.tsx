"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Globe, Database, Zap, ExternalLink, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function SetupScreen() {
  const [copiedEnv, setCopiedEnv] = useState(false)
  const { toast } = useToast()

  const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq AI Configuration (for AI-powered itineraries)
GROQ_API_KEY=your_groq_api_key`

  const handleCopyEnv = async () => {
    try {
      await navigator.clipboard.writeText(envTemplate)
      setCopiedEnv(true)
      toast({
        title: "Copied!",
        description: "Environment variables template copied to clipboard.",
      })
      setTimeout(() => setCopiedEnv(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">TravelAI</h1>
          <Badge variant="outline" className="ml-2">
            Setup Required
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to TravelAI!</h2>
            <p className="text-xl text-gray-600 mb-6">
              To get started with your AI-powered travel planner, you'll need to configure a few integrations.
            </p>
            <Alert className="max-w-2xl mx-auto">
              <Database className="h-4 w-4" />
              <AlertDescription>
                This application requires Supabase for authentication and data storage, plus Groq for AI-powered
                itinerary generation.
              </AlertDescription>
            </Alert>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Supabase Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  Supabase Setup
                </CardTitle>
                <CardDescription>Database and authentication backend</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Create a free account at supabase.com</li>
                    <li>Create a new project</li>
                    <li>Go to Settings → API</li>
                    <li>Copy your Project URL and anon public key</li>
                    <li>Add them to your environment variables</li>
                  </ol>
                </div>
                <Button asChild className="w-full">
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Supabase Dashboard
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Groq Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Groq AI Setup
                </CardTitle>
                <CardDescription>AI-powered itinerary generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Create a free account at console.groq.com</li>
                    <li>Navigate to API Keys section</li>
                    <li>Create a new API key</li>
                    <li>Copy the key to your environment variables</li>
                  </ol>
                </div>
                <Button asChild className="w-full">
                  <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Groq Console
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>
                Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root and add
                these variables:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{envTemplate}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={handleCopyEnv}
                >
                  {copiedEnv ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Set up your Supabase and Groq accounts using the links above</li>
                <li>Copy the environment variables template and add your actual keys</li>
                <li>Restart your development server</li>
                <li>Refresh this page to access the full application</li>
              </ol>
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Once configured, you'll have access to user authentication, AI-powered itinerary generation, and data
                  persistence.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Demo Mode Notice */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Want to see the interface first?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => (window.location.href = "/demo")}>
                Try the demo mode
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
