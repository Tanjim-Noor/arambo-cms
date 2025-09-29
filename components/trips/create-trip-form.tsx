"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Trip, Truck } from "@/types"

const tripSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15, "Phone must be less than 15 digits"),
  email: z.string().email("Invalid email address"),
  productType: z.enum(["Perishable Goods", "Non-Perishable Goods", "Fragile", "Other"]),
  pickupLocation: z
    .string()
    .min(1, "Pickup location is required")
    .max(300, "Location must be less than 300 characters"),
  dropOffLocation: z
    .string()
    .min(1, "Drop-off location is required")
    .max(300, "Location must be less than 300 characters"),
  preferredDate: z.date({
    message: "Preferred date is required",
  }),
  preferredTimeSlot: z.enum(["Morning (8AM - 12PM)", "Afternoon (12PM - 4PM)", "Evening (4PM - 8PM)"]),
  truckId: z.string().optional(),
  additionalNotes: z.string().max(500, "Notes must be less than 500 characters").optional(),
})

type TripFormData = z.infer<typeof tripSchema>

interface CreateTripFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  trip?: Trip
  mode?: 'create' | 'edit'
}

export function CreateTripForm({ open, onOpenChange, onSuccess, trip, mode = 'create' }: CreateTripFormProps) {
  const [loading, setLoading] = useState(false)
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [trucksLoading, setTrucksLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: trip?.name || "",
      phone: trip?.phone || "",
      email: trip?.email || "",
      productType: trip?.productType || "Non-Perishable Goods",
      pickupLocation: trip?.pickupLocation || "",
      dropOffLocation: trip?.dropOffLocation || "",
      preferredDate: trip?.preferredDate ? new Date(trip.preferredDate) : undefined,
      preferredTimeSlot: trip?.preferredTimeSlot || "Morning (8AM - 12PM)",
      truckId: trip?.truckId || "no-truck",
      additionalNotes: trip?.additionalNotes || "",
    },
  })

  // Load trucks when component mounts
  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        setTrucksLoading(true)
        const trucksData = await api.trucks.getAll()
        setTrucks(trucksData || [])
      } catch (error) {
        console.error("Error fetching trucks:", error)
        toast({
          title: "Warning",
          description: "Failed to load trucks. You can still create the trip without assigning a truck.",
          variant: "destructive",
        })
      } finally {
        setTrucksLoading(false)
      }
    }

    if (open) {
      fetchTrucks()
    }
  }, [open, toast])

  // Reset form with trip data when trip prop changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: trip?.name || "",
        phone: trip?.phone || "",
        email: trip?.email || "",
        productType: trip?.productType || "Non-Perishable Goods",
        pickupLocation: trip?.pickupLocation || "",
        dropOffLocation: trip?.dropOffLocation || "",
        preferredDate: trip?.preferredDate ? new Date(trip.preferredDate) : undefined,
        preferredTimeSlot: trip?.preferredTimeSlot || "Morning (8AM - 12PM)",
        truckId: trip?.truckId || "no-truck",
        additionalNotes: trip?.additionalNotes || "",
      })
    }
  }, [trip, open, form])

  const onSubmit = async (data: TripFormData) => {
    try {
      setLoading(true)
      
      // Clean up the data before submission
      const submitData: any = {
        ...data,
        preferredDate: data.preferredDate.toISOString(),
      }

      // Only include truckId if it's not empty or undefined
      if (data.truckId && data.truckId !== "") {
        submitData.truckId = data.truckId
      }

      if (mode === 'edit' && trip?.id) {
        await api.trips.update(trip.id, submitData)
        toast({
          title: "Success",
          description: "Trip updated successfully.",
        })
      } else {
        await api.trips.create(submitData)
        toast({
          title: "Success",
          description: "Trip created successfully.",
        })
      }
      
      form.reset()
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} trip. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Trip' : 'Create New Trip'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? 'Update the trip details' : 'Fill in the details to schedule a new trip'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Trip Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Trip Details</h3>
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Perishable Goods">Perishable Goods</SelectItem>
                        <SelectItem value="Non-Perishable Goods">Non-Perishable Goods</SelectItem>
                        <SelectItem value="Fragile">Fragile</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pickupLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="Pickup address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dropOffLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drop-off Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="Drop-off address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Preferred Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredTimeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Slot *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</SelectItem>
                          <SelectItem value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</SelectItem>
                          <SelectItem value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Truck Selection */}
            <FormField
              control={form.control}
              name="truckId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Truck (Optional)</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value === "no-truck" ? "" : value)
                    }} 
                    defaultValue={field.value || "no-truck"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={trucksLoading ? "Loading trucks..." : "Select truck"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no-truck">No truck assigned</SelectItem>
                      {trucks.map((truck) => (
                        <SelectItem key={truck.id} value={truck.id}>
                          {truck.modelNumber || `Truck ${truck.id.slice(-8)}`} - {truck.height}ft {truck.isOpen ? "(Open)" : "(Closed)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special instructions or requirements..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading 
                  ? (mode === 'edit' ? "Updating..." : "Creating...")
                  : (mode === 'edit' ? "Update Trip" : "Create Trip")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
