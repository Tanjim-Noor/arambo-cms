"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Image as ImageIcon, ExternalLink } from "lucide-react"

interface ImageListInputProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function ImageListInput({ value, onChange }: ImageListInputProps) {
  const [newImageUrl, setNewImageUrl] = useState("")

  // Debug logging for prop changes
  console.log("🖼️ ImageListInput - Current Value:", {
    count: value?.length || 0,
    data: value || [],
    isEmpty: !value || value.length === 0,
    type: typeof value,
    isArray: Array.isArray(value)
  });

  const addImage = () => {
    console.log("➕ Adding Image URL:", newImageUrl.trim());
    
    if (newImageUrl.trim() && !value.includes(newImageUrl.trim())) {
      const updatedValue = [...(value || []), newImageUrl.trim()]
      console.log("🔄 Updated image list:", updatedValue);
      console.log("📤 Payload type check:", {
        isArray: Array.isArray(updatedValue),
        length: updatedValue.length,
        allStrings: updatedValue.every(item => typeof item === 'string')
      });
      onChange(updatedValue)
      setNewImageUrl("")
    } else {
      console.warn("⚠️ Image not added - duplicate or empty:", newImageUrl.trim());
    }
  }

  const removeImage = (index: number) => {
    console.log("🗑️ Removing Image at index:", index);
    const updatedValue = (value || []).filter((_, i) => i !== index)
    console.log("🔄 Updated image list after removal:", updatedValue);
    onChange(updatedValue)
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Add image URLs for property photos. Each URL should point to a valid image.
      </div>

      {/* Add new image URL */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addImage()
                  }
                }}
              />
            </div>
            <Button 
              type="button" 
              onClick={addImage}
              disabled={!newImageUrl.trim() || (value || []).includes(newImageUrl.trim())}
            >
              <Plus className="h-4 w-4" />
              Add Image
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display existing images */}
      {(value || []).length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ImageIcon className="h-4 w-4" />
            Property Images ({(value || []).length} images)
          </div>
          <div className="grid gap-2">
            {(value || []).map((imageUrl, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate" title={imageUrl}>
                        Image {index + 1}
                      </div>
                      <div className="text-xs text-muted-foreground truncate" title={imageUrl}>
                        {imageUrl}
                      </div>
                    </div>
                    {isValidUrl(imageUrl) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(imageUrl, '_blank')}
                        className="flex-shrink-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
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

      {(value || []).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No images added yet</p>
          <p className="text-sm">Add image URLs to showcase your property</p>
        </div>
      )}
    </div>
  )
}