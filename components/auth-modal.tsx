"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "signin" | "signup"
  onModeChange: (mode: "signin" | "signup") => void
  onAuthStart?: () => void
  onAuthComplete?: () => void
}

export default function AuthModal({
  isOpen,
  onClose,
  mode,
  onModeChange,
  onAuthStart,
  onAuthComplete,
}: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    onAuthStart?.() // Notify parent that auth is starting

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })

        if (error) throw error

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        })

        onAuthComplete?.() // Notify parent that auth is complete
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          toast({
            title: "Welcome back!",
            description: "Redirecting to your dashboard...",
          })

          // Wait a moment for the toast to show, then let AuthProvider handle redirect
          setTimeout(() => {
            onAuthComplete?.()
          }, 1000)
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      onAuthComplete?.() // Reset auth state even on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "signup" ? "Create Account" : "Sign In"}</DialogTitle>
          <DialogDescription>
            {mode === "signup" ? "Start planning your perfect trip today" : "Welcome back to TravelAI"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "signup" ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <Button variant="link" onClick={() => onModeChange(mode === "signup" ? "signin" : "signup")}>
            {mode === "signup" ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
