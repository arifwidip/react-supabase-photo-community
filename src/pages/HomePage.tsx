import { useState } from 'react'
import { usePhotos } from '@/hooks/usePhotos'
import { PhotoCard } from '@/components/PhotoCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Camera } from 'lucide-react'

export function HomePage() {
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading, error, isFetchingNextPage } = usePhotos({ page, limit })

  const photos = data?.data || []
  const totalCount = data?.count || 0
  const hasMore = photos.length < totalCount

  const loadMore = () => {
    if (!isFetchingNextPage && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load photos. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading && photos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8">Photo Feed</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Photo Feed</h1>
        <p className="text-gray-600">
          Discover beautiful moments shared by our community
        </p>
      </div>

      {photos.length === 0 && !isLoading ? (
        <div className="text-center py-16">
          <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No photos yet
          </h2>
          <p className="text-gray-600 mb-6">
            Be the first to share a moment with the community!
          </p>
          <Button asChild>
            <a href="/upload">Upload Photo</a>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <Button
                onClick={loadMore}
                disabled={isFetchingNextPage}
                variant="outline"
                size="lg"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Photos'
                )}
              </Button>
            </div>
          )}

          {/* End indicator */}
          {!hasMore && photos.length > 0 && (
            <div className="text-center mt-8 text-gray-500">
              <p>You've reached the end of the feed</p>
              <p className="text-sm">
                Showing {photos.length} of {totalCount} photos
              </p>
            </div>
          )}

          {/* Loading indicator for next page */}
          {isFetchingNextPage && (
            <div className="flex justify-center mt-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  )
}