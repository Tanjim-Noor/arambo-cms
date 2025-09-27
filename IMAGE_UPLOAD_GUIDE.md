# Image Upload Implementation Guide

## Overview
This implementation adds Cloudinary-powered image upload functionality to the Property Form with drag & drop support and cloud hosting.

## Features
- **Drag & Drop Upload**: Users can drag images directly into the upload zone
- **Multiple Upload Sources**: Local files, camera, and URL uploads
- **Cloud Storage**: Images are automatically uploaded to Cloudinary and hosted
- **Form Integration**: Seamlessly integrated with existing property form validation
- **Responsive Design**: Works on desktop and mobile devices

## Components Added

### 1. ImageUploadModal (`/components/ui/image-upload-modal.tsx`)
- Modern modal-based image upload interface
- Supports both single image (cover image) and multiple images (gallery)
- Real-time preview of uploaded images
- Drag & drop with visual feedback

### 2. Updated PropertyForm (`/components/properties/property-form.tsx`)
- Replaced URL input fields with ImageUploadModal
- Maintains existing form validation and data structure
- Supports both `coverImage` (string) and `otherImages` (string[]) fields

### 3. Cloudinary API Route (`/src/app/api/sign-cloudinary-params/route.ts`)
- Server-side signature generation for secure uploads
- Handles authentication with Cloudinary API

## Configuration

### Environment Variables (`.env.local`)
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dexmznutn
CLOUDINARY_API_KEY=961969121166623
CLOUDINARY_API_SECRET=NEfy93B1hMf1sGkVLHMv0EGvx3Y
CLOUDINARY_URL=cloudinary://961969121166623:NEfy93B1hMf1sGkVLHMv0EGvx3Y@dexmznutn

# Next.js public environment variables
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dexmznutn
```

### Package Dependencies
- `next-cloudinary`: Cloudinary integration for Next.js
- All existing form dependencies maintained

## Usage

### Cover Image Upload
- Single image selection for property cover
- Replaces existing URL input with drag & drop interface
- Stores hosted image URL as string in `coverImage` field

### Property Images Upload
- Multiple image selection for property gallery
- Advanced upload modal with preview
- Stores array of hosted image URLs in `otherImages` field

### Form Integration
```tsx
// The PropertyForm component automatically uses ImageUploadModal
// No changes needed in parent components
<PropertyForm
  onSubmit={handleSubmit}
  initialData={property}
  mode="create"
/>
```

## Data Structure
The form maintains the same data structure as before:

```typescript
interface PropertyFormData {
  // ... other fields
  coverImage: string;        // Single image URL
  otherImages: string[];     // Array of image URLs
}
```

## Upload Flow
1. User clicks upload button or drags images to drop zone
2. Images are uploaded to Cloudinary automatically
3. Cloudinary returns secure hosted URLs
4. URLs are stored in form fields
5. Form submission includes only the URLs (not file data)
6. Database stores the hosted image URLs

## Upload Limits
- **File Size**: 10MB maximum per image
- **File Types**: JPG, JPEG, PNG, WebP, GIF
- **Maximum Files**: 10 images for gallery, 1 for cover image

## Security
- Uses Cloudinary's signed upload for security
- Server-side signature generation prevents unauthorized uploads
- Images are hosted on Cloudinary's secure CDN

## Testing
1. Start the development server: `npm run dev`
2. Navigate to `/properties/new`
3. Test both cover image and gallery uploads
4. Verify URLs are properly stored in form data

## Troubleshooting

### Upload Errors
- Check Cloudinary credentials in `.env.local`
- Ensure upload preset exists and allows unsigned uploads
- Verify network connectivity to Cloudinary

### Display Issues
- Check that URLs are properly formatted
- Verify images are accessible via direct URL access
- Ensure proper form field binding

## Future Enhancements
- Image transformation and optimization settings
- Upload progress indicators
- Image metadata extraction
- Bulk image operations
- Custom upload presets for different image types