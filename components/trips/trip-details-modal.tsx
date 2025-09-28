"use client"

import type { Trip } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Calendar, Clock, Truck, FileText } from "lucide-react"
import { format } from "date-fns"

interface TripDetailsModalProps {
  trip: Trip | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TripDetailsModal({ trip, open, onOpenChange }: TripDetailsModalProps) {
  if (!trip) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Trip Details</DialogTitle>
          <DialogDescription>Trip ID: {trip.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Type Badge */}
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={
                trip.productType === "Perishable Goods"
                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                  : trip.productType === "Non-Perishable Goods"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : trip.productType === "Fragile"
                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
              }
            >
              {trip.productType}
            </Badge>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{trip.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{trip.phone}</span>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{trip.email}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Route Information */}
          <div>
            <h3 className="font-semibold mb-3">Route Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Pickup Location</div>
                  <div className="font-medium">{trip.pickupLocation}</div>
                </div>
              </div>
              <div className="ml-4 border-l-2 border-dashed border-muted h-6"></div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Drop-off Location</div>
                  <div className="font-medium">{trip.dropOffLocation}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Schedule Information */}
          <div>
            <h3 className="font-semibold mb-3">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Preferred Date</div>
                  <div className="font-medium">{format(new Date(trip.preferredDate), "MMMM dd, yyyy")}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Time Slot</div>
                  <div className="font-medium">{trip.preferredTimeSlot}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Truck Information */}
          <div>
            <h3 className="font-semibold mb-3">Assigned Truck</h3>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Truck ID</div>
                <div className="font-medium font-mono">{trip.truckId || "Not assigned"}</div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {trip.additionalNotes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Additional Notes
                </h3>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">{trip.additionalNotes}</p>
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span> {format(new Date(trip.createdAt), "MMM dd, yyyy HH:mm")}
            </div>
            <div>
              <span className="font-medium">Updated:</span> {format(new Date(trip.updatedAt), "MMM dd, yyyy HH:mm")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
