'use client'

import { Goal } from '@/types/goal'
import { Skeleton } from '../ui/skeleton'
import { AspectRatio } from '../ui/aspect-ratio'
import { getGoalStatus } from '@/utils/goalStatus'
import { getPriorityConfig } from '@/utils/goalPriority'
import { Badge } from '../ui/badge'
import useGoalImageDisplay from '@/hooks/useGoalImageDisplay'
import { formatDate } from '@/utils/dateFormat'
import { useSettings } from '@/hooks/useSettings'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'
import { useState, useEffect } from 'react'

interface GoalImageProps {
  goal: Goal
  className?: string
}

const badgeBaseStyles = 'px-2 py-1 font-[500] text-white rounded-full text-[10px] backdrop-blur'
const targetBadgeStyles =
  'px-2 py-1 rounded-full font-[500] text-[10px] bg-muted/40 text-white leading-[18px]'

const cacheImage = async (url: string): Promise<string> => {
  // Don't cache if it's already a local file or data URL
  if (url.startsWith('file://') || url.startsWith('data:')) {
    return url
  }

  // Don't cache default images from the public directory
  if (url.startsWith('/')) {
    return url
  }

  const platform = Capacitor.getPlatform()
  if (platform === 'web') {
    return url
  }

  try {
    const fileName = url.split('/').pop() || 'default.jpg'

    // Check if the file already exists in cache
    try {
      const existingFile = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Cache,
      })
      if (existingFile?.uri) {
        return existingFile.uri
      }
    } catch (error) {
      // File doesn't exist in cache or permission denied, continue to download
      console.debug('Cache check failed:', error)
    }

    // Download and cache the file
    try {
      const result = await Filesystem.downloadFile({
        url,
        path: fileName,
        directory: Directory.Cache,
      })

      if (result?.path) {
        const fileUri = await Filesystem.getUri({
          path: result.path,
          directory: Directory.Cache,
        })
        return fileUri.uri
      }
    } catch (error) {
      console.error('Download failed:', error)
      // Fall back to original URL if download fails
      return url
    }

    return url
  } catch (error) {
    console.error('Error caching image:', error)
    return url
  }
}

export default function GoalImage({ goal, className = '' }: GoalImageProps) {
  const { imageUrl, isLoading } = useGoalImageDisplay(goal)
  const { settings } = useSettings()
  const [cachedUrl, setCachedUrl] = useState(imageUrl)

  useEffect(() => {
    let isMounted = true

    const loadCachedImage = async () => {
      const cached = await cacheImage(imageUrl)
      if (isMounted) {
        setCachedUrl(cached)
      }
    }

    loadCachedImage()

    return () => {
      isMounted = false
    }
  }, [imageUrl])

  if (!goal) return null

  const statusConfig = getGoalStatus(goal.status)
  const priorityConfig = getPriorityConfig(goal.priority)

  return (
    <AspectRatio ratio={16 / 9} className={className}>
      {isLoading ? (
        <Skeleton className="h-full w-full rounded-2xl" />
      ) : (
        <div
          className="relative w-full h-[200px] rounded-t-2xl sm:rounded-2xl overflow-hidden group"
          style={{
            backgroundImage: `url(${cachedUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />
          <div className="absolute inset-0 p-4 flex flex-col justify-between md:justify-between">
            <h3 className="text-white font-semibold text-[1.25rem] leading-tight drop-shadow-lg line-clamp-3 mb-auto mt-auto text-left">
              {goal.title}
            </h3>
            <div className="flex flex-wrap gap-2 justify-start">
              <Badge
                className={`${badgeBaseStyles} ${statusConfig.className} pointer-events-none`}
                style={{
                  backgroundColor: `${statusConfig.className}40`,
                  borderColor: `${statusConfig.className}33`,
                  boxShadow: `0 0 12px ${statusConfig.className}40`,
                }}
              >
                {statusConfig.label}
              </Badge>
              <Badge
                className={`${badgeBaseStyles} ${priorityConfig.className} pointer-events-none`}
                style={{
                  backgroundColor: `${priorityConfig.color}40`,
                  borderColor: `${priorityConfig.color}33`,
                  boxShadow: `0 0 12px ${priorityConfig.color}40`,
                }}
              >
                {priorityConfig.label}
              </Badge>
              {goal.target_date && (
                <Badge className={`${targetBadgeStyles} pointer-events-none`}>
                  🎯 {formatDate(goal.target_date, settings?.date_format)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </AspectRatio>
  )
}
