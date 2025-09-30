export interface FormFieldConfig {
  required: boolean;
  visible: boolean;
  order: number;
  group?: string;
}

export interface PropertyFormConfig {
  [key: string]: FormFieldConfig;
}

export const defaultPropertyFormConfig: PropertyFormConfig = {
  // Basic Information (Group 1 - Required Personal Info)
  name: { required: true, visible: true, order: 1, group: "basic" },
  email: { required: true, visible: true, order: 2, group: "basic" },
  phone: { required: true, visible: true, order: 3, group: "basic" },
  
  // Property Details (Group 2 - Core Property Info)
  propertyName: { required: true, visible: true, order: 4, group: "property" },
  listingType: { required: true, visible: true, order: 5, group: "property" },
  propertyType: { required: false, visible: true, order: 6, group: "property" },
  propertyCategory: { required: false, visible: true, order: 7, group: "property" },
  
  // Location (Group 3)
  location: { required: true, visible: true, order: 8, group: "location" },
  area: { required: false, visible: true, order: 9, group: "location" },
  streetAddress: { required: false, visible: true, order: 10, group: "location" },
  landmark: { required: false, visible: true, order: 11, group: "location" },
  houseId: { required: false, visible: true, order: 12, group: "location" },
  
  // Map Information (Group 4)
  latitude: { required: false, visible: true, order: 13, group: "map" },
  longitude: { required: false, visible: true, order: 14, group: "map" },
  
  // Property Specifications (Group 5)
  size: { required: true, visible: true, order: 15, group: "specs" },
  bedrooms: { required: true, visible: true, order: 16, group: "specs" },
  bathroom: { required: true, visible: true, order: 17, group: "specs" },
  baranda: { required: false, visible: true, order: 18, group: "specs" },
  floor: { required: false, visible: true, order: 19, group: "specs" },
  totalFloor: { required: false, visible: true, order: 20, group: "specs" },
  apartmentType: { required: false, visible: true, order: 21, group: "specs" },
  
  // Furnishing Details (Group 6)
  furnishingStatus: { required: true, visible: true, order: 22, group: "furnishing" },
  
  // Rental Information (Group 7)
  inventoryStatus: { required: false, visible: true, order: 23, group: "rental" },
  tenantType: { required: false, visible: true, order: 24, group: "rental" },
  availableFrom: { required: false, visible: true, order: 25, group: "rental" },
  rent: { required: false, visible: true, order: 26, group: "rental" },
  serviceCharge: { required: false, visible: true, order: 27, group: "rental" },
  advanceMonths: { required: false, visible: true, order: 28, group: "rental" },
  
  // Property Details (Group 8)
  yearOfConstruction: { required: false, visible: true, order: 29, group: "details" },
  listingId: { required: false, visible: true, order: 30, group: "details" },
  
  // Amenities Scores (Group 9)
  cleanHygieneScore: { required: false, visible: true, order: 31, group: "amenities" },
  sunlightScore: { required: false, visible: true, order: 32, group: "amenities" },
  bathroomConditionsScore: { required: false, visible: true, order: 33, group: "amenities" },
  
  // Facilities (Group 10 - Boolean checkboxes)
  lift: { required: false, visible: true, order: 34, group: "facilities" },
  cctv: { required: false, visible: true, order: 35, group: "facilities" },
  communityHall: { required: false, visible: true, order: 36, group: "facilities" },
  gym: { required: false, visible: true, order: 37, group: "facilities" },
  masjid: { required: false, visible: true, order: 38, group: "facilities" },
  parking: { required: false, visible: true, order: 39, group: "facilities" },
  petsAllowed: { required: false, visible: true, order: 40, group: "facilities" },
  swimmingPool: { required: false, visible: true, order: 41, group: "facilities" },
  trainedGuard: { required: false, visible: true, order: 42, group: "facilities" },
  
  // Property Status (Group 11)
  firstOwner: { required: false, visible: true, order: 43, group: "status" },
  paperworkUpdated: { required: false, visible: true, order: 44, group: "status" },
  onLoan: { required: false, visible: true, order: 45, group: "status" },
  isConfirmed: { required: false, visible: true, order: 46, group: "status" },
  isVerified: { required: false, visible: true, order: 47, group: "status" },
  
  // Images (Group 12)
  coverImage: { required: false, visible: true, order: 48, group: "images" },
  otherImages: { required: false, visible: true, order: 49, group: "images" },
  
  // Notes (Group 13)
  notes: { required: false, visible: true, order: 50, group: "notes" },
  
  // Property Value History (Group 14)
  propertyValueHistory: { required: false, visible: true, order: 51, group: "valueHistory" },
};

export const formGroupLabels = {
  basic: "Basic Information",
  property: "Property Details", 
  location: "Location Information",
  map: "Map Information",
  specs: "Property Specifications",
  furnishing: "Furnishing Details",
  rental: "Rental Information",
  details: "Additional Details",
  amenities: "Amenities Scores",
  facilities: "Facilities & Features",
  status: "Property Status",
  images: "Images",
  notes: "Additional Notes",
  valueHistory: "Property Value History"
};

export const formGroupOrder = [
  "basic",
  "property", 
  "location",
  "map",
  "specs",
  "furnishing",
  "rental",
  "details",
  "amenities",
  "facilities",
  "status",
  "images",
  "notes",
  "valueHistory"
];