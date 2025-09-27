"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { CreatePropertyForm } from "@/components/properties/create-property-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { Property } from "@/types"
import { api } from "@/lib/api"

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  const propertyId = params.id as string

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        const response = await api.properties.getById(propertyId)
        setProperty(response)
      } catch (error) {
        console.error("Error fetching property:", error)
        toast({
          title: "Error",
          description: "Failed to fetch property details.",
          variant: "destructive",
        })
        router.push("/properties/confirmed")
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId, router, toast])

  const handleSuccess = (updatedProperty: Property) => {
    toast({
      title: "Success",
      description: "Property updated successfully.",
    })
    router.push("/properties/confirmed")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-[140px]" />
          <div>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </div>
        </div>
        <div className="max-w-4xl space-y-4">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/properties/confirmed">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Property Not Found</h1>
            <p className="text-muted-foreground">The property you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/properties/confirmed">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Property</h1>
          <p className="text-muted-foreground">Update property information</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <CreatePropertyForm property={property} isEdit onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
