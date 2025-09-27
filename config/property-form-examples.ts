import type { PropertyFormConfig } from "./property-form-config";

// Example: Simple configuration with only required fields visible
export const simplePropertyFormConfig: PropertyFormConfig = {
  // Only show essential fields
  name: { required: true, visible: true, order: 1, group: "basic" },
  email: { required: true, visible: true, order: 2, group: "basic" },
  phone: { required: true, visible: true, order: 3, group: "basic" },
  propertyName: { required: true, visible: true, order: 4, group: "property" },
  listingType: { required: true, visible: true, order: 5, group: "property" },
  size: { required: true, visible: true, order: 6, group: "specs" },
  location: { required: true, visible: true, order: 7, group: "location" },
  bedrooms: { required: true, visible: true, order: 8, group: "specs" },
  bathroom: { required: true, visible: true, order: 9, group: "specs" },
  category: { required: true, visible: true, order: 10, group: "furnishing" },
  
  // Hide all other fields
  propertyType: { required: false, visible: false, order: 11, group: "property" },
  propertyCategory: { required: false, visible: false, order: 12, group: "property" },
  area: { required: false, visible: false, order: 13, group: "location" },
  streetAddress: { required: false, visible: false, order: 14, group: "location" },
  landmark: { required: false, visible: false, order: 15, group: "location" },
  houseId: { required: false, visible: false, order: 16, group: "location" },
  baranda: { required: false, visible: false, order: 17, group: "specs" },
  floor: { required: false, visible: false, order: 18, group: "specs" },
  totalFloor: { required: false, visible: false, order: 19, group: "specs" },
  apartmentType: { required: false, visible: false, order: 20, group: "specs" },
  furnishingStatus: { required: false, visible: false, order: 21, group: "furnishing" },
  inventoryStatus: { required: false, visible: false, order: 22, group: "rental" },
  tenantType: { required: false, visible: false, order: 23, group: "rental" },
  availableFrom: { required: false, visible: false, order: 24, group: "rental" },
  rent: { required: false, visible: false, order: 25, group: "rental" },
  serviceCharge: { required: false, visible: false, order: 26, group: "rental" },
  advanceMonths: { required: false, visible: false, order: 27, group: "rental" },
  yearOfConstruction: { required: false, visible: false, order: 28, group: "details" },
  listingId: { required: false, visible: false, order: 29, group: "details" },
  cleanHygieneScore: { required: false, visible: false, order: 30, group: "amenities" },
  sunlightScore: { required: false, visible: false, order: 31, group: "amenities" },
  bathroomConditionsScore: { required: false, visible: false, order: 32, group: "amenities" },
  lift: { required: false, visible: false, order: 33, group: "facilities" },
  cctv: { required: false, visible: false, order: 34, group: "facilities" },
  communityHall: { required: false, visible: false, order: 35, group: "facilities" },
  gym: { required: false, visible: false, order: 36, group: "facilities" },
  masjid: { required: false, visible: false, order: 37, group: "facilities" },
  parking: { required: false, visible: false, order: 38, group: "facilities" },
  petsAllowed: { required: false, visible: false, order: 39, group: "facilities" },
  swimmingPool: { required: false, visible: false, order: 40, group: "facilities" },
  trainedGuard: { required: false, visible: false, order: 41, group: "facilities" },
  firstOwner: { required: false, visible: false, order: 42, group: "status" },
  paperworkUpdated: { required: false, visible: false, order: 43, group: "status" },
  onLoan: { required: false, visible: false, order: 44, group: "status" },
  isConfirmed: { required: false, visible: false, order: 45, group: "status" },
  isVerified: { required: false, visible: false, order: 46, group: "status" },
  coverImage: { required: false, visible: false, order: 47, group: "images" },
  otherImages: { required: false, visible: false, order: 48, group: "images" },
  notes: { required: false, visible: false, order: 49, group: "notes" },
};

