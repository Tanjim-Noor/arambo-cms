"use client"

import { useState } from "react"
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Image as ImageIcon, Trash2, ExternalLink, Plus, X } from "lucide-react"

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

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result?.info && typeof result.info === 'object' && 'secure_url' in result.info) {
      const newImage = {
        id: result.info.public_id,
        url: result.info.secure_url,
        filename: result.info.original_filename || 'Uploaded image'
      };
      
      setUploadedImages(prev => {
        if (single) {
          return [newImage];
        }
        return [...prev, newImage];
      });
    }
  };

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
            {/* Upload Widget */}
            {canUploadMore && (
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
                {({ open }) => (
                  <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
                    <CardContent 
                      className="flex flex-col items-center justify-center py-8 space-y-2"
                      onClick={() => open()}
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <div className="text-sm font-medium">
                        Drag & drop {single ? 'an image' : 'images'} here or click to browse
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Supports JPG, PNG, WebP, GIF up to 10MB
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CldUploadWidget>
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