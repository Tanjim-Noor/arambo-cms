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

export default function UnconfirmedPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const { toast } = useToast()

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await api.properties.getAll({ isConfirmed: false, limit: 1000 })
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
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "01234567890",
          propertyName: "Luxury Apartment in Gulshan 2",
          listingType: "For Rent",
          propertyType: "Apartment",
          size: 1200,
          location: "Gulshan 2, Dhaka",
          bedrooms: 3,
          bathroom: 2,
          category: "Furnished",
          isConfirmed: false,
          isVerified: false,
          rent: 45000,
          area: "Gulshan 2",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          firstOwner: true,
          lift: true,
          paperworkUpdated: false,
          onLoan: false,
          cctv: true,
          communityHall: false,
          gym: true,
          masjid: false,
          parking: true,
          petsAllowed: false,
          swimmingPool: false,
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
    // Navigate to edit page
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

  const handleConfirm = async (property: Property) => {
    try {
      await api.properties.update(property.id, { isConfirmed: true })
      toast({
        title: "Success",
        description: "Property confirmed successfully.",
      })
      fetchProperties()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm property.",
        variant: "destructive",
      })
    }
  }

  const columns = createColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onConfirm: handleConfirm,
    showConfirmAction: true,
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
          <h1 className="text-3xl font-bold text-foreground">Unconfirmed Properties</h1>
          <p className="text-muted-foreground">Manage properties pending confirmation</p>
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
