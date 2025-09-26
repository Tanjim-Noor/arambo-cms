"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { CreateFurnitureForm } from "@/components/furniture/create-furniture-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { Furniture } from "@/types"
import { api } from "@/lib/api"

export default function EditFurniturePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [furniture, setFurniture] = useState<Furniture | null>(null)
  const [loading, setLoading] = useState(true)

  const furnitureId = params.id as string

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        setLoading(true)
        const response = await api.furniture.getById(furnitureId)
        setFurniture(response)
      } catch (error) {
        console.error("Error fetching furniture:", error)
        toast({
          title: "Error",
          description: "Failed to fetch furniture details.",
          variant: "destructive",
        })
        router.push("/furniture")
      } finally {
        setLoading(false)
      }
    }

    if (furnitureId) {
      fetchFurniture()
    }
  }, [furnitureId, router, toast])

  const handleSuccess = (updatedFurniture: Furniture) => {
    toast({
      title: "Success",
      description: "Furniture request updated successfully.",
    })
    router.push("/furniture")
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
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  if (!furniture) {
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
            <h1 className="text-3xl font-bold text-foreground">Furniture Request Not Found</h1>
            <p className="text-muted-foreground">The furniture request you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-foreground">Edit Furniture Request</h1>
          <p className="text-muted-foreground">Update furniture request information</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <CreateFurnitureForm furniture={furniture} isEdit onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
