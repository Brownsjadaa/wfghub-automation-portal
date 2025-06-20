"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Plus,
  Edit,
  Trash2,
  Settings,
  Home,
  LinkIcon,
  Tags,
  RefreshCw,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import {
  useRealtimeLinks,
  useRealtimeCategories,
  useRealtimeUsers,
  useRealtimeAnalytics,
} from "@/hooks/use-realtime-data"
import { automationLinksService, categoriesService, usersService } from "@/lib/database"
import { toast } from "sonner"

export default function AdminPage() {
  const { links, loading: linksLoading, error: linksError, refetch: refetchLinks } = useRealtimeLinks()
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useRealtimeCategories()
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useRealtimeUsers()
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useRealtimeAnalytics()

  const [activeSection, setActiveSection] = useState("dashboard")
  const [editingLink, setEditingLink] = useState<any>(null)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editingUser, setEditingUser] = useState<any>(null)

  // Dialog states
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  // Add this right after the state declarations for debugging
  useEffect(() => {
    console.log("Dialog states:", {
      isAddLinkOpen,
      isAddCategoryOpen,
      isAddUserOpen,
    })
  }, [isAddLinkOpen, isAddCategoryOpen, isAddUserOpen])

  // Loading states
  const [isCreatingLink, setIsCreatingLink] = useState(false)
  const [isUpdatingLink, setIsUpdatingLink] = useState(false)
  const [isDeletingLink, setIsDeletingLink] = useState<string | null>(null)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false)
  const [isDeletingCategory, setIsDeletingCategory] = useState<string | null>(null)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  const [isDeletingUser, setIsDeletingUser] = useState<string | null>(null)

  const handleAddLinkClick = () => {
    console.log("Add Link button clicked")
    setIsAddLinkOpen(true)
  }

  const handleAddCategoryClick = () => {
    console.log("Add Category button clicked")
    setIsAddCategoryOpen(true)
  }

  const handleAddUserClick = () => {
    console.log("Add User button clicked")
    setIsAddUserOpen(true)
  }

  // Link management functions
  const handleCreateLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreatingLink(true)

    try {
      const formData = new FormData(e.currentTarget)
      await automationLinksService.create({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        url: formData.get("url") as string,
        category: formData.get("category") as string,
      })

      setIsAddLinkOpen(false)
      // Reset form fields manually instead of using reset()
      const form = e.currentTarget
      if (form) {
        const inputs = form.querySelectorAll("input, textarea")
        inputs.forEach((input) => {
          if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
            input.value = ""
          }
        })
        // Reset select elements
        const selects = form.querySelectorAll("select")
        selects.forEach((select) => {
          if (select instanceof HTMLSelectElement) {
            select.selectedIndex = 0
          }
        })
      }
      toast.success("Automation tool created successfully!")
    } catch (error) {
      console.error("Error creating link:", error)
      toast.error("Failed to create automation tool")
    } finally {
      setIsCreatingLink(false)
    }
  }

  const handleUpdateLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingLink) return
    setIsUpdatingLink(true)

    try {
      const formData = new FormData(e.currentTarget)
      await automationLinksService.update(editingLink.id, {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        url: formData.get("url") as string,
        category: formData.get("category") as string,
      })

      setEditingLink(null)
      toast.success("Automation tool updated successfully!")
    } catch (error) {
      console.error("Error updating link:", error)
      toast.error("Failed to update automation tool")
    } finally {
      setIsUpdatingLink(false)
    }
  }

  const handleDeleteLink = async (id: string) => {
    console.log("Attempting to delete link with ID:", id)
    setIsDeletingLink(id)
    try {
      await automationLinksService.delete(id)
      console.log("Link deleted successfully:", id)
      toast.success("Automation tool deleted successfully!")
    } catch (error) {
      console.error("Error deleting link:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete automation tool")
    } finally {
      setIsDeletingLink(null)
    }
  }

  // Category management functions
  const handleDeleteCategory = async (id: string) => {
    setIsDeletingCategory(id)
    try {
      await categoriesService.delete(id)
      toast.success("Category deleted successfully!")
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete category")
    } finally {
      setIsDeletingCategory(null)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreatingCategory(true)

    try {
      const formData = new FormData(e.currentTarget)
      await categoriesService.create({
        name: formData.get("category") as string,
      })

      setIsAddCategoryOpen(false)
      // Reset form fields manually
      const form = e.currentTarget
      if (form) {
        const inputs = form.querySelectorAll("input, textarea")
        inputs.forEach((input) => {
          if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
            input.value = ""
          }
        })
      }
      toast.success("Category created successfully!")
    } catch (error) {
      console.error("Error creating category:", error)
      toast.error("Failed to create category")
    } finally {
      setIsCreatingCategory(false)
    }
  }

  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingCategory) return
    setIsUpdatingCategory(true)

    try {
      const formData = new FormData(e.currentTarget)
      await categoriesService.update(editingCategory.id, {
        name: formData.get("categoryName") as string,
      })

      setEditingCategory(null)
      toast.success("Category updated successfully!")
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category")
    } finally {
      setIsUpdatingCategory(false)
    }
  }

  // User management functions
  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreatingUser(true)

    try {
      const formData = new FormData(e.currentTarget)
      await usersService.create({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        role: formData.get("role") as string,
      })

      setIsAddUserOpen(false)
      // Reset form fields manually
      const form = e.currentTarget
      if (form) {
        const inputs = form.querySelectorAll("input, textarea")
        inputs.forEach((input) => {
          if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
            input.value = ""
          }
        })
        const selects = form.querySelectorAll("select")
        selects.forEach((select) => {
          if (select instanceof HTMLSelectElement) {
            select.selectedIndex = 0
          }
        })
      }
      toast.success("User created successfully!")
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("Failed to create user")
    } finally {
      setIsCreatingUser(false)
    }
  }

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingUser) return
    setIsUpdatingUser(true)

    try {
      const formData = new FormData(e.currentTarget)
      await usersService.update(editingUser.id, {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        role: formData.get("role") as string,
      })

      setEditingUser(null)
      toast.success("User updated successfully!")
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update user")
    } finally {
      setIsUpdatingUser(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    setIsDeletingUser(id)
    try {
      await usersService.delete(id)
      toast.success("User deleted successfully!")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    } finally {
      setIsDeletingUser(null)
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

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "links", label: "Manage Links", icon: LinkIcon },
    { id: "categories", label: "Manage Categories", icon: Tags },
    { id: "users", label: "Manage Users", icon: Users },
  ]

  // Show loading state
  if (linksLoading || categoriesLoading || usersLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
          <p className="text-teal-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (linksError || categoriesError || usersError || statsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load admin data: {linksError || categoriesError || usersError || statsError}
              <br />
              Please check your internet connection and try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">Admin Dashboard</h1>
          <p className="text-teal-600">Workforce Group Automation Hub Administration</p>
        </div>
        <Button onClick={refetchStats} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Analytics
        </Button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">Total Clicks</CardTitle>
            <BarChart3 className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-800">{stats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-emerald-600">Across all automation tools</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-800">{stats.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-emerald-600">Total unique users</p>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-gradient-to-br from-white to-teal-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">Avg. Clicks/Tool</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-800">{stats.averageClickRate}</div>
            <p className="text-xs text-emerald-600">Average engagement per tool</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-white to-lime-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">Active Tools</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-800">{stats.totalLinks}</div>
            <p className="text-xs text-emerald-600">Total automation tools</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest tool usage and system activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {links
              .sort((a, b) => new Date(b.last_clicked).getTime() - new Date(a.last_clicked).getTime())
              .slice(0, 5)
              .map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{link.title}</p>
                    <p className="text-sm text-gray-600">Last used: {formatDate(link.last_clicked)}</p>
                  </div>
                  <Badge variant="secondary">{link.clicks} clicks</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderLinks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">Manage Links</h1>
          <p className="text-teal-600">Add, edit, and remove automation tool links</p>
        </div>
        <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-green-500 to-teal-600" onClick={handleAddLinkClick}>
              <Plus className="h-4 w-4" />
              Add New Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Automation Tool</DialogTitle>
              <DialogDescription>Create a new automation tool link for your team.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateLink}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="add-title">Title</Label>
                  <Input id="add-title" name="title" placeholder="Tool name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-description">Description</Label>
                  <Textarea id="add-description" name="description" placeholder="What this tool does" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-url">URL</Label>
                  <Input id="add-url" name="url" type="url" placeholder="https://..." required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddLinkOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingLink}>
                  {isCreatingLink ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Add Link"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {links.map((link) => (
          <Card key={link.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{link.title}</h3>
                    <Badge variant="secondary">{link.category}</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{link.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{link.clicks} clicks</span>
                    <span>{link.unique_visitors} unique users</span>
                    <span>Last used: {formatDate(link.last_clicked)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <ExternalLink className="h-3 w-3" />
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={editingLink?.id === link.id} onOpenChange={(open) => !open && setEditingLink(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingLink(link)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Automation Tool</DialogTitle>
                        <DialogDescription>Update the automation tool details.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleUpdateLink}>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input id="edit-title" name="title" defaultValue={link.title} required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                              id="edit-description"
                              name="description"
                              defaultValue={link.description}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-url">URL</Label>
                            <Input id="edit-url" name="url" type="url" defaultValue={link.url} required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Select name="category" defaultValue={link.category} required>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isUpdatingLink}>
                            {isUpdatingLink ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isDeletingLink === link.id}
                        onClick={() => console.log("Delete button clicked for link:", link.id)}
                      >
                        {isDeletingLink === link.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Link</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{link.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            console.log("Confirm delete clicked for link:", link.id)
                            handleDeleteLink(link.id)
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">Manage Categories</h1>
          <p className="text-teal-600">Add, edit, and remove tool categories</p>
        </div>
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-green-500 to-teal-600" onClick={handleAddCategoryClick}>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new category for organizing automation tools.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCategory}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="add-category-name">Category Name</Label>
                  <Input id="add-category-name" name="category" placeholder="e.g., Data Analytics" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingCategory}>
                  {isCreatingCategory ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Add Category"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => {
          const linkCount = links.filter((link) => link.category === category.name).length
          return (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-gray-600">
                      {linkCount} tool{linkCount !== 1 ? "s" : ""} in this category
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={editingCategory?.id === category.id}
                      onOpenChange={(open) => !open && setEditingCategory(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Category</DialogTitle>
                          <DialogDescription>Update the category name.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdateCategory}>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="categoryName">Category Name</Label>
                              <Input id="categoryName" name="categoryName" defaultValue={category.name} required />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" disabled={isUpdatingCategory}>
                              {isUpdatingCategory ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={linkCount > 0 || isDeletingCategory === category.id}
                        >
                          {isDeletingCategory === category.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the "{category.name}" category? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">Manage Users</h1>
          <p className="text-teal-600">Add, edit, and remove system users</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-green-500 to-teal-600" onClick={handleAddUserClick}>
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account for the system.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="add-user-name">Full Name</Label>
                  <Input id="add-user-name" name="name" placeholder="John Doe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-user-email">Email</Label>
                  <Input id="add-user-email" name="email" type="email" placeholder="john@workforcegroup.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-user-role">Role</Label>
                  <Select name="role" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingUser}>
                  {isCreatingUser ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Add User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <Badge variant={user.role === "Administrator" ? "default" : "secondary"}>{user.role}</Badge>
                    <span>Last active: {formatDate(user.last_active)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user information.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleUpdateUser}>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input id="edit-name" name="name" defaultValue={user.name} required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input id="edit-email" name="email" type="email" defaultValue={user.email} required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select name="role" defaultValue={user.role} required>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Administrator">Administrator</SelectItem>
                                <SelectItem value="User">User</SelectItem>
                                <SelectItem value="Viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isUpdatingUser}>
                            {isUpdatingUser ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" disabled={isDeletingUser === user.id}>
                        {isDeletingUser === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{user.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard()
      case "links":
        return renderLinks()
      case "categories":
        return renderCategories()
      case "users":
        return renderUsers()
      default:
        return renderDashboard()
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 to-teal-50">
        <Sidebar className="border-r border-green-200">
          <SidebarHeader className="border-b border-green-200 p-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/workforce-logo.png"
                alt="Workforce Group Logo"
                width={120}
                height={36}
                className="h-8 w-auto"
              />
              <div className="group-data-[collapsible=icon]:hidden">
                <h2 className="text-lg font-semibold text-teal-800">Admin Panel</h2>
                <p className="text-xs text-teal-600">Real-time Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className="w-full justify-start"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-green-200 px-4 bg-white">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 text-sm text-teal-600">
              <Settings className="h-4 w-4" />
              <span>Administration Panel - Powered by Supabase</span>
            </div>
          </header>
          <main className="flex-1 p-6">{renderContent()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
