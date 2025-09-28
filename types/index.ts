export type ListingType = "For Rent" | "For Sale" | "Both"
export type PropertyType = "Apartment" | "House" | "Villa"
export type Category = "Furnished" | "Semi-Furnished" | "Non-Furnished"
export type InventoryStatus = "Looking for Rent" | "Found Tenant" | "Owner Unreachable"
export type TenantType = "Family" | "Bachelor" | "Women"
export type PropertyCategory = "Residential" | "Commercial"
export type FurnishingStatus = "Non-Furnished" | "Semi-Furnished" | "Furnished"
export interface PropertyValueHistory {
  year: number
  value: number
}

export type Area =
  | "Aftabnagar"
  | "Banani"
  | "Banani DOHs"
  | "Banashree"
  | "Banasree"
  | "Baridhara DOHs"
  | "Baridhara J Block"
  | "Bashundhara Residential"
  | "Dhanmondi"
  | "DIT & Merul Badda"
  | "Greenroad"
  | "Gudaraghat"
  | "Gulshan 1"
  | "Gulshan 2"
  | "Lalmatia"
  | "Middle Badda"
  | "Mirpur DOHs"
  | "Mohakhali Amtoli"
  | "Mohakhali DOHs"
  | "Mohakhali TB Gate"
  | "Mohakhali Wireless"
  | "Mohanagar Project"
  | "Niketan"
  | "Nikunja 1"
  | "Nikunja 2"
  | "North Badda"
  | "Notun Bazar"
  | "Shahjadpur Beside & near Suvastu"
  | "Shahjadpur Lakeside"
  | "Shanti Niketan"
  | "South Badda"
  | "South Banasree"
  | "Uttara Sector 1"
  | "Uttara Sector 2"
  | "Uttara Sector 3"
  | "Uttara Sector 4"
  | "Uttara Sector 5"
  | "Uttara Sector 6"
  | "Uttara Sector 7"
  | "Uttara Sector 8"
  | "Uttara Sector 9"
  | "Uttara Sector 10"
  | "Uttara Sector 11"
  | "Uttara Sector 12"
  | "Uttara Sector 13"
  | "Uttara Sector 14"
  | "Uttara Sector 15"
  | "Uttara Sector 16"
  | "Uttara Sector 17"
  | "Uttara Sector 18"

export interface Property {
  id: string
  // Required fields
  name: string
  email: string
  phone: string
  propertyName: string
  listingType: ListingType
  propertyType?: PropertyType
  size: number
  location: string
  bedrooms: number
  bathroom: number
  baranda?: number
  category: Category
  notes?: string
  firstOwner?: boolean
  paperworkUpdated?: boolean
  onLoan?: boolean
  createdAt: Date
  updatedAt: Date
  lift?: boolean
  isConfirmed?: boolean

  // New fields from complete schema
  houseId?: string
  streetAddress?: string
  landmark?: string
  area?: Area
  listingId?: string
  
  // GPS Coordinates
  longitude?: number
  latitude?: number
  inventoryStatus?: InventoryStatus
  tenantType?: TenantType
  propertyCategory?: PropertyCategory
  furnishingStatus?: FurnishingStatus
  availableFrom?: Date
  floor?: number
  totalFloor?: number
  yearOfConstruction?: number
  rent?: number
  serviceCharge?: number
  advanceMonths?: number

  coverImage?: string
  otherImages?: string[]

  // Amenities
  cleanHygieneScore?: number
  sunlightScore?: number
  bathroomConditionsScore?: number

  // Facility boolean fields
  cctv?: boolean
  communityHall?: boolean
  gym?: boolean
  masjid?: boolean
  parking?: boolean
  petsAllowed?: boolean
  swimmingPool?: boolean
  trainedGuard?: boolean

  apartmentType?: string
  isVerified?: boolean
  propertyValueHistory?: PropertyValueHistory[]
}

export interface Trip {
  id: string
  name: string
  phone: string
  email: string
  productType: "Perishable Goods" | "Non-Perishable Goods" | "Fragile" | "Other"
  pickupLocation: string
  dropOffLocation: string
  preferredDate: string
  preferredTimeSlot: "Morning (8AM - 12PM)" | "Afternoon (12PM - 4PM)" | "Evening (4PM - 8PM)"
  additionalNotes?: string
  truckId: string  
  createdAt: string
  updatedAt: string
}

export interface Truck {
  id: string
  modelNumber: string
  height: number
  isOpen: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Furniture {
  id: string
  name: string
  email: string
  phone: string
  furnitureType: "Commercial Furniture" | "Residential Furniture"
  paymentType?: "EMI Plan" | "Lease" | "Instant Pay"
  furnitureCondition?: "New Furniture" | "Used Furniture"
  createdAt: string
  updatedAt: string
}

export interface PropertyStats {
  total: number
  byCategory: Record<string, number>
  byPropertyType: Record<string, number>
  avgSize: number
  avgBedrooms: number
}