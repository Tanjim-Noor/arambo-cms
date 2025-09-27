import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    console.log("🔧 Testing upload preset 'arambo_unsigned'");
    
    // Test configuration
    const config = {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret_present: !!process.env.CLOUDINARY_API_SECRET,
    };
    
    console.log("📋 Config:", config);
    
    // Try to get the specific upload preset
    try {
      const preset = await cloudinary.api.upload_preset('arambo_unsigned');
      console.log("✅ Upload Preset found:", preset);
      
      return Response.json({
        success: true,
        config,
        preset: preset,
        message: "Upload preset 'arambo_unsigned' exists and is configured correctly!"
      });
    } catch (presetError: unknown) {
      console.error("❌ Upload preset not found:", presetError);
      
      if (presetError && typeof presetError === 'object' && 'http_code' in presetError && presetError.http_code === 404) {
        // Try to create the preset
        try {
          const newPreset = await cloudinary.api.create_upload_preset({
            name: 'arambo_unsigned',
            unsigned: true,
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            max_file_size: 10000000, // 10MB
            folder: 'property-images',
            resource_type: 'image',
            format: 'auto',
            quality: 'auto',
            use_filename: true,
            unique_filename: true,
          });
          
          console.log("✅ Created new upload preset:", newPreset);
          
          return Response.json({
            success: true,
            config,
            preset: newPreset,
            message: "Upload preset 'arambo_unsigned' was created successfully!"
          });
        } catch (createError) {
          console.error("❌ Failed to create upload preset:", createError);
          return Response.json({
            success: false,
            config,
            error: "Upload preset not found and could not be created",
            details: createError
          });
        }
      }
      
      return Response.json({
        success: false,
        config,
        error: "Failed to access upload preset",
        details: presetError
      });
    }
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error);
    return Response.json(
      { 
        success: false,
        error: 'Cloudinary configuration failed',
        details: error
      },
      { status: 500 }
    );
  }
}