"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { automationLinksService, categoriesService, usersService, analyticsService } from "@/lib/database"
import { testConnection } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type AutomationLink = Database["public"]["Tables"]["automation_links"]["Row"]
type Category = Database["public"]["Tables"]["categories"]["Row"]
type User = Database["public"]["Tables"]["users"]["Row"]

export function useRealtimeLinks() {
  const [links, setLinks] = useState<AutomationLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)
  const isInitializedRef = useRef(false)

  const loadLinks = useCallback(async () => {
    try {
      const data = await automationLinksService.getAll()
      setLinks(data)
      setError(null)
    } catch (err) {
      console.error("Error loading links:", err)
      setError(err instanceof Error ? err.message : "Failed to load links")
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      if (isInitializedRef.current) return
      isInitializedRef.current = true

      try {
        // Test connection first
        const isConnected = await testConnection()
        if (!isConnected) {
          throw new Error("Failed to connect to database")
        }

        // Load initial data
        await loadLinks()

        if (isMounted) {
          setLoading(false)
        }

        // Setup subscription after initial load with error handling
        setTimeout(() => {
          if (isMounted && !subscriptionRef.current) {
            try {
              subscriptionRef.current = automationLinksService.subscribe((payload) => {
                if (!isMounted) return

                console.log("Real-time links update:", payload)

                if (payload.eventType === "INSERT") {
                  setLinks((prev) => [payload.new, ...prev])
                } else if (payload.eventType === "UPDATE") {
                  setLinks((prev) => prev.map((link) => (link.id === payload.new.id ? payload.new : link)))
                } else if (payload.eventType === "DELETE") {
                  setLinks((prev) => prev.filter((link) => link.id !== payload.old.id))
                }
              })
            } catch (error) {
              console.error("Failed to setup links subscription:", error)
              // Don't throw here, just log the error
            }
          }
        }, 1000)
      } catch (err) {
        console.error("Initialization error:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize")
          setLoading(false)
        }
      }
    }

    initialize()

    return () => {
      isMounted = false
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe()
        } catch (error) {
          console.error("Error unsubscribing from links:", error)
        }
        subscriptionRef.current = null
      }
    }
  }, [loadLinks])

  const refetch = useCallback(async () => {
    try {
      await loadLinks()
    } catch (err) {
      console.error("Error refetching links:", err)
      setError(err instanceof Error ? err.message : "Failed to refetch links")
    }
  }, [loadLinks])

  return { links, loading, error, refetch }
}

export function useRealtimeCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)
  const isInitializedRef = useRef(false)

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoriesService.getAll()
      setCategories(data)
      setError(null)
    } catch (err) {
      console.error("Error loading categories:", err)
      setError(err instanceof Error ? err.message : "Failed to load categories")
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      if (isInitializedRef.current) return
      isInitializedRef.current = true

      try {
        const isConnected = await testConnection()
        if (!isConnected) {
          throw new Error("Failed to connect to database")
        }

        await loadCategories()

        if (isMounted) {
          setLoading(false)
        }

        setTimeout(() => {
          if (isMounted && !subscriptionRef.current) {
            try {
              subscriptionRef.current = categoriesService.subscribe((payload) => {
                if (!isMounted) return

                if (payload.eventType === "INSERT") {
                  setCategories((prev) => [...prev, payload.new])
                } else if (payload.eventType === "UPDATE") {
                  setCategories((prev) => prev.map((cat) => (cat.id === payload.new.id ? payload.new : cat)))
                } else if (payload.eventType === "DELETE") {
                  setCategories((prev) => prev.filter((cat) => cat.id !== payload.old.id))
                }
              })
            } catch (error) {
              console.error("Failed to setup categories subscription:", error)
            }
          }
        }, 1000)
      } catch (err) {
        console.error("Categories initialization error:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize")
          setLoading(false)
        }
      }
    }

    initialize()

    return () => {
      isMounted = false
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe()
        } catch (error) {
          console.error("Error unsubscribing from categories:", error)
        }
        subscriptionRef.current = null
      }
    }
  }, [loadCategories])

  const refetch = useCallback(async () => {
    try {
      await loadCategories()
    } catch (err) {
      console.error("Error refetching categories:", err)
      setError(err instanceof Error ? err.message : "Failed to refetch categories")
    }
  }, [loadCategories])

  return { categories, loading, error, refetch }
}

