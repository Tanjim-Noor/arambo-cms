import { z } from "zod";

const currentYear = new Date().getFullYear();

export const propertyFormSchema = z.object({
  // Basic Information - Required
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email")
    .toLowerCase()
    .trim(),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .trim(),
  
  // Property Details - Required
  propertyName: z.string()
    .min(1, "Property name is required")
    .max(200, "Property name must be less than 200 characters")
    .trim(),
  listingType: z.enum(["For Rent", "For Sale", "Both"] as const),
  size: z.number()
    .min(1, "Size must be greater than 0")
    .max(100000, "Size seems unrealistic"),
  location: z.string()
    .min(1, "Location is required")
    .max(300, "Location must be less than 300 characters")
    .trim(),
  bedrooms: z.number()
    .min(0, "Bedrooms cannot be negative")
    .max(50, "Too many bedrooms"),
  bathroom: z.number()
    .min(0, "Bathrooms cannot be negative")
    .max(50, "Too many bathrooms"),

  // Optional Property Details
  propertyType: z.enum(["Apartment", "House", "Villa"] as const).optional(),
  baranda: z.number().min(0, "Baranda cannot be negative").optional(),
  
  // Location Details - Optional
  houseId: z.string().max(50, "House ID must be less than 50 characters").optional(),
  streetAddress: z.string().max(500, "Street address must be less than 500 characters").optional(),
  landmark: z.string().max(300, "Landmark must be less than 300 characters").optional(),
  
  // GPS Coordinates - Optional
  longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180").optional(),
  latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90").optional(),
  
  area: z.enum([
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
  ] as const).optional(),
  listingId: z.string().max(50, "Listing ID must be less than 50 characters").optional(),
  
  // Property Status - Optional
  inventoryStatus: z.enum(["Looking for Rent", "Found Tenant", "Owner Unreachable"] as const).optional(),
  tenantType: z.enum(["Family", "Bachelor", "Women"] as const).optional(),
  propertyCategory: z.enum(["Residential", "Commercial"] as const).optional(),
  furnishingStatus: z.enum(["Non-Furnished", "Semi-Furnished", "Furnished"] as const),
  
  // Dates and Numbers - Optional
  availableFrom: z.date().optional(),
  floor: z.number().min(0, "Floor cannot be negative").max(200, "Floor seems unrealistic").optional(),
  totalFloor: z.number().min(1, "Total floor must be at least 1").max(200, "Total floor seems unrealistic").optional(),
  yearOfConstruction: z.number()
    .min(1800, "Year of construction seems too old")
    .max(currentYear + 5, "Year of construction cannot be too far in future")
    .optional(),
  rent: z.number().min(0, "Rent cannot be negative").max(10000000, "Rent seems unrealistic").optional(),
  serviceCharge: z.number().min(0, "Service charge cannot be negative").max(1000000, "Service charge seems unrealistic").optional(),
  advanceMonths: z.number().min(0, "Advance months cannot be negative").max(24, "Advance months seems too high").optional(),
  
  // Amenities Scores (1-10) - Optional
  cleanHygieneScore: z.number().min(1, "Clean hygiene score must be between 1-10").max(10, "Clean hygiene score must be between 1-10").optional(),
  sunlightScore: z.number().min(1, "Sunlight score must be between 1-10").max(10, "Sunlight score must be between 1-10").optional(),
  bathroomConditionsScore: z.number().min(1, "Bathroom conditions score must be between 1-10").max(10, "Bathroom conditions score must be between 1-10").optional(),
  
  // Boolean Fields - Optional
  firstOwner: z.boolean().optional(),
  paperworkUpdated: z.boolean().optional(),
  onLoan: z.boolean().optional(),
  lift: z.boolean().optional(),
  isConfirmed: z.boolean().optional(),
  cctv: z.boolean().optional(),
  communityHall: z.boolean().optional(),
  gym: z.boolean().optional(),
  masjid: z.boolean().optional(),
  parking: z.boolean().optional(),
  petsAllowed: z.boolean().optional(),
  swimmingPool: z.boolean().optional(),
  trainedGuard: z.boolean().optional(),
  apartmentType: z.string().max(100, "Apartment type must be less than 100 characters").optional(),
  isVerified: z.boolean().optional(),
  
  // Images - Optional
  coverImage: z.string().max(500, "Cover image URL must be less than 500 characters").optional(),
  otherImages: z.array(z.string()).max(20, "Cannot have more than 20 images").optional(),
  
  // Notes - Optional
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
  
  // Property Value History - Optional
  propertyValueHistory: z.array(
    z.object({
      year: z.number().min(1900, 'Year must be valid').max(new Date().getFullYear() + 20, 'Year cannot be too far in future'),
      value: z.number()
    })
  ).default([]).refine((history) => {
    // Ensure years are unique
    const years = history.map(h => h.year);
    return years.length === new Set(years).size;
  }, { message: 'Property value history cannot have duplicate years' }).optional(),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;