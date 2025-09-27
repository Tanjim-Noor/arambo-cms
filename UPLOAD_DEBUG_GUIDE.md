# Image Upload Debug Guide

## Changes Made to Fix Upload Issues

### 1. Updated ImageUploadModal Component
- **Location**: `components/ui/image-upload-modal.tsx`
- **Change**: Switched from unsigned uploads (`uploadPreset="ml_default"`) to signed uploads
- **Reason**: The `ml_default` preset may not be properly configured for unsigned uploads

### 2. Updated API Route
- **Location**: `src/app/api/sign-cloudinary-params/route.ts`
- **Changes**:
  - Added official Cloudinary SDK: `npm install cloudinary`
  - Replaced custom signature generation with `cloudinary.utils.api_sign_request`
  - Added proper Cloudinary configuration

### 3. Environment Variables
- **Location**: `.env.local`
- **Added**: `NEXT_PUBLIC_CLOUDINARY_API_KEY=961969121166623`
- **Required for**: Client-side Cloudinary widget functionality

## Testing the Upload

### Current Configuration:
```javascript
// Image Upload Modal now uses:
<CldUploadWidget
  signatureEndpoint="/api/sign-cloudinary-params"
  options={{
    multiple: !single,
    maxFiles: single ? 1 : maxFiles - (value?.length || 0),
    sources: ['local', 'camera', 'url'],
    resourceType: 'image',
    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    maxFileSize: 10000000, // 10MB
  }}
  onSuccess={handleUploadSuccess}
>
```

### What Should Work Now:
1. **Drag & Drop**: Files can be dragged into the upload area
2. **Browse Button**: Click to select files from computer
3. **Multiple Sources**: Local files, camera, and URL uploads
4. **File Validation**: Only image files up to 10MB
5. **Secure Uploads**: Server-side signature validation

### Troubleshooting:

If uploads still don't work, check:

1. **Network Tab in Browser DevTools**:
   - Look for calls to `/api/sign-cloudinary-params`
   - Check if there are any 500 errors

2. **Console Errors**:
   - Open browser console
   - Look for Cloudinary widget errors

3. **Environment Variables**:
   ```bash
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dexmznutn
   NEXT_PUBLIC_CLOUDINARY_API_KEY=961969121166623
   CLOUDINARY_API_SECRET=NEfy93B1hMf1sGkVLHMv0EGvx3Y
   ```

4. **API Route Response**:
   - The signing endpoint should return `{"signature": "..."}`
   - Check server logs for any errors

### Next Steps:
1. Test the upload functionality in the browser
2. If drag & drop still doesn't work, check browser console for errors
3. Verify the Cloudinary account has proper upload permissions