import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Photo } from '@/types/database'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, User } from 'lucide-react'

interface PhotoCardProps {
  photo: Photo
}

export function PhotoCard({ photo }: PhotoCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const getUserInitial = (displayName: string | null, email: string) => {
    if (displayName) {
      return displayName.charAt(0).toUpperCase()
    }
    if (email) {
      return email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const getUserName = (displayName: string | null, email: string) => {
    return displayName || email.split('@')[0]
  }

  return (
    <Card className="group overflow-hidden transition-transform duration-200 hover:shadow-lg">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative aspect-square cursor-pointer overflow-hidden">
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            <img
              src={photo.image_url}
              alt={photo.title || 'Photo'}
              className={`
                w-full h-full object-cover transition-transform duration-300
                group-hover:scale-105
                ${isImageLoading ? 'opacity-0' : 'opacity-100'}
              `}
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setImageError(true)
                setIsImageLoading(false)
              }}
            />

            {imageError && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Failed to load image</p>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-end">
              <div className="w-full p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-white font-medium truncate">
                  {photo.title || 'Untitled'}
                </p>
              </div>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image */}
            <div className="lg:col-span-2">
              <img
                src={photo.image_url}
                alt={photo.title || 'Photo'}
                className="w-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.png'
                }}
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              {/* Title */}
              {photo.title && (
                <h2 className="text-2xl font-bold">{photo.title}</h2>
              )}

              {/* Description */}
              {photo.description && (
                <p className="text-gray-600">{photo.description}</p>
              )}

              {/* User info */}
              {photo.profiles && (
                <div className="flex items-center space-x-3">
                  <Link to={`/profile/${photo.profiles.user_id}`}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={photo.profiles.avatar_url || undefined}
                        alt="User avatar"
                      />
                      <AvatarFallback>
                        {getUserInitial(
                          photo.profiles.display_name,
                          photo.profiles.user_id
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link
                      to={`/profile/${photo.profiles.user_id}`}
                      className="font-medium hover:underline"
                    >
                      {getUserName(
                        photo.profiles.display_name,
                        photo.profiles.user_id
                      )}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(photo.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-4 pt-4 border-t">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart className="h-5 w-5" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {photo.profiles && (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={photo.profiles.avatar_url || undefined}
                    alt="User avatar"
                  />
                  <AvatarFallback className="text-xs">
                    {getUserInitial(
                      photo.profiles.display_name,
                      photo.profiles.user_id
                    )}
                  </AvatarFallback>
                </Avatar>
                <Link
                  to={`/profile/${photo.profiles.user_id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {getUserName(
                    photo.profiles.display_name,
                    photo.profiles.user_id
                  )}
                </Link>
              </>
            )}
          </div>

          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(photo.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>

        {photo.title && (
          <h3 className="mt-2 font-medium text-sm line-clamp-1">
            {photo.title}
          </h3>
        )}
      </CardContent>
    </Card>
  )
}