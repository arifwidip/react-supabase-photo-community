import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface UploadPhotoData {
  file: File
  title: string
  description: string
}

export function useUploadPhoto() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadPhoto = useMutation({
    mutationFn: async ({ file, title, description }: UploadPhotoData) => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)

      // Insert metadata into database
      const { error: insertError, data: photoData } = await supabase
        .from('photos')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          title: title || null,
          description: description || null,
        })
        .select()
        .single()

      if (insertError) {
        // If database insert fails, delete the uploaded file
        await supabase.storage.from('photos').remove([fileName])
        throw new Error(`Failed to save photo metadata: ${insertError.message}`)
      }

      return photoData
    },
    onSuccess: () => {
      toast.success('Photo uploaded successfully!')
      queryClient.invalidateQueries({ queryKey: ['photos'] })
      setUploadProgress(0)
    },
    onError: (error: Error) => {
      toast.error(error.message)
      setUploadProgress(0)
    },
  })

  return {
    uploadPhoto: uploadPhoto.mutate,
    isLoading: uploadPhoto.isPending,
    error: uploadPhoto.error,
    uploadProgress,
    setUploadProgress,
  }
}