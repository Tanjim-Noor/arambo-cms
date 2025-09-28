"use client"

import { useEffect, useState } from "react"
import type { Truck } from "@/types"
import { api } from "@/lib/api"
import { DataTableGeneric } from "@/components/ui/data-table-generic"
import { createTruckColumns } from "@/components/trucks/truck-columns"
import { TruckDetailsModal } from "@/components/trucks/truck-details-modal"
import { CreateTruckForm } from "@/components/trucks/create-truck-form"
import { Button } from "@/components/ui/button"
import { Plus, Filter, TruckIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExportData } from "@/components/ui/export-data"

export default function TrucksPage() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [heightFilter, setHeightFilter] = useState<string>("all")
  const { toast } = useToast()

  const fetchTrucks = async () => {
    try {
      setLoading(true)
      const response = await api.trucks.getAll()
      setTrucks(response || [])
    } catch (error) {
      console.error("Error fetching trucks:", error)
      toast({
        title: "Error",
        description: "Failed to fetch trucks. Please try again.",
        variant: "destructive",
      })
      setTrucks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrucks()
  }, [])

  const handleView = (truck: Truck) => {
    setSelectedTruck(truck)
    setDetailsOpen(true)
  }

  const handleEdit = (truck: Truck) => {
    setEditingTruck(truck)
    setEditOpen(true)
  }

  const handleDelete = async (truck: Truck) => {
    if (confirm("Are you sure you want to delete this truck? This action cannot be undone.")) {
      try {
        await api.trucks.delete(truck.id)
        toast({
          title: "Success",
          description: "Truck deleted successfully.",
        })
        fetchTrucks()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete truck. It may be assigned to active trips.",
          variant: "destructive",
        })
      }
    }
  }

  const handleCreateSuccess = () => {
    fetchTrucks()
    setEditingTruck(null)
  }

  const handleCreateClose = (open: boolean) => {
    setCreateOpen(open)
    if (!open) {
      setEditingTruck(null)
    }
  }

  const handleEditSuccess = () => {
    fetchTrucks()
    setEditingTruck(null)
  }

  const handleEditClose = (open: boolean) => {
    setEditOpen(open)
    if (!open) {
      setEditingTruck(null)
    }
  }

  const columns = createTruckColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  // Filter trucks based on selected filters
  const filteredTrucks = trucks.filter((truck) => {
    if (statusFilter !== "all") {
      const isAvailable = statusFilter === "available"
      if (truck.isOpen !== isAvailable) return false
    }
    if (heightFilter !== "all") {
      if (heightFilter === "heavy" && truck.height < 15) return false
      if (heightFilter === "medium" && (truck.height < 10 || truck.height >= 15)) return false
      if (heightFilter === "light" && truck.height >= 10) return false
    }
    return true
  })

  // Calculate stats
  const availableTrucks = trucks.filter((t) => t.isOpen).length
  const inUseTrucks = trucks.length - availableTrucks
  const heavyTrucks = trucks.filter((t) => t.height >= 15).length
  const avgHeight = trucks.length > 0 ? trucks.reduce((sum, t) => sum + t.height, 0) / trucks.length : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trucks Management</h1>
          <p className="text-muted-foreground">Manage your fleet of delivery trucks</p>
        </div>
        <div className="flex gap-2">
          <ExportData data={filteredTrucks} filename="trucks-export" module="trucks" />
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Truck
          </Button>
        </div>
      </div>

      {/* Fleet Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trucks</CardTitle>
            <TruckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trucks.length}</div>
            <p className="text-xs text-muted-foreground">Active fleet size</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">{availableTrucks}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{availableTrucks}</div>
            <p className="text-xs text-muted-foreground">Ready for trips</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
            <Badge className="bg-red-500/10 text-red-500 border-red-500/20">{inUseTrucks}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{inUseTrucks}</div>
            <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Height</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHeight.toFixed(1)} ft</div>
            <p className="text-xs text-muted-foreground">{heavyTrucks} heavy duty trucks</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="in-use">In Use</SelectItem>
          </SelectContent>
        </Select>
        <Select value={heightFilter} onValueChange={setHeightFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            <SelectItem value="heavy">Heavy (15+ ft)</SelectItem>
            <SelectItem value="medium">Medium (10-14 ft)</SelectItem>
            <SelectItem value="light">Light (&lt;10 ft)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTableGeneric
        columns={columns}
        data={filteredTrucks}
        searchPlaceholder="Search trucks..."
        module="trucks"
        onRowClick={handleView}
      />

      <TruckDetailsModal truck={selectedTruck} open={detailsOpen} onOpenChange={setDetailsOpen} />

      <CreateTruckForm
        open={createOpen}
        onOpenChange={handleCreateClose}
        onSuccess={handleCreateSuccess}
      />

      <CreateTruckForm
        open={editOpen}
        onOpenChange={handleEditClose}
        onSuccess={handleEditSuccess}
        truck={editingTruck || undefined}
        mode="edit"
      />
    </div>
  )
}
