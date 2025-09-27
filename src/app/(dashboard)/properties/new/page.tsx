"use client"
import { useRouter } from "next/navigation"
import { CreatePropertyForm } from "@/components/properties/create-property-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Property } from "@/types"

export default function NewPropertyPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSuccess = (property: Property) => {
    toast({
      title: "Success",
      description: "Property created successfully.",
    })
    router.push("/properties/confirmed")
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

      <div className="max-w-4xl">
        <CreatePropertyForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
