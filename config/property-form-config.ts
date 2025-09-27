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
  
  // Property Specifications (Group 4)
  size: { required: true, visible: true, order: 13, group: "specs" },
  bedrooms: { required: true, visible: true, order: 14, group: "specs" },
  bathroom: { required: true, visible: true, order: 15, group: "specs" },
  baranda: { required: false, visible: true, order: 16, group: "specs" },
  floor: { required: false, visible: true, order: 17, group: "specs" },
  totalFloor: { required: false, visible: true, order: 18, group: "specs" },
  apartmentType: { required: false, visible: true, order: 19, group: "specs" },
  
  // Furnishing & Category (Group 5)
  category: { required: true, visible: true, order: 20, group: "furnishing" },
  furnishingStatus: { required: false, visible: true, order: 21, group: "furnishing" },
  
  // Rental Information (Group 6)
  inventoryStatus: { required: false, visible: true, order: 22, group: "rental" },
  tenantType: { required: false, visible: true, order: 23, group: "rental" },
  availableFrom: { required: false, visible: true, order: 24, group: "rental" },
  rent: { required: false, visible: true, order: 25, group: "rental" },
  serviceCharge: { required: false, visible: true, order: 26, group: "rental" },
  advanceMonths: { required: false, visible: true, order: 27, group: "rental" },
  
  // Property Details (Group 7)
  yearOfConstruction: { required: false, visible: true, order: 28, group: "details" },
  listingId: { required: false, visible: true, order: 29, group: "details" },
  
  // Amenities Scores (Group 8)
  cleanHygieneScore: { required: false, visible: true, order: 30, group: "amenities" },
  sunlightScore: { required: false, visible: true, order: 31, group: "amenities" },
  bathroomConditionsScore: { required: false, visible: true, order: 32, group: "amenities" },
  
  // Facilities (Group 9 - Boolean checkboxes)
  lift: { required: false, visible: true, order: 33, group: "facilities" },
  cctv: { required: false, visible: true, order: 34, group: "facilities" },
  communityHall: { required: false, visible: true, order: 35, group: "facilities" },
  gym: { required: false, visible: true, order: 36, group: "facilities" },
  masjid: { required: false, visible: true, order: 37, group: "facilities" },
  parking: { required: false, visible: true, order: 38, group: "facilities" },
  petsAllowed: { required: false, visible: true, order: 39, group: "facilities" },
  swimmingPool: { required: false, visible: true, order: 40, group: "facilities" },
  trainedGuard: { required: false, visible: true, order: 41, group: "facilities" },
  
  // Property Status (Group 10)
  firstOwner: { required: false, visible: true, order: 42, group: "status" },
  paperworkUpdated: { required: false, visible: true, order: 43, group: "status" },
  onLoan: { required: false, visible: true, order: 44, group: "status" },
  isConfirmed: { required: false, visible: true, order: 45, group: "status" },
  isVerified: { required: false, visible: true, order: 46, group: "status" },
  
  // Images (Group 11)
  coverImage: { required: false, visible: true, order: 47, group: "images" },
  otherImages: { required: false, visible: false, order: 48, group: "images" }, // Hidden for now
  
  // Notes (Group 12)
  notes: { required: false, visible: true, order: 49, group: "notes" },
};

export const formGroupLabels = {
  basic: "Basic Information",
  property: "Property Details", 
  location: "Location Information",
  specs: "Property Specifications",
  furnishing: "Furnishing Details",
  rental: "Rental Information",
  details: "Additional Details",
  amenities: "Amenities Scores",
  facilities: "Facilities & Features",
  status: "Property Status",
  images: "Images",
  notes: "Additional Notes"
};

export const formGroupOrder = [
  "basic",
  "property", 
  "location",
  "specs",
  "furnishing",
  "rental",
  "details",
  "amenities",
  "facilities",
  "status",
  "images",
  "notes"
];