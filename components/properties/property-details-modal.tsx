"use client"

import type { Property } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MapPin,
  Phone,
  Home,
  Bed,
  Bath,
  DollarSign,
  Calendar,
  Building,
  Star,
  Shield,
  Car,
  Dumbbell,
  Waves,
  Camera,
  CheckCircle,
  FileText,
  Hash,
  Users,
  Heart,
  Building2,
} from "lucide-react"

interface PropertyDetailsModalProps {
  property: Property | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PropertyDetailsModal({ property, open, onOpenChange }: PropertyDetailsModalProps) {
  if (!property) return null

  const facilities = [
    { key: "cctv", label: "CCTV", value: property.cctv, icon: Camera },
    { key: "communityHall", label: "Community Hall", value: property.communityHall, icon: Users },
    { key: "gym", label: "Gym", value: property.gym, icon: Dumbbell },
    { key: "masjid", label: "Masjid", value: property.masjid, icon: Building2 },
    { key: "parking", label: "Parking", value: property.parking, icon: Car },
    { key: "petsAllowed", label: "Pets Allowed", value: property.petsAllowed, icon: Heart },
    { key: "swimmingPool", label: "Swimming Pool", value: property.swimmingPool, icon: Waves },
    { key: "trainedGuard", label: "Security Guard", value: property.trainedGuard, icon: Shield },
    { key: "lift", label: "Lift", value: property.lift, icon: Building },
  ].filter((facility) => facility.value)

  const qualityScores = [
    { label: "Cleanliness & Hygiene", value: property.cleanHygieneScore },
    { label: "Sunlight", value: property.sunlightScore },
    { label: "Bathroom Conditions", value: property.bathroomConditionsScore },
  ].filter((score) => score.value !== undefined)

  const statusFlags = [
    { label: "First Owner", value: property.firstOwner, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    { label: "Verified", value: property.isVerified, color: "bg-green-500/10 text-green-500 border-green-500/20" },
    { label: "Confirmed", value: property.isConfirmed, color: "bg-green-500/10 text-green-500 border-green-500/20" },
    { label: "On Loan", value: property.onLoan, color: "bg-red-500/10 text-red-500 border-red-500/20" },
    {
      label: "Paperwork Updated",
      value: property.paperworkUpdated,
      color: "bg-green-500/10 text-green-500 border-green-500/20",
    },
  ].filter((flag) => flag.value)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{property.propertyName}</DialogTitle>
          <DialogDescription className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {property.location}
            {property.area && ` • ${property.area}`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Status Badges */}
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{property.category}</Badge>
              {property.propertyType && <Badge variant="outline">{property.propertyType}</Badge>}
              {property.propertyCategory && <Badge variant="outline">{property.propertyCategory}</Badge>}
              {property.furnishingStatus && property.furnishingStatus !== property.category && (
                <Badge variant="outline">{property.furnishingStatus}</Badge>
              )}
              {property.tenantType && <Badge variant="secondary">{property.tenantType}</Badge>}
              {property.apartmentType && <Badge variant="outline">{property.apartmentType}</Badge>}
              {property.inventoryStatus && (
                <Badge
                  variant="outline"
                  className={
                    property.inventoryStatus === "Found Tenant"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : property.inventoryStatus === "Owner Unreachable"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  }
                >
                  {property.inventoryStatus}
                </Badge>
              )}
            </div>

            {/* Status Flags */}
            {statusFlags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {statusFlags.map((flag) => (
                  <Badge key={flag.label} variant="outline" className={flag.color}>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {flag.label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span> {property.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span> {property.phone}
                </div>
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">Email:</span> {property.email}
                </div>
              </div>
            </div>

            <Separator />

            {/* Property Details */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Home className="h-4 w-4" />
                Property Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Size</div>
                    <div className="font-medium">{property.size} sq ft</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                    <div className="font-medium">{property.bedrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                    <div className="font-medium">{property.bathroom}</div>
                  </div>
                </div>
                {property.baranda !== undefined && property.baranda > 0 && (
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Baranda</div>
                      <div className="font-medium">{property.baranda}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Details */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Location:</span> {property.location}
                </div>
                {property.area && (
                  <div>
                    <span className="text-muted-foreground">Area:</span> {property.area}
                  </div>
                )}
                {property.streetAddress && (
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground">Street Address:</span> {property.streetAddress}
                  </div>
                )}
                {property.landmark && (
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground">Landmark:</span> {property.landmark}
                  </div>
                )}
                {property.houseId && (
                  <div>
                    <span className="text-muted-foreground">House ID:</span> {property.houseId}
                  </div>
                )}
                {property.listingId && (
                  <div>
                    <span className="text-muted-foreground">Listing ID:</span> {property.listingId}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Property Classification */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Property Classification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Listing Type:</span> {property.listingType || "Not specified"}
                </div>
                {property.propertyType && (
                  <div>
                    <span className="text-muted-foreground">Property Type:</span> {property.propertyType}
                  </div>
                )}
                {property.propertyCategory && (
                  <div>
                    <span className="text-muted-foreground">Property Category:</span> {property.propertyCategory}
                  </div>
                )}
                {property.tenantType && (
                  <div>
                    <span className="text-muted-foreground">Preferred Tenant:</span> {property.tenantType}
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Furnishing:</span> {property.category}
                </div>
                {property.furnishingStatus && property.furnishingStatus !== property.category && (
                  <div>
                    <span className="text-muted-foreground">Furnishing Status:</span> {property.furnishingStatus}
                  </div>
                )}
                {property.inventoryStatus && (
                  <div>
                    <span className="text-muted-foreground">Inventory Status:</span>{" "}
                    <Badge
                      variant="outline"
                      className={
                        property.inventoryStatus === "Found Tenant"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : property.inventoryStatus === "Owner Unreachable"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }
                    >
                      {property.inventoryStatus}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Building Information */}
            {(property.floor !== undefined ||
              property.totalFloor !== undefined ||
              property.yearOfConstruction ||
              property.apartmentType) && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Building Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {property.floor !== undefined && (
                      <div>
                        <span className="text-muted-foreground">Floor:</span> {property.floor}
                        {property.totalFloor && ` of ${property.totalFloor}`}
                      </div>
                    )}
                    {property.yearOfConstruction && (
                      <div>
                        <span className="text-muted-foreground">Built:</span> {property.yearOfConstruction}
                      </div>
                    )}
                    {property.apartmentType && (
                      <div>
                        <span className="text-muted-foreground">Apartment Type:</span> {property.apartmentType}
                      </div>
                    )}
                    {property.availableFrom && (
                      <div>
                        <span className="text-muted-foreground">Available From:</span>{" "}
                        {new Date(property.availableFrom).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Financial Information */}
            {(property.rent || property.serviceCharge || property.advanceMonths) && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Financial Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {property.rent && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Monthly Rent</div>
                          <div className="font-medium">৳{property.rent.toLocaleString()}</div>
                        </div>
                      </div>
                    )}
                    {property.serviceCharge && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Service Charge</div>
                          <div className="font-medium">৳{property.serviceCharge.toLocaleString()}</div>
                        </div>
                      </div>
                    )}
                    {property.advanceMonths && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Advance</div>
                          <div className="font-medium">{property.advanceMonths} months</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Quality Scores */}
            {qualityScores.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Quality Scores
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {qualityScores.map((score) => (
                      <div key={score.label} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">{score.label}</div>
                          <div
                            className={`font-medium ${
                              score.value! >= 8
                                ? "text-green-500"
                                : score.value! >= 6
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }`}
                          >
                            {score.value}/10
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Facilities */}
            {facilities.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Facilities & Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {facilities.map((facility) => {
                      const IconComponent = facility.icon
                      return (
                        <div key={facility.key} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                          <IconComponent className="h-4 w-4 text-primary" />
                          <span className="text-sm">{facility.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Media */}
            {(property.coverImage || (property.otherImages && property.otherImages.length > 0)) && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Images
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {property.coverImage && <div>Cover Image: Available</div>}
                    {property.otherImages && property.otherImages.length > 0 && (
                      <div>Additional Images: {property.otherImages.length} photos</div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            {property.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notes
                  </h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{property.notes}</p>
                </div>
              </>
            )}

            {/* System Information */}
            <Separator />
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                System Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Property ID:</span> {property.id}
                </div>
                <div>
                  <span className="text-muted-foreground">Listing Type:</span> {property.listingType || "Not specified"}
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>{" "}
                  {new Date(property.createdAt).toLocaleString()}
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>{" "}
                  {new Date(property.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
