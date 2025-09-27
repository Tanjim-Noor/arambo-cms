# Property Form Component

A comprehensive, configurable form component for creating and editing properties in the Arambo CMS system.

## Features

- **Type-safe validation** using Zod schema
- **Fully configurable** field visibility, requirements, and grouping
- **Responsive design** with automatic grid layouts
- **Support for all property fields** as defined in the backend interface
- **Reusable** for both create and edit operations
- **Accessible** using shadcn/ui components and proper form validation

## Usage

### Basic Usage

```tsx
import { PropertyForm } from "@/components/properties/property-form";
import type { PropertyFormData } from "@/lib/validations/property-form";

function CreatePropertyPage() {
  const handleSubmit = async (data: PropertyFormData) => {
    // Handle form submission
    await api.properties.create(data);
  };

  return (
    <PropertyForm
      mode="create"
      onSubmit={handleSubmit}
      isLoading={false}
    />
  );
}
```

### Edit Mode

```tsx
function EditPropertyPage({ property }: { property: Property }) {
  const handleSubmit = async (data: PropertyFormData) => {
    await api.properties.update(property.id, data);
  };

  return (
    <PropertyForm
      mode="edit"
      initialData={property}
      onSubmit={handleSubmit}
      isLoading={false}
    />
  );
}
```

### Custom Configuration

```tsx
import { simplePropertyFormConfig } from "@/config/property-form-examples";

function SimplePropertyForm() {
  return (
    <PropertyForm
      mode="create"
      config={simplePropertyFormConfig} // Only shows essential fields
      onSubmit={handleSubmit}
    />
  );
}
```

## Configuration

### Field Configuration

Each field in the form can be configured with:

```typescript
interface FormFieldConfig {
  required: boolean;    // Whether the field is required
  visible: boolean;     // Whether the field is shown
  order: number;        // Order within the group
  group?: string;       // Group the field belongs to
}
```

### Form Groups

Fields are organized into logical groups:

- **basic**: Basic Information (name, email, phone)
- **property**: Property Details (property name, listing type, etc.)
- **location**: Location Information (address, area, landmark)
- **specs**: Property Specifications (size, bedrooms, bathrooms)
- **furnishing**: Furnishing Details (category, furnishing status)
- **rental**: Rental Information (rent, tenant type, availability)
- **details**: Additional Details (year of construction, listing ID)
- **amenities**: Amenities Scores (hygiene, sunlight, bathroom scores)
- **facilities**: Facilities & Features (lift, parking, gym, etc.)
- **status**: Property Status (verified, confirmed, first owner)
- **images**: Images (cover image, other images)
- **notes**: Additional Notes

### Creating Custom Configurations

```typescript
import type { PropertyFormConfig } from "@/config/property-form-config";

export const customConfig: PropertyFormConfig = {
  // Show only required fields
  name: { required: true, visible: true, order: 1, group: "basic" },
  email: { required: true, visible: true, order: 2, group: "basic" },
  // ... other fields
  
  // Hide optional fields
  apartmentType: { required: false, visible: false, order: 30, group: "specs" },
  // ... other hidden fields
};
```

## Form Fields

### Field Types

The form supports various input types:

1. **Text Inputs**: name, email, phone, propertyName, location, etc.
2. **Number Inputs**: size, bedrooms, bathroom, rent, etc.
3. **Select Dropdowns**: listingType, propertyType, category, area, etc.
4. **Date Picker**: availableFrom
5. **Checkboxes**: lift, parking, cctv, firstOwner, etc.
6. **Textarea**: notes

### Validation

All fields are validated using Zod schema with backend-matching constraints:

- Email format validation
- Phone number length constraints
- Number ranges (e.g., bedrooms 0-50, size 1-100000)
- Date constraints
- String length limits
- Enum validations for select fields

## Styling

The form uses Tailwind CSS and shadcn/ui components with:

- Responsive grid layout (1 column on mobile, 2 on md, 3 on lg)
- Proper spacing and typography
- Error state styling
- Loading states with spinners
- Accessible focus indicators

## Examples

See `config/property-form-examples.ts` for:

- **simplePropertyFormConfig**: Minimal form with only essential fields
- **rentalPropertyFormConfig**: Optimized for rental properties
- **defaultPropertyFormConfig**: Full form with all fields

## API Integration

The form integrates with the existing API structure:

```typescript
// Create property
await api.properties.create(formData);

// Update property  
await api.properties.update(propertyId, formData);
```

## Type Safety

The form provides full TypeScript support:

- `PropertyFormData` type from Zod schema
- Validated form data structure
- Type-safe field configuration
- IntelliSense support for all fields

## Accessibility

- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Error message announcements
- Focus management