// Example: Rental-focused configuration
export const rentalPropertyFormConfig: PropertyFormConfig = {
  // Basic Information
  name: { required: true, visible: true, order: 1, group: "basic" },
  email: { required: true, visible: true, order: 2, group: "basic" },
  phone: { required: true, visible: true, order: 3, group: "basic" },
  
  // Property Details
  propertyName: { required: true, visible: true, order: 4, group: "property" },
  listingType: { required: true, visible: true, order: 5, group: "property" },
  propertyType: { required: true, visible: true, order: 6, group: "property" },
  propertyCategory: { required: false, visible: true, order: 7, group: "property" },
  
  // Location
  location: { required: true, visible: true, order: 8, group: "location" },
  area: { required: true, visible: true, order: 9, group: "location" },
  streetAddress: { required: false, visible: true, order: 10, group: "location" },
  
  // Specs
  size: { required: true, visible: true, order: 11, group: "specs" },
  bedrooms: { required: true, visible: true, order: 12, group: "specs" },
  bathroom: { required: true, visible: true, order: 13, group: "specs" },
  floor: { required: false, visible: true, order: 14, group: "specs" },
  totalFloor: { required: false, visible: true, order: 15, group: "specs" },
  
  // Furnishing
  category: { required: true, visible: true, order: 16, group: "furnishing" },
  furnishingStatus: { required: false, visible: true, order: 17, group: "furnishing" },
  
  // Rental Information - Most Important
  inventoryStatus: { required: true, visible: true, order: 18, group: "rental" },
  tenantType: { required: true, visible: true, order: 19, group: "rental" },
  availableFrom: { required: false, visible: true, order: 20, group: "rental" },
  rent: { required: true, visible: true, order: 21, group: "rental" },
  serviceCharge: { required: false, visible: true, order: 22, group: "rental" },
  advanceMonths: { required: false, visible: true, order: 23, group: "rental" },
  
  // Key Facilities for Rental
  lift: { required: false, visible: true, order: 24, group: "facilities" },
  parking: { required: false, visible: true, order: 25, group: "facilities" },
  cctv: { required: false, visible: true, order: 26, group: "facilities" },
  
  // Hide less relevant fields for rental
  houseId: { required: false, visible: false, order: 27, group: "location" },
  landmark: { required: false, visible: false, order: 28, group: "location" },
  baranda: { required: false, visible: false, order: 29, group: "specs" },
  apartmentType: { required: false, visible: false, order: 30, group: "specs" },
  yearOfConstruction: { required: false, visible: false, order: 31, group: "details" },
  listingId: { required: false, visible: false, order: 32, group: "details" },
  cleanHygieneScore: { required: false, visible: false, order: 33, group: "amenities" },
  sunlightScore: { required: false, visible: false, order: 34, group: "amenities" },
  bathroomConditionsScore: { required: false, visible: false, order: 35, group: "amenities" },
  communityHall: { required: false, visible: false, order: 36, group: "facilities" },
  gym: { required: false, visible: false, order: 37, group: "facilities" },
  masjid: { required: false, visible: false, order: 38, group: "facilities" },
  petsAllowed: { required: false, visible: false, order: 39, group: "facilities" },
  swimmingPool: { required: false, visible: false, order: 40, group: "facilities" },
  trainedGuard: { required: false, visible: false, order: 41, group: "facilities" },
  firstOwner: { required: false, visible: false, order: 42, group: "status" },
  paperworkUpdated: { required: false, visible: false, order: 43, group: "status" },
  onLoan: { required: false, visible: false, order: 44, group: "status" },
  isConfirmed: { required: false, visible: false, order: 45, group: "status" },
  isVerified: { required: false, visible: false, order: 46, group: "status" },
  coverImage: { required: false, visible: false, order: 47, group: "images" },
  otherImages: { required: false, visible: false, order: 48, group: "images" },
  notes: { required: false, visible: true, order: 49, group: "notes" },
};