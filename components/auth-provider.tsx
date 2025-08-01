"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.refresh()
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // User signed in successfully
        console.log("User signed in, refreshing...")
        // Small delay to ensure the auth state is fully updated
        setTimeout(() => {
          router.refresh()
        }, 100)
      } else if (event === "SIGNED_OUT") {
        // User signed out
        console.log("User signed out, refreshing...")
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  return <>{children}</>
}
