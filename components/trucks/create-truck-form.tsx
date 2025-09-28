"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Truck } from "@/types"

const truckSchema = z.object({
  modelNumber: z
    .string()
    .min(1, "Model number is required")
    .max(100, "Model number must be less than 100 characters")
    .regex(/^[A-Z0-9-]+$/, "Model number must contain only uppercase letters, numbers, and hyphens"),
  height: z
    .number()
    .min(1, "Height must be at least 1 ft")
    .max(100, "Height must be less than 100 ft")
    .positive("Height must be positive"),
  isOpen: z.boolean(),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
})

type TruckFormData = z.infer<typeof truckSchema>

interface CreateTruckFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  truck?: Truck // For edit mode
  mode?: 'create' | 'edit'
}

export function CreateTruckForm({ open, onOpenChange, onSuccess, truck, mode = 'create' }: CreateTruckFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<TruckFormData>({
    resolver: zodResolver(truckSchema),
    defaultValues: {
      modelNumber: truck?.modelNumber || "",
      height: truck?.height || 10,
      isOpen: truck?.isOpen ?? true,
      description: truck?.description || "",
    },
  })

  const onSubmit = async (data: TruckFormData) => {
    try {
      setLoading(true)
      if (mode === 'edit' && truck?.id) {
        await api.trucks.update(truck.id, data)
        toast({
          title: "Success",
          description: "Truck updated successfully.",
        })
      } else {
        await api.trucks.create(data)
        toast({
          title: "Success",
          description: "Truck created successfully.",
        })
      }
      form.reset()
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} truck. Please try again.`,
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
          <DialogTitle>{mode === 'edit' ? "Edit Truck" : "Add New Truck"}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? "Update truck information" : "Fill in the details to add a new truck to your fleet"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="modelNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="TR-001" {...field} className="font-mono" />
                  </FormControl>
                  <FormDescription>Use format: TR-XXX (uppercase letters, numbers, hyphens only)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (ft) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Truck height in feet</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isOpen"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Available for Trips</FormLabel>
                    <FormDescription>Mark truck as available for new trip assignments</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details about the truck..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional description or notes about the truck</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading 
                  ? (mode === 'edit' ? "Updating..." : "Creating...") 
                  : (mode === 'edit' ? "Update Truck" : "Create Truck")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
