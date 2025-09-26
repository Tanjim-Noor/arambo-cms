"use client"

import type { Truck } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TruckIcon, Ruler, FileText, Calendar } from "lucide-react"
import { format } from "date-fns"

interface TruckDetailsModalProps {
  truck: Truck | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TruckDetailsModal({ truck, open, onOpenChange }: TruckDetailsModalProps) {
  if (!truck) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <TruckIcon className="h-6 w-6" />
            {truck.modelNumber}
          </DialogTitle>
          <DialogDescription>Truck ID: {truck.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={
                truck.isOpen
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }
            >
              {truck.isOpen ? "Available" : "In Use"}
            </Badge>
          </div>

          {/* Basic Information */}
          <div>
            <h3 className="font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Model Number</div>
                <div className="font-medium font-mono">{truck.modelNumber}</div>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Height</div>
                  <div className="font-medium">{truck.height} ft</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          {truck.description && (
            <>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </h3>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">{truck.description}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Specifications */}
          <div>
            <h3 className="font-semibold mb-3">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={truck.isOpen ? "text-green-500" : "text-red-500"}>
                    {truck.isOpen ? "Available" : "In Use"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Height:</span>
                  <span>{truck.height} ft</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-mono">{truck.modelNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{truck.height >= 15 ? "Heavy Duty" : truck.height >= 10 ? "Medium" : "Light"}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Added:</span> {format(new Date(truck.createdAt), "MMM dd, yyyy HH:mm")}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {format(new Date(truck.updatedAt), "MMM dd, yyyy HH:mm")}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
