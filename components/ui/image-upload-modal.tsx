"use client"

import { useState } from "react"
// import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Upload, Image as ImageIcon, Trash2, ExternalLink, Plus, X } from "lucide-react"

interface DebugInfo {
  widgetOpened?: boolean;
  widgetClosed?: boolean;
  openedAt?: string;
  closedAt?: string;
  lastError?: string | Error | null;
  errorTime?: string;
  uploadProgress?: string | null;
  lastSuccess?: string;
  successTime?: string;
  openError?: unknown;
}

interface ImageUploadModalProps {
  value: string[];
  onChange: (urls: string[]) => void;
  title: string;
  description?: string;
  maxFiles?: number;
  single?: boolean;
}

export function ImageUploadModal({ 
  value, 
  onChange, 
  title, 
  description, 
  maxFiles = 10,
  single = false 
}: ImageUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; filename: string }>>([]);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

  // Debug environment variables
  // console.log("🔧 ImageUploadModal Debug Info:", {
  //   cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  //   apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  //   hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
  //   currentValue: value,
  //   single: single,
  //   maxFiles: maxFiles
  // });

  // Removed handleUploadSuccess - no longer needed for direct upload

  // Removed widget-related handlers - no longer needed for direct upload
  // Debug info display (only in development)
  // console.log("📊 Current Debug Info:", debugInfo);

  const removeUploadedImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSaveImages = () => {
    const newUrls = uploadedImages.map(img => img.url);
    
    if (single) {
      onChange(newUrls);
    } else {
      const combinedUrls = [...(value || []), ...newUrls];
      onChange(combinedUrls);
    }
    
    setUploadedImages([]);
    setIsOpen(false);
  };

  const removeExistingImage = (index: number) => {
    const updatedUrls = (value || []).filter((_, i) => i !== index);
    onChange(updatedUrls);
  };

  const canUploadMore = single ? uploadedImages.length === 0 : (value?.length || 0) + uploadedImages.length < maxFiles;

  return (
    <div className="space-y-4">
      {/* Existing Images Display */}
      {!single && (value || []).length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ImageIcon className="h-4 w-4" />
            Current Images ({(value || []).length} {single ? 'image' : 'images'})
          </div>
          <div className="grid gap-2">
            {(value || []).map((imageUrl, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded border overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm">
                        Image {index + 1}
                      </div>
                      <div className="text-xs text-muted-foreground truncate" title={imageUrl}>
                        {imageUrl}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(imageUrl, '_blank')}
                      className="flex-shrink-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExistingImage(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Single Image Display */}
      {single && (value || []).length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ImageIcon className="h-4 w-4" />
            Cover Image
          </div>
          <Card className="p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-16 h-16 rounded border overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={value[0]}
                    alt="Cover image"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm">Cover Image</div>
                  <div className="text-xs text-muted-foreground truncate" title={value[0]}>
                    {value[0]}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(value[0], '_blank')}
                  className="flex-shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange([])}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Upload Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={!canUploadMore}
          >
            <Upload className="h-4 w-4 mr-2" />
            {single 
              ? (value?.length > 0 ? 'Change Cover Image' : 'Upload Cover Image')
              : 'Add Images'
            }
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Debug Info (only in development) */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-2 font-mono">
                <div className="font-semibold text-gray-800 mb-2">🔧 Debug Information</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-700">
                    <span className="font-semibold">Cloud:</span> {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold">API Key:</span> {process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing'}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold">Upload Preset:</span> arambo_unsigned
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold">Widget Opened:</span> {debugInfo.widgetOpened ? '✅ Yes' : '❌ No'}
                  </div>
                </div>
                {debugInfo.openedAt && (
                  <div className="text-gray-600">
                    <span className="font-semibold">Last Opened:</span> {debugInfo.openedAt}
                  </div>
                )}
                {debugInfo.lastError && (
                  <div className="text-red-700 bg-red-50 p-2 rounded border border-red-200">
                    <span className="font-semibold">⚠️ Last Error:</span> {debugInfo.lastError instanceof Error ? debugInfo.lastError.message : String(debugInfo.lastError)}
                  </div>
                )}
                {debugInfo.errorTime && (
                  <div className="text-gray-600">
                    <span className="font-semibold">Error Time:</span> {debugInfo.errorTime}
                  </div>
                )}
              </div>
            )} */}

            {/* Direct File Upload */}
            {canUploadMore && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-2">Upload {single ? 'Image' : 'Images'}</div>
                  <div className="text-xs text-gray-500 mb-4">
                    Supports JPG, PNG, WebP, GIF up to 10MB each
                  </div>
                </div>
                
                <input
                  type="file"
                  accept="image/*"
                  multiple={!single}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    // console.log("📁 Files selected for direct upload:", files);
                    
                    if (files.length === 0) return;
                    
                    try {
                      // Show upload progress
                      setDebugInfo(prev => ({ 
                        ...prev, 
                        lastError: null,
                        uploadProgress: `Uploading ${files.length} file(s)...`
                      }));
                      
                      const uploadPromises = files.map(async (file) => {
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        const response = await fetch('/api/direct-upload', {
                          method: 'POST',
                          body: formData,
                        });
                        
                        const result = await response.json();
                        
                        if (!result.success) {
                          throw new Error(result.error || 'Upload failed');
                        }
                        
                        return {
                          id: result.result.public_id,
                          url: result.result.secure_url,
                          filename: result.result.original_filename || file.name
                        };
                      });
                      
                      const uploadedFiles = await Promise.all(uploadPromises);
                      // console.log("✅ Direct upload successful:", uploadedFiles);
                      
                      setUploadedImages(prev => {
                        const updated = single ? uploadedFiles.slice(0, 1) : [...prev, ...uploadedFiles];
                        // console.log("📝 Updated Images State (direct upload):", updated);
                        return updated;
                      });
                      
                      // Clear upload progress
                      setDebugInfo(prev => ({ 
                        ...prev, 
                        uploadProgress: undefined,
                        lastSuccess: `Successfully uploaded ${uploadedFiles.length} image(s)`,
                        successTime: new Date().toISOString()
                      }));
                      
                      // Reset the file input
                      e.target.value = '';
                      
                    } catch (error) {
                      // console.error("❌ Direct upload failed:", error);
                      const errorMessage = error instanceof Error ? error.message : String(error);
                      setDebugInfo(prev => ({ 
                        ...prev, 
                        uploadProgress: undefined,
                        lastError: `Upload failed: ${errorMessage}`,
                        errorTime: new Date().toISOString()
                      }));
                    }
                  }}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-l-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700 file:transition-colors"
                />
                
                {/* Upload Progress/Status */}
                {debugInfo.uploadProgress && (
                  <div className="text-xs text-blue-600 text-center">
                    {debugInfo.uploadProgress}
                  </div>
                )}
                {debugInfo.lastSuccess && (
                  <div className="text-xs text-green-600 text-center">
                    ✅ {debugInfo.lastSuccess}
                  </div>
                )}
                {debugInfo.lastError && (
                  <div className="text-xs text-red-600 text-center">
                    ❌ {String(debugInfo.lastError)}
                  </div>
                )}
                
                {/* Drag and Drop Area */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
                    // console.log("🎯 Files dropped:", files);
                    
                    if (files.length === 0) return;
                    
                    try {
                      // Show upload progress
                      setDebugInfo(prev => ({ 
                        ...prev, 
                        lastError: null,
                        uploadProgress: `Uploading ${files.length} file(s)...`
                      }));
                      
                      const uploadPromises = files.map(async (file) => {
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        const response = await fetch('/api/direct-upload', {
                          method: 'POST',
                          body: formData,
                        });
                        
                        const result = await response.json();
                        
                        if (!result.success) {
                          throw new Error(result.error || 'Upload failed');
                        }
                        
                        return {
                          id: result.result.public_id,
                          url: result.result.secure_url,
                          filename: result.result.original_filename || file.name
                        };
                      });
                      
                      const uploadedFiles = await Promise.all(uploadPromises);
                      // console.log("✅ Drag & drop upload successful:", uploadedFiles);
                      
                      setUploadedImages(prev => {
                        const updated = single ? uploadedFiles.slice(0, 1) : [...prev, ...uploadedFiles];
                        // console.log("📝 Updated Images State (drag & drop):", updated);
                        return updated;
                      });
                      
                      // Clear upload progress
                      setDebugInfo(prev => ({ 
                        ...prev, 
                        uploadProgress: undefined,
                        lastSuccess: `Successfully uploaded ${uploadedFiles.length} image(s)`,
                        successTime: new Date().toISOString()
                      }));
                      
                    } catch (error) {
                      // console.error("❌ Drag & drop upload failed:", error);
                      const errorMessage = error instanceof Error ? error.message : String(error);
                      setDebugInfo(prev => ({ 
                        ...prev, 
                        uploadProgress: undefined,
                        lastError: `Upload failed: ${errorMessage}`,
                        errorTime: new Date().toISOString()
                      }));
                    }
                  }}
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Drag and drop {single ? 'an image' : 'images'} here
                  </div>
                  <div className="text-xs text-gray-500">
                    or use the file browser above
                  </div>
                </div>
              </div>
            )}

            {/* Preview Uploaded Images */}
            {uploadedImages.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ImageIcon className="h-4 w-4" />
                  Newly Uploaded ({uploadedImages.length} {single ? 'image' : 'images'})
                </div>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {uploadedImages.map((image) => (
                    <Card key={image.id} className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded border overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm">{image.filename}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {image.url}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUploadedImage(image.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {uploadedImages.length > 0 && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveImages} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  {single ? 'Set as Cover Image' : `Add ${uploadedImages.length} Image${uploadedImages.length > 1 ? 's' : ''}`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadedImages([]);
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {(value || []).length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          <ImageIcon className="h-6 w-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            No {single ? 'cover image' : 'images'} added yet
          </p>
        </div>
      )}
    </div>
  )
}