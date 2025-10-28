import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Loader2, Upload, X } from 'lucide-react'
import { useUploadPhoto } from '@/hooks/useUploadPhoto'

const uploadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
})

type UploadFormData = z.infer<typeof uploadSchema>

export function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const { uploadPhoto, isLoading, uploadProgress } = useUploadPhoto()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileError(null)

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFileError('Please select an image file')
        return
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setFileError('File size must be less than 10MB')
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setFileError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: UploadFormData) => {
    if (!selectedFile) {
      setFileError('Please select an image to upload')
      return
    }

    uploadPhoto(
      {
        file: selectedFile,
        title: data.title,
        description: data.description || '',
      },
      {
        onSuccess: () => {
          reset()
          handleRemoveFile()
        },
      }
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload Photo</CardTitle>
          <CardDescription>
            Share your moments with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* File Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="photo">Photo</Label>

              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label htmlFor="photo" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={previewUrl || ''}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveFile}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p><strong>File:</strong> {selectedFile.name}</p>
                    <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}

              {fileError && (
                <Alert variant="destructive">
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Give your photo a title"
                {...register('title')}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell the story behind your photo (optional)"
                rows={4}
                {...register('description')}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Progress Bar */}
            {isLoading && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !selectedFile}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}