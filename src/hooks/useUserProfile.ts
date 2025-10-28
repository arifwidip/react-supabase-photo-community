import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Profile } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({ user_id: userId })
            .select()
            .single()

          if (insertError) {
            throw new Error(`Failed to create profile: ${insertError.message}`)
          }

          return newProfile as Profile
        }
        throw new Error(`Failed to fetch profile: ${error.message}`)
      }

      return data as Profile
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`)
      }

      return data as Profile
    },
    onSuccess: (updatedProfile, variables) => {
      toast.success('Profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['profile', updatedProfile.user_id] })

      // Also update user metadata if display name was updated
      if (variables.display_name && user) {
        supabase.auth.updateUser({
          data: { display_name: variables.display_name }
        })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}