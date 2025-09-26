"use client"

import type { Furniture } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sofa, Phone, Mail, CreditCard, Package, Calendar } from "lucide-react"
import { format } from "date-fns"

interface FurnitureDetailsModalProps {
  furniture: Furniture | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FurnitureDetailsModal({ furniture, open, onOpenChange }: FurnitureDetailsModalProps) {
  if (!furniture) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Sofa className="h-6 w-6" />
            Furniture Request
          </DialogTitle>
          <DialogDescription>Request ID: {furniture._id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Type Badge */}
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={
                furniture.furnitureType === "Commercial Furniture"
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  : "bg-green-500/10 text-green-500 border-green-500/20"
              }
            >
              {furniture.furnitureType}
            </Badge>
            {furniture.paymentType && (
              <Badge
                variant="outline"
                className={
                  furniture.paymentType === "EMI Plan"
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    : furniture.paymentType === "Lease"
                      ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                      : "bg-green-500/10 text-green-500 border-green-500/20"
                }
              >
                {furniture.paymentType}
              </Badge>
            )}
            {furniture.furnitureCondition && (
              <Badge
                variant="outline"
                className={
                  furniture.furnitureCondition === "New Furniture"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                }
              >
                {furniture.furnitureCondition}
              </Badge>
            )}
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{furniture.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">{furniture.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{furniture.email}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Request Details */}
          <div>
            <h3 className="font-semibold mb-3">Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Sofa className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Furniture Type</div>
                  <div className="font-medium">{furniture.furnitureType}</div>
                </div>
              </div>
              {furniture.paymentType && (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Payment Method</div>
                    <div className="font-medium">{furniture.paymentType}</div>
                  </div>
                </div>
              )}
              {furniture.furnitureCondition && (
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Condition</div>
                    <div className="font-medium">{furniture.furnitureCondition}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Request Summary */}
          <div>
            <h3 className="font-semibold mb-3">Request Summary</h3>
            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{furniture.furnitureType}</span>
              </div>
              {furniture.paymentType && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment:</span>
                  <span className="font-medium">{furniture.paymentType}</span>
                </div>
              )}
              {furniture.furnitureCondition && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Condition:</span>
                  <span className="font-medium">{furniture.furnitureCondition}</span>
                </div>
              )}
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
                <span className="font-medium">Requested:</span>{" "}
                {format(new Date(furniture.createdAt), "MMM dd, yyyy HH:mm")}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{" "}
                {format(new Date(furniture.updatedAt), "MMM dd, yyyy HH:mm")}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
