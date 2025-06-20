"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, BarChart3, TrendingUp, Users, Clock, Eye, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { useRealtimeLinks, useRealtimeCategories, useRealtimeAnalytics } from "@/hooks/use-realtime-data"
import { automationLinksService, sessionService } from "@/lib/database"
import { toast } from "sonner"

export default function LinkBuilder() {
  const { links, loading: linksLoading, error: linksError } = useRealtimeLinks()
  const { categories, loading: categoriesLoading } = useRealtimeCategories()
  const { stats, loading: statsLoading, error: statsError } = useRealtimeAnalytics()

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [clickingLinkId, setClickingLinkId] = useState<string | null>(null)

  const allCategories = ["all", ...categories.map((cat) => cat.name)]
  const filteredLinks = selectedCategory === "all" ? links : links.filter((link) => link.category === selectedCategory)

  const handleLinkClick = async (link: any) => {
    setClickingLinkId(link.id)

    try {
      const sessionId = sessionService.getSessionId()
      await automationLinksService.incrementClick(link.id, sessionId)

      // Open link in new tab
      window.open(link.url, "_blank")

      toast.success(`Opened ${link.title}`)
    } catch (error) {
      console.error("Error tracking click:", error)
      toast.error("Failed to track click, but opening link anyway")
      // Still open the link even if tracking fails
      window.open(link.url, "_blank")
    } finally {
      setClickingLinkId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Custom GPT Tools": "bg-purple-100 text-purple-800",
      "Marketing Automation": "bg-teal-100 text-teal-800",
      "Strategy Automation": "bg-emerald-100 text-emerald-800",
    }
    return colors[category as keyof typeof colors] || "bg-slate-100 text-slate-800"
  }

  // Show loading state
  if (linksLoading || categoriesLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
          <p className="text-teal-600">Loading automation hub...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (linksError || statsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load data: {linksError || statsError}
              <br />
              Please check your internet connection and try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-green-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex justify-center sm:justify-start">
                <Image
                  src="/images/workforce-logo.png"
                  alt="Workforce Group Logo"
                  width={200}
                  height={60}
                  className="h-8 sm:h-12 w-auto"
                />
              </div>
              <div className="sm:border-l sm:border-green-200 sm:pl-4 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-teal-800">Automation Hub</h1>
                <p className="text-teal-600 text-sm">Centralized access to all automation tools</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-sm text-teal-600">Real-time Analytics</div>
              <div className="text-xs text-slate-500">Powered by Supabase</div>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200 bg-gradient-to-br from-white to-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Total Clicks</CardTitle>
              <BarChart3 className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-800">{stats.totalClicks.toLocaleString()}</div>
              <p className="text-xs text-emerald-600">
                {stats.totalClicks > 0 ? "Live tracking active" : "No activity yet"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-800">{stats.uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-emerald-600">
                {stats.uniqueVisitors > 0 ? "Cross-browser tracking" : "Awaiting first visitors"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-teal-200 bg-gradient-to-br from-white to-teal-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Avg. Clicks/Tool</CardTitle>
              <TrendingUp className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-800">{stats.averageClickRate || 0}</div>
              <p className="text-xs text-emerald-600">
                {stats.averageClickRate > 0 ? `${stats.averageClickRate} avg per tool` : "No usage data"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-white to-lime-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Active Tools</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-800">{stats.totalLinks}</div>
              <p className="text-xs text-emerald-600">{stats.totalLinks} tools available</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-white border border-green-200 h-auto">
            {allCategories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="capitalize data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-1 sm:px-3"
              >
                {category === "all" ? "All Tools" : category.replace(" Automation", "")}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map((link) => (
            <Card
              key={link.id}
              className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-green-200 bg-white hover:bg-gradient-to-br hover:from-white hover:to-green-50 flex flex-col h-full"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 group-hover:text-teal-700 transition-colors text-slate-800">
                      {link.title}
                    </CardTitle>
                    <Badge className={`mb-2 hover:text-white transition-colors ${getCategoryColor(link.category)}`}>
                      {link.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLinkClick(link)}
                    disabled={clickingLinkId === link.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-teal-100 hover:text-teal-700"
                  >
                    {clickingLinkId === link.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardDescription className="text-sm text-slate-600">{link.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 space-y-3">
                  {/* Analytics Summary */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-lg text-teal-800">{link.clicks}</div>
                      <div className="text-slate-600">Total Clicks</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-teal-800">{link.unique_visitors}</div>
                      <div className="text-slate-600">Unique Users</div>
                    </div>
                  </div>

                  {/* Last Activity */}
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="h-3 w-3 mr-1" />
                    Last used: {formatDate(link.last_clicked)}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-[18px] mb-[18px]">
                  <Button
                    onClick={() => handleLinkClick(link)}
                    disabled={clickingLinkId === link.id}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0"
                    variant="outline"
                  >
                    {clickingLinkId === link.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Opening...
                      </>
                    ) : (
                      <>
                        Open Tool
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-teal-400 mb-4">
              <BarChart3 className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-teal-800 mb-2">No tools found</h3>
            <p className="text-slate-600">No automation tools match the selected category.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-500 border-t border-green-200 pt-6">
          <p>© 2024 Workforce Group. Real-time Analytics Portal - Powered by Supabase.</p>
        </div>
      </div>
    </div>
  )
}
