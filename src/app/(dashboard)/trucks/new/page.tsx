"use client"
import { useRouter } from "next/navigation"
import { CreateTruckForm } from "@/components/trucks/create-truck-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Truck } from "@/types"

export default function NewTruckPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSuccess = (truck: Truck) => {
    toast({
      title: "Success",
      description: "Truck added successfully.",
    })
    router.push("/trucks")
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
          <h1 className="text-3xl font-bold text-foreground">Add New Truck</h1>
          <p className="text-muted-foreground">Fill in the details to add a new truck to your fleet</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <CreateTruckForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
