"use client"
import { useRouter } from "next/navigation"
import { CreateTripForm } from "@/components/trips/create-trip-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Trip } from "@/types"

export default function NewTripPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSuccess = (trip: Trip) => {
    toast({
      title: "Success",
      description: "Trip created successfully.",
    })
    router.push("/trips")
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
          <h1 className="text-3xl font-bold text-foreground">Create New Trip</h1>
          <p className="text-muted-foreground">Fill in the details to schedule a new delivery trip</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <CreateTripForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
