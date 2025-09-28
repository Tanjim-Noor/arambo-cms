"use client"

import { useEffect, useState } from "react"
import type { Trip } from "@/types"
import { api } from "@/lib/api"
import { DataTable } from "@/components/properties/data-table"
import { createTripColumns } from "@/components/trips/trip-columns"
import { TripDetailsModal } from "@/components/trips/trip-details-modal"
import { CreateTripForm } from "@/components/trips/create-trip-form"
import { Button } from "@/components/ui/button"
import { Plus, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportData } from "@/components/ui/export-data"

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [productTypeFilter, setProductTypeFilter] = useState<string>("all")
  const [timeSlotFilter, setTimeSlotFilter] = useState<string>("all")
  const { toast } = useToast()

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const response = await api.trips.getAll()
      setTrips(response || [])
    } catch (error) {
      console.error("Error fetching trips:", error)
      toast({
        title: "Error",
        description: "Failed to fetch trips. Please try again.",
        variant: "destructive",
      })
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [])

  const handleView = (trip: Trip) => {
    setSelectedTrip(trip)
    setDetailsOpen(true)
  }

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip)
    setEditOpen(true)
  }

  const handleDelete = async (trip: Trip) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      try {
        await api.trips.delete(trip.id)
        toast({
          title: "Success",
          description: "Trip deleted successfully.",
        })
        fetchTrips()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete trip.",
          variant: "destructive",
        })
      }
    }
  }

  const columns = createTripColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  // Filter trips based on selected filters
  const filteredTrips = trips.filter((trip) => {
    if (productTypeFilter !== "all" && trip.productType !== productTypeFilter) return false
    if (timeSlotFilter !== "all" && trip.preferredTimeSlot !== timeSlotFilter) return false
    return true
  })

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
          <h1 className="text-3xl font-bold text-foreground">Trips Management</h1>
          <p className="text-muted-foreground">Manage and track all delivery trips</p>
        </div>
        <div className="flex gap-2">
          <ExportData data={filteredTrips} filename="trips-export" module="trips" />
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Trip
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trips.filter((t) => new Date(t.preferredDate) > new Date()).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fragile Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.filter((t) => t.productType === "Fragile").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                trips.filter((t) => {
                  const tripDate = new Date(t.preferredDate)
                  const now = new Date()
                  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                  return tripDate >= now && tripDate <= weekFromNow
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={productTypeFilter} onValueChange={setProductTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Product Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Product Types</SelectItem>
            <SelectItem value="Perishable Goods">Perishable Goods</SelectItem>
            <SelectItem value="Non-Perishable Goods">Non-Perishable Goods</SelectItem>
            <SelectItem value="Fragile">Fragile</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={timeSlotFilter} onValueChange={setTimeSlotFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Time Slot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time Slots</SelectItem>
            <SelectItem value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</SelectItem>
            <SelectItem value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</SelectItem>
            <SelectItem value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredTrips} onRowClick={handleView} />

      <TripDetailsModal trip={selectedTrip} open={detailsOpen} onOpenChange={setDetailsOpen} />

      <CreateTripForm open={createOpen} onOpenChange={setCreateOpen} onSuccess={fetchTrips} />
      
      <CreateTripForm 
        open={editOpen} 
        onOpenChange={setEditOpen} 
        onSuccess={fetchTrips}
        trip={editingTrip || undefined}
        mode="edit"
      />
    </div>
  )
}
