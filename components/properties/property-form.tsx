"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Loader2, ExternalLink } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { propertyFormSchema, type PropertyFormData } from "@/lib/validations/property-form";
import { defaultPropertyFormConfig, formGroupLabels, formGroupOrder, type PropertyFormConfig } from "@/config/property-form-config";
import type { Property } from "@/types";
import { PropertyValueHistoryInput } from "@/components/ui/property-value-history-input";
import { ImageUploadModal } from "@/components/ui/image-upload-modal";

interface PropertyFormProps {
  initialData?: Property | null;
  onSubmit: (data: PropertyFormData) => Promise<void> | void;
  isLoading?: boolean;
  config?: PropertyFormConfig;
  mode?: "create" | "edit";
}

export function PropertyForm({ 
  initialData, 
  onSubmit, 
  isLoading = false, 
  config = defaultPropertyFormConfig,
  mode = "create" 
}: PropertyFormProps) {
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      propertyName: initialData?.propertyName || "",
      listingType: initialData?.listingType || "For Rent",
      propertyType: initialData?.propertyType || undefined,
      size: initialData?.size || 0,
      location: initialData?.location || "",
      bedrooms: initialData?.bedrooms || 0,
      bathroom: initialData?.bathroom || 0,
      baranda: initialData?.baranda || undefined,
      notes: initialData?.notes || "",
      houseId: initialData?.houseId || "",
      streetAddress: initialData?.streetAddress || "",
      landmark: initialData?.landmark || "",
      longitude: initialData?.longitude || undefined,
      latitude: initialData?.latitude || undefined,
      area: initialData?.area || undefined,
      listingId: initialData?.listingId || "",
      inventoryStatus: initialData?.inventoryStatus || undefined,
      tenantType: initialData?.tenantType || undefined,
      propertyCategory: initialData?.propertyCategory || undefined,
      furnishingStatus: initialData?.furnishingStatus || "Non-Furnished",
      availableFrom: initialData?.availableFrom ? new Date(initialData.availableFrom) : undefined,
      floor: initialData?.floor || undefined,
      totalFloor: initialData?.totalFloor || undefined,
      yearOfConstruction: initialData?.yearOfConstruction || undefined,
      rent: initialData?.rent || undefined,
      serviceCharge: initialData?.serviceCharge || undefined,
      advanceMonths: initialData?.advanceMonths || undefined,
      cleanHygieneScore: initialData?.cleanHygieneScore || undefined,
      sunlightScore: initialData?.sunlightScore || undefined,
      bathroomConditionsScore: initialData?.bathroomConditionsScore || undefined,
      firstOwner: initialData?.firstOwner || false,
      paperworkUpdated: initialData?.paperworkUpdated || false,
      onLoan: initialData?.onLoan || false,
      lift: initialData?.lift || false,
      isConfirmed: initialData?.isConfirmed || false,
      cctv: initialData?.cctv || false,
      communityHall: initialData?.communityHall || false,
      gym: initialData?.gym || false,
      masjid: initialData?.masjid || false,
      parking: initialData?.parking || false,
      petsAllowed: initialData?.petsAllowed || false,
      swimmingPool: initialData?.swimmingPool || false,
      trainedGuard: initialData?.trainedGuard || false,
      apartmentType: initialData?.apartmentType || "",
      isVerified: initialData?.isVerified || false,
      coverImage: initialData?.coverImage || "",
      otherImages: initialData?.otherImages || [],
      propertyValueHistory: initialData?.propertyValueHistory || [],
    },
  });

  const handleSubmit = async (data: PropertyFormData) => {
    console.group("🏠 Property Form Submission");
    console.log("📝 Form Mode:", mode);
    console.log("📋 Full Form Data:", data);
    
    // Specifically log propertyValueHistory
    console.log("📊 Property Value History:", {
      count: data.propertyValueHistory?.length || 0,
      data: data.propertyValueHistory || [],
      isEmpty: !data.propertyValueHistory || data.propertyValueHistory.length === 0
    });
    
    // Specifically log otherImages
    console.log("🖼️ Other Images:", {
      count: data.otherImages?.length || 0,
      data: data.otherImages || [],
      isEmpty: !data.otherImages || data.otherImages.length === 0,
      type: typeof data.otherImages,
      isArray: Array.isArray(data.otherImages),
      allStrings: Array.isArray(data.otherImages) ? data.otherImages.every(item => typeof item === 'string') : 'N/A'
    });
    
    // Log validation status
    console.log("✅ Form Validation:", {
      isValid: form.formState.isValid,
      errors: form.formState.errors,
      dirtyFields: form.formState.dirtyFields
    });
    
    try {
      await onSubmit(data);
      console.log("✅ Form submission successful");
    } catch (error) {
      console.error("❌ Form submission failed:", error);
    } finally {
      console.groupEnd();
    }
  };

  // Get visible fields sorted by group and order
  const getVisibleFieldsByGroup = () => {
    const fieldsByGroup: Record<string, string[]> = {};
    
    Object.entries(config)
      .filter(([, fieldConfig]) => fieldConfig.visible)
      .sort(([, a], [, b]) => a.order - b.order)
      .forEach(([fieldName, fieldConfig]) => {
        const group = fieldConfig.group || "other";
        if (!fieldsByGroup[group]) {
          fieldsByGroup[group] = [];
        }
        fieldsByGroup[group].push(fieldName);
      });
    
    return fieldsByGroup;
  };

  const visibleFieldsByGroup = getVisibleFieldsByGroup();

  const renderField = (fieldName: string) => {
    const fieldConfig = config[fieldName];
    if (!fieldConfig?.visible) return null;

    const isRequired = fieldConfig.required;

    switch (fieldName) {
      // Text inputs
      case "name":
      case "email":  
      case "phone":
      case "propertyName":
      case "location":
      case "houseId":
      case "streetAddress":
      case "landmark":
      case "listingId":
      case "apartmentType":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={getFieldPlaceholder(fieldName)}
                    type={fieldName === "email" ? "email" : fieldName === "phone" ? "tel" : "text"}
                    {...field}
                    value={String(field.value || "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      // Cover Image Upload
      case "coverImage":
        return (
          <div key={fieldName} className="md:col-span-2 lg:col-span-3">
            <FormField
              name={fieldName}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <ImageUploadModal
                    value={field.value ? [field.value] : []}
                    onChange={(urls: string[]) => field.onChange(urls[0] || "")}
                    title="Upload Cover Image"
                    description="Choose a high-quality image to represent your property"
                    single={true}
                    maxFiles={1}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      // Number inputs
      case "size":
      case "bedrooms":
      case "bathroom":
      case "baranda":
      case "floor":
      case "totalFloor":
      case "yearOfConstruction":
      case "rent":
      case "serviceCharge":
      case "advanceMonths":
      case "cleanHygieneScore":
      case "sunlightScore":
      case "bathroomConditionsScore":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={getFieldPlaceholder(fieldName)}
                    type="number"
                    {...field}
                    value={field.value?.toString() || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      // GPS Coordinates - Uncontrolled inputs to prevent value reset
      case "longitude":
      case "latitude":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={getFieldPlaceholder(fieldName)}
                      type="text"
                      defaultValue={field.value !== undefined ? field.value.toString() : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        
                        if (value.trim() === "") {
                          field.onChange(undefined);
                        } else {
                          // Allow partial input during typing
                          const num = parseFloat(value);
                          if (!isNaN(num)) {
                            field.onChange(num);
                          }
                          // Don't update field if it's not a valid number yet
                        }
                      }}
                      onBlur={(e) => {
                        // Final validation on blur
                        const value = e.target.value.trim();
                        if (value === "") {
                          field.onChange(undefined);
                        } else {
                          const num = parseFloat(value);
                          if (!isNaN(num)) {
                            field.onChange(num);
                          } else {
                            // Clear invalid input
                            field.onChange(undefined);
                            e.target.value = "";
                          }
                        }
                        field.onBlur();
                      }}
                      onFocus={(e) => {
                        // Ensure the input shows the current value when focused
                        const currentValue = field.value;
                        if (currentValue !== undefined) {
                          e.target.value = currentValue.toString();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );

      // Select dropdowns
      case "listingType":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="For Rent">For Rent</SelectItem>
                    <SelectItem value="For Sale">For Sale</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "propertyType":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
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
        );

      case "area":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {areaOptions.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "inventoryStatus":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select inventory status" />
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
        );

      case "tenantType":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
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
        );

      case "propertyCategory":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property category" />
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
        );

      case "furnishingStatus":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select furnishing status" />
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
        );

      // Date picker
      case "availableFrom":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value as Date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value as Date}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      // Checkboxes
      case "firstOwner":
      case "paperworkUpdated":
      case "onLoan":
      case "lift":
      case "isConfirmed":
      case "cctv":
      case "communityHall":
      case "gym":
      case "masjid":
      case "parking":
      case "petsAllowed":
      case "swimmingPool":
      case "trainedGuard":
      case "isVerified":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={Boolean(field.value)}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="flex-1">
                  <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                    {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormMessage className="mt-1" />
                </div>
              </FormItem>
            )}
          />
        );

      // Textarea
      case "notes":
        return (
          <FormField
            key={fieldName}
            name={fieldName}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter additional notes..."
                    className="resize-none"
                    {...field}
                    value={String(field.value || "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      // Other Images (multiple URLs)
      case "otherImages":
        return (
          <div key={fieldName} className="md:col-span-2 lg:col-span-3">
            <FormField
              name={fieldName}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <ImageUploadModal
                    value={field.value || []}
                    onChange={field.onChange}
                    title="Upload Property Images"
                    description="Add multiple images to showcase your property features and rooms"
                    single={false}
                    maxFiles={10}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      // Property Value History
      case "propertyValueHistory":
        return (
          <div key={fieldName} className="md:col-span-2 lg:col-span-3">
            <FormField
              name={fieldName}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {getFieldLabel(fieldName)} {isRequired && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <PropertyValueHistoryInput
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {formGroupOrder.map((groupKey) => {
          const fields = visibleFieldsByGroup[groupKey];
          if (!fields || fields.length === 0) return null;

          return (
            <Card key={groupKey}>
              <CardHeader>
                <CardTitle>{formGroupLabels[groupKey as keyof typeof formGroupLabels]}</CardTitle>
                {groupKey === 'map' && (
                  <div className="space-y-3 pt-2">
                    <div className="text-sm text-muted-foreground">
                      <strong>How to get coordinates from Google Maps:</strong>
                    </div>
                    <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
                      <li>Click on any location on the map</li>
                      <li>Right-click and select &quot;What&apos;s here?&quot; or see the coordinates popup</li>
                      <li>Copy the coordinates that appear (e.g., 23.7937, 90.4152)</li>
                      <li>Paste the first number into <strong>GPS Latitude</strong> and the second number into <strong>GPS Longitude</strong></li>
                    </ol>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Open Google Maps <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fields.map(renderField)}
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Property" : "Update Property"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Helper functions
const getFieldLabel = (fieldName: string): string => {
  const labels: Record<string, string> = {
    name: "Name",
    email: "Email Address",
    phone: "Phone Number",
    propertyName: "Property Name",
    listingType: "Listing Type",
    propertyType: "Property Type",
    size: "Size (sq ft)",
    location: "Location",
    bedrooms: "Bedrooms",
    bathroom: "Bathrooms", 
    baranda: "Balcony/Baranda",
    notes: "Additional Notes",
    houseId: "House ID",
    streetAddress: "Street Address",
    landmark: "Landmark",
    longitude: "GPS Longitude",
    latitude: "GPS Latitude",
    area: "Area",
    listingId: "Listing ID",
    inventoryStatus: "Inventory Status",
    tenantType: "Tenant Type",
    propertyCategory: "Property Category",
    furnishingStatus: "Furnishing Status",
    availableFrom: "Available From",
    floor: "Floor",
    totalFloor: "Total Floors",
    yearOfConstruction: "Year of Construction",
    rent: "Rent (BDT)",
    serviceCharge: "Service Charge (BDT)",
    advanceMonths: "Advance Months",
    cleanHygieneScore: "Clean Hygiene Score (1-10)",
    sunlightScore: "Sunlight Score (1-10)",
    bathroomConditionsScore: "Bathroom Conditions Score (1-10)",
    firstOwner: "First Owner",
    paperworkUpdated: "Paperwork Updated",
    onLoan: "On Loan",
    lift: "Has Lift",
    isConfirmed: "Confirmed",
    cctv: "CCTV",
    communityHall: "Community Hall",
    gym: "Gym",
    masjid: "Masjid",
    parking: "Parking",
    petsAllowed: "Pets Allowed",
    swimmingPool: "Swimming Pool",
    trainedGuard: "Trained Guard",
    apartmentType: "Apartment Type",
    isVerified: "Verified",
    coverImage: "Cover Image URL",
    otherImages: "Other Images URLs",
    propertyValueHistory: "Property Value History",
  };
  return labels[fieldName] || fieldName;
};

const getFieldPlaceholder = (fieldName: string): string => {
  const placeholders: Record<string, string> = {
    name: "Enter your full name",
    email: "Enter your email address",
    phone: "Enter your phone number",
    propertyName: "Enter property name",
    size: "Enter size in square feet",
    location: "Enter property location",
    bedrooms: "Number of bedrooms",
    bathroom: "Number of bathrooms",
    baranda: "Number of balconies",
    houseId: "Enter house ID",
    streetAddress: "Enter street address",
    landmark: "Enter nearby landmark",
    longitude: "e.g., 90.4152 (GPS longitude)",
    latitude: "e.g., 23.7937 (GPS latitude)",
    listingId: "Enter listing ID",
    floor: "Which floor",
    totalFloor: "Total floors in building",
    yearOfConstruction: "Year built",
    rent: "Monthly rent amount",
    serviceCharge: "Monthly service charge",
    advanceMonths: "Number of advance months",
    cleanHygieneScore: "Rate 1-10",
    sunlightScore: "Rate 1-10",
    bathroomConditionsScore: "Rate 1-10",
    apartmentType: "e.g., Studio, 2BHK",
    coverImage: "Enter image URL",
    otherImages: "Enter one image URL per line",
  };
  return placeholders[fieldName] || "";
};

const areaOptions = [
  "Aftabnagar", "Banani", "Banani DOHs", "Banashree", "Banasree", "Baridhara DOHs", 
  "Baridhara J Block", "Bashundhara Residential", "Dhanmondi", "DIT & Merul Badda", 
  "Greenroad", "Gudaraghat", "Gulshan 1", "Gulshan 2", "Lalmatia", "Middle Badda", 
  "Mirpur DOHs", "Mohakhali Amtoli", "Mohakhali DOHs", "Mohakhali TB Gate", 
  "Mohakhali Wireless", "Mohanagar Project", "Niketan", "Nikunja 1", "Nikunja 2", 
  "North Badda", "Notun Bazar", "Shahjadpur Beside & near Suvastu", 
  "Shahjadpur Lakeside", "Shanti Niketan", "South Badda", "South Banasree", 
  "Uttara Sector 1", "Uttara Sector 2", "Uttara Sector 3", "Uttara Sector 4", 
  "Uttara Sector 5", "Uttara Sector 6", "Uttara Sector 7", "Uttara Sector 8", 
  "Uttara Sector 9", "Uttara Sector 10", "Uttara Sector 11", "Uttara Sector 12", 
  "Uttara Sector 13", "Uttara Sector 14", "Uttara Sector 15", "Uttara Sector 16", 
  "Uttara Sector 17", "Uttara Sector 18"
];