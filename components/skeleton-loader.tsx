import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      {...props}
    />
  )
}

export function ImageSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

export function GeneratorSkeleton() {
  return (
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    </div>
  )
}
