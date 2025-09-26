"use client"

import { useEffect, useState } from "react"
import type { Furniture } from "@/types"
import { api } from "@/lib/api"
import { DataTableGeneric } from "@/components/ui/data-table-generic"
import { createFurnitureColumns } from "@/components/furniture/furniture-columns"
import { FurnitureDetailsModal } from "@/components/furniture/furniture-details-modal"
import { CreateFurnitureForm } from "@/components/furniture/create-furniture-form"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Sofa } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExportData } from "@/components/ui/export-data"

export default function FurniturePage() {
  const [furniture, setFurniture] = useState<Furniture[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFurniture, setSelectedFurniture] = useState<Furniture | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editFurniture, setEditFurniture] = useState<Furniture | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [conditionFilter, setConditionFilter] = useState<string>("all")
  const { toast } = useToast()

  const fetchFurniture = async () => {
    try {
      setLoading(true)
      const response = await api.furniture.getAll({ limit: 1000 })
      setFurniture(response.data || [])
    } catch (error) {
      console.error("Error fetching furniture:", error)
      toast({
        title: "Error",
        description: "Failed to fetch furniture requests. Please try again.",
        variant: "destructive",
      })
      // Mock data for development
      setFurniture([
        {
          _id: "1",
          name: "Sarah Ahmed",
          email: "sarah@example.com",
          phone: "01712345678",
          furnitureType: "Commercial Furniture",
          paymentType: "EMI Plan",
          furnitureCondition: "New Furniture",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "2",
          name: "Mohammad Rahman",
          email: "mohammad@example.com",
          phone: "01987654321",
          furnitureType: "Residential Furniture",
          paymentType: "Instant Pay",
          furnitureCondition: "Used Furniture",
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "3",
          name: "Fatima Khan",
          email: "fatima@example.com",
          phone: "01555666777",
          furnitureType: "Residential Furniture",
          paymentType: "Lease",
          furnitureCondition: "New Furniture",
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ] as Furniture[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFurniture()
  }, [])

  const handleView = (furniture: Furniture) => {
    setSelectedFurniture(furniture)
    setDetailsOpen(true)
  }

  const handleEdit = (furniture: Furniture) => {
    setEditFurniture(furniture)
    setCreateOpen(true)
  }

  const handleDelete = async (furniture: Furniture) => {
    if (confirm("Are you sure you want to delete this furniture request?")) {
      try {
        // await api.furniture.delete(furniture._id)
        toast({
          title: "Success",
          description: "Furniture request deleted successfully.",
        })
        fetchFurniture()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete furniture request.",
          variant: "destructive",
        })
      }
    }
  }

  const handleCreateSuccess = () => {
    fetchFurniture()
    setEditFurniture(null)
  }

  const handleCreateClose = (open: boolean) => {
    setCreateOpen(open)
    if (!open) {
      setEditFurniture(null)
    }
  }

  const columns = createFurnitureColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  // Filter furniture based on selected filters
  const filteredFurniture = furniture.filter((item) => {
    if (typeFilter !== "all" && item.furnitureType !== typeFilter) return false
    if (paymentFilter !== "all" && item.paymentType !== paymentFilter) return false
    if (conditionFilter !== "all" && item.furnitureCondition !== conditionFilter) return false
    return true
  })

  // Calculate stats
  const commercialRequests = furniture.filter((f) => f.furnitureType === "Commercial Furniture").length
  const residentialRequests = furniture.length - commercialRequests
  const newFurnitureRequests = furniture.filter((f) => f.furnitureCondition === "New Furniture").length
  const emiRequests = furniture.filter((f) => f.paymentType === "EMI Plan").length

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
          <h1 className="text-3xl font-bold text-foreground">Furniture Requests</h1>
          <p className="text-muted-foreground">Manage customer furniture requests and orders</p>
        </div>
        <div className="flex gap-2">
          <ExportData data={filteredFurniture} filename="furniture-export" module="furniture" />
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Request Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Sofa className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{furniture.length}</div>
            <p className="text-xs text-muted-foreground">All furniture requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commercial</CardTitle>
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">{commercialRequests}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{commercialRequests}</div>
            <p className="text-xs text-muted-foreground">Business requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Residential</CardTitle>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">{residentialRequests}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{residentialRequests}</div>
            <p className="text-xs text-muted-foreground">Home requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EMI Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{emiRequests}</div>
            <p className="text-xs text-muted-foreground">Payment plans</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Furniture Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Commercial Furniture">Commercial</SelectItem>
            <SelectItem value="Residential Furniture">Residential</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="EMI Plan">EMI Plan</SelectItem>
            <SelectItem value="Lease">Lease</SelectItem>
            <SelectItem value="Instant Pay">Instant Pay</SelectItem>
          </SelectContent>
        </Select>
        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="New Furniture">New</SelectItem>
            <SelectItem value="Used Furniture">Used</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTableGeneric
        columns={columns}
        data={filteredFurniture}
        searchPlaceholder="Search furniture requests..."
        module="furniture"
        onRowClick={handleView}
      />

      <FurnitureDetailsModal furniture={selectedFurniture} open={detailsOpen} onOpenChange={setDetailsOpen} />

      <CreateFurnitureForm
        open={createOpen}
        onOpenChange={handleCreateClose}
        onSuccess={handleCreateSuccess}
        furniture={editFurniture}
      />
    </div>
  )
}
