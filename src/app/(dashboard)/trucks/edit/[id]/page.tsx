"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { CreateTruckForm } from "@/components/trucks/create-truck-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { Truck } from "@/types"
import { api } from "@/lib/api"

export default function EditTruckPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [truck, setTruck] = useState<Truck | null>(null)
  const [loading, setLoading] = useState(true)

  const truckId = params.id as string

  useEffect(() => {
    const fetchTruck = async () => {
      try {
        setLoading(true)
        const response = await api.trucks.getById(truckId)
        setTruck(response)
      } catch (error) {
        console.error("Error fetching truck:", error)
        toast({
          title: "Error",
          description: "Failed to fetch truck details.",
          variant: "destructive",
        })
        router.push("/trucks")
      } finally {
        setLoading(false)
      }
    }

    if (truckId) {
      fetchTruck()
    }
  }, [truckId, router, toast])

  const handleSuccess = (updatedTruck: Truck) => {
    toast({
      title: "Success",
      description: "Truck updated successfully.",
    })
    router.push("/trucks")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-[120px]" />
          <div>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </div>
        </div>
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  if (!truck) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/trucks">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trucks
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Truck Not Found</h1>
            <p className="text-muted-foreground">The truck you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/trucks">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trucks
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Truck</h1>
          <p className="text-muted-foreground">Update truck information</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <CreateTruckForm truck={truck} isEdit onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
