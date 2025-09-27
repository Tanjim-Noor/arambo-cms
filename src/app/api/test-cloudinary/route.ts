import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    console.log("🔧 Testing Cloudinary Configuration");
    
    // Test configuration
    const config = {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret_present: !!process.env.CLOUDINARY_API_SECRET,
    };
    
    console.log("📋 Config:", config);
    
    // Try to get upload presets
    try {
      const presets = await cloudinary.api.upload_presets();
      console.log("✅ Upload Presets:", presets);
      
      return Response.json({
        success: true,
        config,
        presets: presets.presets,
        message: "Cloudinary configuration is working!"
      });
    } catch (presetError) {
      console.error("❌ Failed to get upload presets:", presetError);
      
      return Response.json({
        success: false,
        config,
        error: "Failed to get upload presets",
        message: "Cloudinary is configured but cannot access upload presets. This might be a permissions issue.",
        presetError: presetError
      });
    }
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error);
    return Response.json(
      { 
        success: false,
        error: 'Cloudinary configuration failed',
        details: error,
        message: "Check your environment variables"
      },
      { status: 500 }
    );
  }
}