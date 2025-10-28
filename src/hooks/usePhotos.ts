import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Photo } from '@/types/database'

interface PhotosResponse {
  data: Photo[] | null
  count: number | null
}

interface UsePhotosOptions {
  page?: number
  limit?: number
  userId?: string
}

export function usePhotos({ page = 1, limit = 20, userId }: UsePhotosOptions = {}) {
  return useQuery({
    queryKey: ['photos', page, limit, userId],
    queryFn: async () => {
      let query = supabase
        .from('photos')
        .select(`
          *,
          profiles (
            id,
            user_id,
            display_name,
            avatar_url
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await query.range(from, to)

      if (error) {
        throw new Error(`Failed to fetch photos: ${error.message}`)
      }

      const response: PhotosResponse = {
        data: data as Photo[],
        count,
      }

      return response
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}