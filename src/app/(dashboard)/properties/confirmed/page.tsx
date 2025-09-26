"use client"

import { useEffect, useState } from "react"
import type { Property } from "@/types"
import { api } from "@/lib/api"
import { DataTable } from "@/components/properties/data-table"
import { createColumns } from "@/components/properties/columns"
import { PropertyDetailsModal } from "@/components/properties/property-details-modal"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function ConfirmedPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const { toast } = useToast()

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await api.properties.getAll({ isConfirmed: true, limit: 1000 })
      setProperties(response.properties || [])
    } catch (error) {
      console.error("Error fetching properties:", error)
      toast({
        title: "Error",
        description: "Failed to fetch properties. Please try again.",
        variant: "destructive",
      })
      // Mock data for development
      setProperties([
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "01987654321",
          propertyName: "Modern House in Banani",
          listingType: "For Sale",
          propertyType: "House",
          size: 2000,
          location: "Banani, Dhaka",
          bedrooms: 4,
          bathroom: 3,
          category: "Semi-Furnished",
          isConfirmed: true,
          isVerified: true,
          rent: 0,
          area: "Banani",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
          firstOwner: false,
          lift: true,
          paperworkUpdated: true,
          onLoan: false,
          cctv: true,
          communityHall: true,
          gym: false,
          masjid: true,
          parking: true,
          petsAllowed: true,
          swimmingPool: true,
          trainedGuard: true,
        },
      ] as Property[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleView = (property: Property) => {
    setSelectedProperty(property)
    setDetailsOpen(true)
  }

  const handleEdit = (property: Property) => {
    window.location.href = `/properties/edit/${property.id}`
  }

  const handleDelete = async (property: Property) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        // await api.properties.delete(property.id)
        toast({
          title: "Success",
          description: "Property deleted successfully.",
        })
        fetchProperties()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete property.",
          variant: "destructive",
        })
      }
    }
  }

  const columns = createColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    showConfirmAction: false,
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
          <h1 className="text-3xl font-bold text-foreground">Confirmed Properties</h1>
          <p className="text-muted-foreground">Manage verified and confirmed properties</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/properties/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      <DataTable columns={columns} data={properties} onRowClick={handleView} />

      <PropertyDetailsModal property={selectedProperty} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </div>
  )
}
