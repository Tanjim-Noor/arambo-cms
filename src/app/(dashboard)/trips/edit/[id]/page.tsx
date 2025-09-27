"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { CreateTripForm } from "@/components/trips/create-trip-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { Trip } from "@/types"

export default function EditTripPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)

  const tripId = params.id as string

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true)
        // Mock data for now - replace with actual API call
        const mockTrip: Trip = {
          id: tripId,
          name: "Ahmed Hassan",
          phone: "01712345678",
          email: "ahmed@example.com",
          productType: "Fragile",
          pickupLocation: "Dhanmondi 27, Dhaka",
          dropOffLocation: "Chittagong Port, Chittagong",
          preferredDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          preferredTimeSlot: "Morning (8AM - 12PM)",
          additionalNotes: "Handle with extreme care - electronic equipment",
          truckId: "truck-001",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setTrip(mockTrip)
      } catch (error) {
        console.error("Error fetching trip:", error)
        toast({
          title: "Error",
          description: "Failed to fetch trip details.",
          variant: "destructive",
        })
        router.push("/trips")
      } finally {
        setLoading(false)
      }
    }

    if (tripId) {
      fetchTrip()
    }
  }, [tripId, router, toast])

  const handleSuccess = (updatedTrip: Trip) => {
    toast({
      title: "Success",
      description: "Trip updated successfully.",
    })
    router.push("/trips")
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

  if (!trip) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/trips">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trips
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Trip Not Found</h1>
            <p className="text-muted-foreground">The trip you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/trips">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Trip</h1>
          <p className="text-muted-foreground">Update trip information</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <CreateTripForm trip={trip} isEdit onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
