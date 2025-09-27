"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { PropertyForm } from "@/components/properties/property-form"
import type { PropertyFormData } from "@/lib/validations/property-form"
import { api } from "@/lib/api"
import { useState } from "react"

export default function NewPropertyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      setIsLoading(true)
      await api.properties.create(data)
      toast({
        title: "Success",
        description: "Property created successfully.",
      })
      router.push("/properties/confirmed")
    } catch (error) {
      console.error("Error creating property:", error)
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-3xl font-bold text-foreground">Add New Property</h1>
          <p className="text-muted-foreground">Fill in the details to add a new property to your inventory</p>
        </div>
      </div>

      <div className="max-w-7xl">
        <PropertyForm
          mode="create"
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
