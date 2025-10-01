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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ListingType, PropertyType, InventoryStatus, TenantType, PropertyCategory, FurnishingStatus, Area } from "@/types"

const propertySchema = z.object({
  // Required fields
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email").toLowerCase(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
  propertyName: z
    .string()
    .min(1, "Property name is required")
    .max(200, "Property name must be less than 200 characters"),
  size: z.number().min(1, "Size must be greater than 0").max(100000, "Size seems unrealistic"),
  location: z.string().min(1, "Location is required").max(300, "Location must be less than 300 characters"),
  bedrooms: z.number().min(0, "Bedrooms cannot be negative").max(50, "Too many bedrooms"),
  bathroom: z.number().min(0, "Bathrooms cannot be negative").max(50, "Too many bathrooms"),
  furnishingStatus: z.enum(["Furnished", "Semi-Furnished", "Non-Furnished"]),

  // Property details (required)
  listingType: z.enum(["For Rent", "For Sale", "Both"]),
  propertyType: z.enum(["Apartment", "House", "Villa"]).optional(),
  baranda: z.number().min(0, "Baranda cannot be negative").optional(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),

  // Status fields
  firstOwner: z.boolean().optional(),
  lift: z.boolean().optional(),
  isConfirmed: z.boolean().optional(),
  paperworkUpdated: z.boolean().optional(),
  onLoan: z.boolean().optional(),
  isVerified: z.boolean().optional(),

  // Location details
  houseId: z.string().max(50, "House ID must be less than 50 characters").optional(),
  streetAddress: z.string().max(500, "Street address must be less than 500 characters").optional(),
  landmark: z.string().max(300, "Landmark must be less than 300 characters").optional(),
  area: z
    .enum([
      "Aftabnagar",
      "Banani",
      "Banani DOHs",
      "Banashree",
      "Banasree",
      "Baridhara DOHs",
      "Baridhara J Block",
      "Bashundhara Residential",
      "Dhanmondi",
      "DIT & Merul Badda",
      "Greenroad",
      "Gudaraghat",
      "Gulshan 1",
      "Gulshan 2",
      "Lalmatia",
      "Middle Badda",
      "Mirpur DOHs",
      "Mohakhali Amtoli",
      "Mohakhali DOHs",
      "Mohakhali TB Gate",
      "Mohakhali Wireless",
      "Mohanagar Project",
      "Niketan",
      "Nikunja 1",
      "Nikunja 2",
      "North Badda",
      "Notun Bazar",
      "Shahjadpur Beside & near Suvastu",
      "Shahjadpur Lakeside",
      "Shanti Niketan",
      "South Badda",
      "South Banasree",
      "Uttara Sector 1",
      "Uttara Sector 2",
      "Uttara Sector 3",
      "Uttara Sector 4",
      "Uttara Sector 5",
      "Uttara Sector 6",
      "Uttara Sector 7",
      "Uttara Sector 8",
      "Uttara Sector 9",
      "Uttara Sector 10",
      "Uttara Sector 11",
      "Uttara Sector 12",
      "Uttara Sector 13",
      "Uttara Sector 14",
      "Uttara Sector 15",
      "Uttara Sector 16",
      "Uttara Sector 17",
      "Uttara Sector 18",
    ])
    .optional(),

  // Business fields
  listingId: z.string().max(50, "Listing ID must be less than 50 characters").optional(),
  inventoryStatus: z.enum(["Looking for Rent", "Found Tenant", "Owner Unreachable"]).optional(),
  tenantType: z.enum(["Family", "Bachelor", "Women"]).optional(),
  propertyCategory: z.enum(["Residential", "Commercial"]).optional(),


  // Property specifications
  availableFrom: z.string().optional(),
  floor: z.number().min(0, "Floor cannot be negative").max(200, "Floor seems unrealistic").optional(),
  totalFloor: z.number().min(1, "Total floor must be at least 1").max(200, "Total floor seems unrealistic").optional(),
  yearOfConstruction: z
    .number()
    .min(1800, "Year seems too old")
    .max(new Date().getFullYear() + 5, "Year cannot be too far in future")
    .optional(),

  // Financial information
  rent: z.number().min(0, "Rent cannot be negative").max(10000000, "Rent seems unrealistic").optional(),
  serviceCharge: z
    .number()
    .min(0, "Service charge cannot be negative")
    .max(1000000, "Service charge seems unrealistic")
    .optional(),
  advanceMonths: z
    .number()
    .min(0, "Advance months cannot be negative")
    .max(24, "Advance months seems too high")
    .optional(),

  // Quality scores (1-10 scale)
  cleanHygieneScore: z.number().min(1, "Score must be between 1-10").max(10, "Score must be between 1-10").optional(),
  sunlightScore: z.number().min(1, "Score must be between 1-10").max(10, "Score must be between 1-10").optional(),
  bathroomConditionsScore: z
    .number()
    .min(1, "Score must be between 1-10")
    .max(10, "Score must be between 1-10")
    .optional(),

  // Facility boolean fields
  cctv: z.boolean().default(false),
  communityHall: z.boolean().default(false),
  gym: z.boolean().default(false),
  masjid: z.boolean().default(false),
  parking: z.boolean().default(false),
  petsAllowed: z.boolean().default(false),
  swimmingPool: z.boolean().default(false),
  trainedGuard: z.boolean().default(false),

  // Media fields
  coverImage: z.string().max(500, "Cover image URL must be less than 500 characters").optional(),
  apartmentType: z.string().max(100, "Apartment type must be less than 100 characters").optional(),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface CreatePropertyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  property?: any // For edit mode
}

export function CreatePropertyForm({ open, onOpenChange, onSuccess, property }: CreatePropertyFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const isEdit = !!property

  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: property?.name || "",
      email: property?.email || "",
      phone: property?.phone || "",
      propertyName: property?.propertyName || "",
      size: property?.size || 1000,
      location: property?.location || "",
      bedrooms: property?.bedrooms || 2,
      bathroom: property?.bathroom || 1,
      furnishingStatus: property?.furnishingStatus || "Non-Furnished",
      listingType: property?.listingType || "",
      propertyType: property?.propertyType,
      baranda: property?.baranda || 0,
      notes: property?.notes || "",
      firstOwner: property?.firstOwner || false,
      lift: property?.lift || false,
      isConfirmed: property?.isConfirmed || false,
      paperworkUpdated: property?.paperworkUpdated || false,
      onLoan: property?.onLoan || false,
      isVerified: property?.isVerified || false,
      houseId: property?.houseId || "",
      streetAddress: property?.streetAddress || "",
      landmark: property?.landmark || "",
      area: property?.area,
      listingId: property?.listingId || "",
      inventoryStatus: property?.inventoryStatus,
      tenantType: property?.tenantType,
      propertyCategory: property?.propertyCategory,
      availableFrom: property?.availableFrom || "",
      floor: property?.floor,
      totalFloor: property?.totalFloor,
      yearOfConstruction: property?.yearOfConstruction,
      rent: property?.rent,
      serviceCharge: property?.serviceCharge,
      advanceMonths: property?.advanceMonths,
      cleanHygieneScore: property?.cleanHygieneScore,
      sunlightScore: property?.sunlightScore,
      bathroomConditionsScore: property?.bathroomConditionsScore,
      cctv: property?.cctv || false,
      communityHall: property?.communityHall || false,
      gym: property?.gym || false,
      masjid: property?.masjid || false,
      parking: property?.parking || false,
      petsAllowed: property?.petsAllowed || false,
      swimmingPool: property?.swimmingPool || false,
      trainedGuard: property?.trainedGuard || false,
      coverImage: property?.coverImage || "",
      apartmentType: property?.apartmentType || "",
    },
  })

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      if (isEdit) {
        await api.properties.update(property.id, data)
        toast({
          title: "Success",
          description: "Property updated successfully.",
        })
      } else {
        await api.properties.create(data)
        toast({
          title: "Success",
          description: "Property created successfully.",
        })
      }
      form.reset()
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} property. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Property" : "Add New Property"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update property information" : "Fill in the details to add a new property to your inventory"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pr-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="quality">Quality</TabsTrigger>
                  <TabsTrigger value="facilities">Facilities</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
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
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+8801234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Property Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Beautiful 3BR Apartment" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="furnishingStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Furnishing Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Furnished">Furnished</SelectItem>
                              <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                              <SelectItem value="Non-Furnished">Non-Furnished</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Apartment">Apartment</SelectItem>
                              <SelectItem value="House">House</SelectItem>
                              <SelectItem value="Villa">Villa</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size (sq ft) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1200"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="3"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathroom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="baranda"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Baranda</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional notes about the property..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="location" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Location *</FormLabel>
                          <FormControl>
                            <Input placeholder="Dhanmondi, Dhaka" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select area" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Aftabnagar">Aftabnagar</SelectItem>
                              <SelectItem value="Banani">Banani</SelectItem>
                              <SelectItem value="Banani DOHs">Banani DOHs</SelectItem>
                              <SelectItem value="Dhanmondi">Dhanmondi</SelectItem>
                              <SelectItem value="Gulshan 1">Gulshan 1</SelectItem>
                              <SelectItem value="Gulshan 2">Gulshan 2</SelectItem>
                              <SelectItem value="Uttara Sector 1">Uttara Sector 1</SelectItem>
                              <SelectItem value="Uttara Sector 2">Uttara Sector 2</SelectItem>
                              <SelectItem value="Uttara Sector 3">Uttara Sector 3</SelectItem>
                              <SelectItem value="Uttara Sector 4">Uttara Sector 4</SelectItem>
                              <SelectItem value="Uttara Sector 5">Uttara Sector 5</SelectItem>
                              <SelectItem value="Uttara Sector 6">Uttara Sector 6</SelectItem>
                              <SelectItem value="Uttara Sector 7">Uttara Sector 7</SelectItem>
                              <SelectItem value="Uttara Sector 8">Uttara Sector 8</SelectItem>
                              <SelectItem value="Uttara Sector 9">Uttara Sector 9</SelectItem>
                              <SelectItem value="Uttara Sector 10">Uttara Sector 10</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="houseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>House ID</FormLabel>
                          <FormControl>
                            <Input placeholder="H-123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street, Block A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="landmark"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Landmark</FormLabel>
                          <FormControl>
                            <Input placeholder="Near City Hospital" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="listingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Listing Type</FormLabel>
                          <FormControl>
                            <Input placeholder="For Rent" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="listingId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Listing ID</FormLabel>
                          <FormControl>
                            <Input placeholder="LST-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="inventoryStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inventory Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Looking for Rent">Looking for Rent</SelectItem>
                              <SelectItem value="Found Tenant">Found Tenant</SelectItem>
                              <SelectItem value="Owner Unreachable">Owner Unreachable</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tenantType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tenant Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tenant type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Family">Family</SelectItem>
                              <SelectItem value="Bachelor">Bachelor</SelectItem>
                              <SelectItem value="Women">Women</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Residential">Residential</SelectItem>
                              <SelectItem value="Commercial">Commercial</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="furnishingStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Furnishing Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Non-Furnished">Non-Furnished</SelectItem>
                              <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                              <SelectItem value="Furnished">Furnished</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="floor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="totalFloor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Floors</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearOfConstruction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year of Construction</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2020"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="availableFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available From</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="apartmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apartment Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Duplex" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Status Flags</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="firstOwner"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>First Owner</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lift"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Has Lift</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isConfirmed"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Confirmed</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="paperworkUpdated"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Paperwork Updated</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="onLoan"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>On Loan</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isVerified"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Verified</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="rent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Rent (৳)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="25000"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceCharge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Charge (৳)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="3000"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="advanceMonths"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Advance (Months)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="quality" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cleanHygieneScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cleanliness & Hygiene (1-10)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              placeholder="8"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sunlightScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sunlight (1-10)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              placeholder="7"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathroomConditionsScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathroom Conditions (1-10)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              placeholder="9"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="facilities" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="cctv"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>CCTV</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gym"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Gym</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Parking</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="swimmingPool"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Swimming Pool</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="trainedGuard"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Security Guard</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="communityHall"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Community Hall</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="masjid"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Masjid</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="petsAllowed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Pets Allowed</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Property" : "Create Property"}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
