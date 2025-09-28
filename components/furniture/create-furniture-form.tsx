"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Furniture } from "@/types"

const furnitureSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15, "Phone must be less than 15 digits"),
  furnitureType: z.enum(["Commercial Furniture", "Residential Furniture"]),
  paymentType: z.enum(["EMI Plan", "Lease", "Instant Pay"]).optional(),
  furnitureCondition: z.enum(["New Furniture", "Used Furniture"]).optional(),
})

type FurnitureFormData = z.infer<typeof furnitureSchema>

interface CreateFurnitureFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  furniture?: Furniture
  mode?: 'create' | 'edit'
}

export function CreateFurnitureForm({ open, onOpenChange, onSuccess, furniture, mode = 'create' }: CreateFurnitureFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FurnitureFormData>({
    resolver: zodResolver(furnitureSchema),
    defaultValues: {
      name: furniture?.name || "",
      email: furniture?.email || "",
      phone: furniture?.phone || "",
      furnitureType: furniture?.furnitureType || "Residential Furniture",
      paymentType: furniture?.paymentType || undefined,
      furnitureCondition: furniture?.furnitureCondition || undefined,
    },
  })

  const onSubmit = async (data: FurnitureFormData) => {
    try {
      setLoading(true)
      if (mode === 'edit' && furniture?.id) {
        await api.furniture.update(furniture.id, data)
        toast({
          title: "Success",
          description: "Furniture request updated successfully.",
        })
      } else {
        await api.furniture.create(data)
        toast({
          title: "Success",
          description: "Furniture request created successfully.",
        })
      }
      form.reset()
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} furniture request. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? "Edit Furniture Request" : "New Furniture Request"}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? "Update furniture request information" : "Fill in the details for a new furniture request"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Customer Information</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="customer@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="01234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Furniture Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Furniture Details</h3>
              <FormField
                control={form.control}
                name="furnitureType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Furniture Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select furniture type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Commercial Furniture">Commercial Furniture</SelectItem>
                        <SelectItem value="Residential Furniture">Residential Furniture</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EMI Plan">EMI Plan</SelectItem>
                        <SelectItem value="Lease">Lease</SelectItem>
                        <SelectItem value="Instant Pay">Instant Pay</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Optional payment preference</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="furnitureCondition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="New Furniture">New Furniture</SelectItem>
                        <SelectItem value="Used Furniture">Used Furniture</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Optional condition preference</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading 
                  ? (mode === 'edit' ? "Updating..." : "Creating...")
                  : (mode === 'edit' ? "Update Request" : "Create Request")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
