import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'property-images',
      resource_type: 'image',
      quality: 'auto',
      // Removed format: 'auto' as it's causing the error
    });

    console.log("✅ Direct upload success:", result);

    return Response.json({
      success: true,
      result: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        original_filename: file.name,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
      }
    });

  } catch (error) {
    console.error('❌ Direct upload failed:', error);
    return Response.json(
      { 
        success: false,
        error: 'Direct upload failed',
        details: error
      },
      { status: 500 }
    );
  }
}