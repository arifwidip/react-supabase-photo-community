import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUserProfile } from '@/hooks/useUserProfile'
import { usePhotos } from '@/hooks/usePhotos'
import { useUpdateProfile } from '@/hooks/useUserProfile'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { PhotoCard } from '@/components/PhotoCard'
import { Camera, Edit2, Loader2, Save, User, X } from 'lucide-react'

const profileSchema = z.object({
  display_name: z.string().min(1, 'Display name is required').max(50, 'Display name must be less than 50 characters'),
  avatar_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId!)
  const { data: photosData, isLoading: photosLoading } = usePhotos({ userId: userId!, limit: 100 })
  const updateProfile = useUpdateProfile()

  const isOwnProfile = user?.id === userId

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: profile?.display_name || '',
      avatar_url: profile?.avatar_url || '',
    },
  })

  // Update form values when profile data changes
  useState(() => {
    if (profile) {
      reset({
        display_name: profile.display_name || '',
        avatar_url: profile.avatar_url || '',
      })
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    updateProfile.mutate({
      display_name: data.display_name,
      avatar_url: data.avatar_url || null,
    }, {
      onSuccess: () => {
        setIsEditing(false)
      },
    })
  }

  const handleCancelEdit = () => {
    reset({
      display_name: profile?.display_name || '',
      avatar_url: profile?.avatar_url || '',
    })
    setIsEditing(false)
  }

  const getUserInitial = (displayName: string | null, userId: string) => {
    if (displayName) {
      return displayName.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const getUserName = (displayName: string | null, userId: string) => {
    return displayName || `User_${userId.slice(0, 8)}`
  }

  if (profileError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load profile. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const photos = photosData?.data || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {profileLoading ? (
                <Skeleton className="h-20 w-20 rounded-full" />
              ) : (
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={profile?.avatar_url || undefined}
                    alt="Profile avatar"
                  />
                  <AvatarFallback className="text-2xl">
                    {getUserInitial(profile?.display_name, userId!)}
                  </AvatarFallback>
                </Avatar>
              )}

              <div>
                {profileLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold">
                      {getUserName(profile?.display_name, userId!)}
                    </h1>
                    <p className="text-gray-600">
                      Member since {profile ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </>
                )}
              </div>
            </div>

            {isOwnProfile && !profileLoading && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                disabled={updateProfile.isPending}
              >
                {isEditing ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Edit Profile Form */}
        {isOwnProfile && isEditing && (
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    placeholder="Enter your display name"
                    {...register('display_name')}
                    disabled={updateProfile.isPending}
                  />
                  {errors.display_name && (
                    <p className="text-sm text-red-600">{errors.display_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    placeholder="https://example.com/avatar.jpg"
                    {...register('avatar_url')}
                    disabled={updateProfile.isPending}
                  />
                  {errors.avatar_url && (
                    <p className="text-sm text-red-600">{errors.avatar_url.message}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={updateProfile.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Photos Section */}
      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photos">
            <Camera className="mr-2 h-4 w-4" />
            Photos ({photos.length})
          </TabsTrigger>
          <TabsTrigger value="about">
            <User className="mr-2 h-4 w-4" />
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="mt-6">
          {photosLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full" />
                </div>
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-16">
              <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isOwnProfile ? "You haven't uploaded any photos yet" : "No photos yet"}
              </h2>
              <p className="text-gray-600 mb-6">
                {isOwnProfile ? "Start sharing your moments with the community!" : "This user hasn't uploaded any photos yet."}
              </p>
              {isOwnProfile && (
                <Button asChild>
                  <a href="/upload">Upload Your First Photo</a>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About {getUserName(profile?.display_name, userId!)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">{photos.length}</div>
                      <div className="text-sm text-gray-600">Photos</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">
                        {profile ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Joined</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}