export function useRealtimeUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)
  const isInitializedRef = useRef(false)

  const loadUsers = useCallback(async () => {
    try {
      const data = await usersService.getAll()
      setUsers(data)
      setError(null)
    } catch (err) {
      console.error("Error loading users:", err)
      setError(err instanceof Error ? err.message : "Failed to load users")
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      if (isInitializedRef.current) return
      isInitializedRef.current = true

      try {
        const isConnected = await testConnection()
        if (!isConnected) {
          throw new Error("Failed to connect to database")
        }

        await loadUsers()

        if (isMounted) {
          setLoading(false)
        }

        setTimeout(() => {
          if (isMounted && !subscriptionRef.current) {
            try {
              subscriptionRef.current = usersService.subscribe((payload) => {
                if (!isMounted) return

                if (payload.eventType === "INSERT") {
                  setUsers((prev) => [payload.new, ...prev])
                } else if (payload.eventType === "UPDATE") {
                  setUsers((prev) => prev.map((user) => (user.id === payload.new.id ? payload.new : user)))
                } else if (payload.eventType === "DELETE") {
                  setUsers((prev) => prev.filter((user) => user.id !== payload.old.id))
                }
              })
            } catch (error) {
              console.error("Failed to setup users subscription:", error)
            }
          }
        }, 1000)
      } catch (err) {
        console.error("Users initialization error:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize")
          setLoading(false)
        }
      }
    }

    initialize()

    return () => {
      isMounted = false
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe()
        } catch (error) {
          console.error("Error unsubscribing from users:", error)
        }
        subscriptionRef.current = null
      }
    }
  }, [loadUsers])

  const refetch = useCallback(async () => {
    try {
      await loadUsers()
    } catch (err) {
      console.error("Error refetching users:", err)
      setError(err instanceof Error ? err.message : "Failed to refetch users")
    }
  }, [loadUsers])

  return { users, loading, error, refetch }
}

export function useRealtimeAnalytics() {
  const [stats, setStats] = useState({
    totalClicks: 0,
    uniqueVisitors: 0,
    totalLinks: 0,
    activeUsers: 0,
    averageClickRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionsRef = useRef<{ unsubscribe: () => void }[]>([])
  const isInitializedRef = useRef(false)

  const loadStats = useCallback(async () => {
    try {
      const data = await analyticsService.getDashboardStats()
      setStats(data)
      setError(null)
    } catch (err) {
      console.error("Error loading analytics:", err)
      setError(err instanceof Error ? err.message : "Failed to load analytics")
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      if (isInitializedRef.current) return
      isInitializedRef.current = true

      try {
        const isConnected = await testConnection()
        if (!isConnected) {
          throw new Error("Failed to connect to database")
        }

        await loadStats()

        if (isMounted) {
          setLoading(false)
        }

        setTimeout(() => {
          if (isMounted && subscriptionsRef.current.length === 0) {
            try {
              // Subscribe to analytics changes
              const analyticsSubscription = analyticsService.subscribe(() => {
                if (isMounted) loadStats()
              })

              // Subscribe to links changes (affects total links count)
              const linksSubscription = automationLinksService.subscribe(() => {
                if (isMounted) loadStats()
              })

              subscriptionsRef.current = [analyticsSubscription, linksSubscription]
            } catch (error) {
              console.error("Failed to setup analytics subscriptions:", error)
            }
          }
        }, 1000)
      } catch (err) {
        console.error("Analytics initialization error:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize")
          setLoading(false)
        }
      }
    }

    initialize()

    return () => {
      isMounted = false
      subscriptionsRef.current.forEach((subscription) => {
        if (subscription) {
          try {
            subscription.unsubscribe()
          } catch (error) {
            console.error("Error unsubscribing from analytics:", error)
          }
        }
      })
      subscriptionsRef.current = []
    }
  }, [loadStats])

  const refetch = useCallback(async () => {
    try {
      await loadStats()
    } catch (err) {
      console.error("Error refetching analytics:", err)
      setError(err instanceof Error ? err.message : "Failed to refetch analytics")
    }
  }, [loadStats])

  return { stats, loading, error, refetch }
}
