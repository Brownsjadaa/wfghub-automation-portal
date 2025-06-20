import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Test connection function with better error handling
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("automation_links").select("count", { count: "exact", head: true })
    if (error) {
      console.error("Connection test failed:", error)
      return false
    }
    console.log("Supabase connection successful")
    return true
  } catch (error) {
    console.error("Supabase connection failed:", error)
    return false
  }
}

// Database types
export interface Database {
  public: {
    Tables: {
      automation_links: {
        Row: {
          id: string
          title: string
          description: string
          url: string
          category: string
          clicks: number
          unique_visitors: number
          last_clicked: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          url: string
          category: string
          clicks?: number
          unique_visitors?: number
          last_clicked?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          url?: string
          category?: string
          clicks?: number
          unique_visitors?: number
          last_clicked?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          last_active: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: string
          last_active?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          last_active?: string
          updated_at?: string
        }
      }
      click_analytics: {
        Row: {
          id: string
          link_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          clicked_at: string
          session_id: string | null
        }
        Insert: {
          id?: string
          link_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          clicked_at?: string
          session_id?: string | null
        }
        Update: {
          id?: string
          link_id?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          clicked_at?: string
          session_id?: string | null
        }
      }
    }
  }
}
