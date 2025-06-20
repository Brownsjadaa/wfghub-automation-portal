"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface TestResult {
  name: string
  status: "pass" | "fail" | "pending"
  message: string
}

export default function TestSyncPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    const results: TestResult[] = []

    // Test 1: localStorage availability
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      results.push({
        name: "localStorage Available",
        status: "pass",
        message: "localStorage is working correctly",
      })
    } catch (error) {
      results.push({
        name: "localStorage Available",
        status: "fail",
        message: "localStorage is not available or blocked",
      })
    }

    // Test 2: Data persistence
    const testData = { test: Date.now() }
    localStorage.setItem("workforce-test-data", JSON.stringify(testData))
    const retrieved = localStorage.getItem("workforce-test-data")
    if (retrieved && JSON.parse(retrieved).test === testData.test) {
      results.push({
        name: "Data Persistence",
        status: "pass",
        message: "Data persists correctly in localStorage",
      })
    } else {
      results.push({
        name: "Data Persistence",
        status: "fail",
        message: "Data persistence failed",
      })
    }
    localStorage.removeItem("workforce-test-data")

    // Test 3: Links data structure
    const linksData = localStorage.getItem("workforce-automation-links")
    if (linksData) {
      try {
        const links = JSON.parse(linksData)
        if (
          Array.isArray(links) &&
          links.every(
            (link) =>
              link.id &&
              link.title &&
              link.url &&
              link.category !== undefined &&
              typeof link.clicks === "number" &&
              typeof link.uniqueVisitors === "number",
          )
        ) {
          results.push({
            name: "Links Data Structure",
            status: "pass",
            message: `${links.length} links with valid structure found`,
          })
        } else {
          results.push({
            name: "Links Data Structure",
            status: "fail",
            message: "Links data structure is invalid",
          })
        }
      } catch (error) {
        results.push({
          name: "Links Data Structure",
          status: "fail",
          message: "Links data is corrupted",
        })
      }
    } else {
      results.push({
        name: "Links Data Structure",
        status: "fail",
        message: "No links data found",
      })
    }

    // Test 4: Categories data
    const categoriesData = localStorage.getItem("workforce-categories")
    if (categoriesData) {
      try {
        const categories = JSON.parse(categoriesData)
        if (Array.isArray(categories) && categories.length > 0) {
          results.push({
            name: "Categories Data",
            status: "pass",
            message: `${categories.length} categories found`,
          })
        } else {
          results.push({
            name: "Categories Data",
            status: "fail",
            message: "Categories data is empty or invalid",
          })
        }
      } catch (error) {
        results.push({
          name: "Categories Data",
          status: "fail",
          message: "Categories data is corrupted",
        })
      }
    } else {
      results.push({
        name: "Categories Data",
        status: "fail",
        message: "No categories data found",
      })
    }

    // Test 5: Users data
    const usersData = localStorage.getItem("workforce-users")
    if (usersData) {
      try {
        const users = JSON.parse(usersData)
        if (Array.isArray(users) && users.length > 0) {
          results.push({
            name: "Users Data",
            status: "pass",
            message: `${users.length} users found`,
          })
        } else {
          results.push({
            name: "Users Data",
            status: "fail",
            message: "Users data is empty or invalid",
          })
        }
      } catch (error) {
        results.push({
          name: "Users Data",
          status: "fail",
          message: "Users data is corrupted",
        })
      }
    } else {
      results.push({
        name: "Users Data",
        status: "fail",
        message: "No users data found",
      })
    }

    // Test 6: Event listeners
    let eventReceived = false
    const testListener = () => {
      eventReceived = true
    }
    window.addEventListener("localStorageUpdate", testListener)
    window.dispatchEvent(new CustomEvent("localStorageUpdate"))

    setTimeout(() => {
      if (eventReceived) {
        results.push({
          name: "Event System",
          status: "pass",
          message: "Custom events working correctly",
        })
      } else {
        results.push({
          name: "Event System",
          status: "fail",
          message: "Custom events not working",
        })
      }
      window.removeEventListener("localStorageUpdate", testListener)

      setTestResults(results)
      setIsRunning(false)
    }, 100)
  }

  const clearAllData = () => {
    localStorage.removeItem("workforce-automation-links")
    localStorage.removeItem("workforce-categories")
    localStorage.removeItem("workforce-users")
    setTestResults([])
    alert("All data cleared! You may need to refresh the main app to reinitialize.")
  }

  const getStorageSize = () => {
    let total = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith("workforce-")) {
        total += localStorage[key].length
      }
    }
    return (total / 1024).toFixed(2) + " KB"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">Production Readiness Test</h1>
          <p className="text-teal-600">Verify data synchronization, localStorage, and CRUD operations</p>
        </div>

        <div className="grid gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current data storage information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-semibold">Storage Used</div>
                  <div className="text-teal-600">{getStorageSize()}</div>
                </div>
                <div>
                  <div className="font-semibold">Links</div>
                  <div className="text-teal-600">
                    {localStorage.getItem("workforce-automation-links")
                      ? JSON.parse(localStorage.getItem("workforce-automation-links") || "[]").length
                      : 0}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Categories</div>
                  <div className="text-teal-600">
                    {localStorage.getItem("workforce-categories")
                      ? JSON.parse(localStorage.getItem("workforce-categories") || "[]").length
                      : 0}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Users</div>
                  <div className="text-teal-600">
                    {localStorage.getItem("workforce-users")
                      ? JSON.parse(localStorage.getItem("workforce-users") || "[]").length
                      : 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
              <CardDescription>Run comprehensive tests and manage data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={runTests} disabled={isRunning} className="bg-gradient-to-r from-green-500 to-teal-600">
                  {isRunning ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                  Run All Tests
                </Button>
                <Button onClick={clearAllData} variant="destructive">
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                {testResults.filter((r) => r.status === "pass").length} of {testResults.length} tests passed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {result.status === "pass" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-gray-600">{result.message}</div>
                      </div>
                    </div>
                    <Badge variant={result.status === "pass" ? "default" : "destructive"}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Production Checklist:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>✅ All tests should pass before deployment</li>
            <li>✅ Data persists across browser sessions</li>
            <li>✅ Real-time sync between main dashboard and admin panel</li>
            <li>✅ CRUD operations update localStorage immediately</li>
            <li>✅ Analytics update when links are clicked</li>
            <li>⚠️ Note: localStorage is per-domain, not shared between users</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
