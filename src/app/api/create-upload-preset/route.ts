import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  try {
    console.log("🔧 Creating unsigned upload preset");
    
    // Create an unsigned upload preset
    const preset = await cloudinary.api.create_upload_preset({
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
    
    console.log("✅ Upload Preset Created:", preset);
    
    return Response.json({
      success: true,
      preset: preset,
      message: "Upload preset created successfully!"
    });
  } catch (error) {
    console.error('❌ Failed to create upload preset:', error);
    return Response.json(
      { 
        success: false,
        error: 'Failed to create upload preset',
        details: error,
      },
      { status: 500 }
    );
  }
}