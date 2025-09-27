"use client"
import { useRouter } from "next/navigation"
import { CreateFurnitureForm } from "@/components/furniture/create-furniture-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Furniture } from "@/types"

export default function NewFurniturePage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSuccess = (furniture: Furniture) => {
    toast({
      title: "Success",
      description: "Furniture request created successfully.",
    })
    router.push("/furniture")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/furniture">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Furniture
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Furniture Request</h1>
          <p className="text-muted-foreground">Fill in the details for a new furniture request</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <CreateFurnitureForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
