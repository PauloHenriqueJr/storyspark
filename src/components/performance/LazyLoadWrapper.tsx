import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  height?: string | number;
}

const DefaultSkeleton = ({ height }: { height?: string | number }) => (
  <Card className="p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    {height && (
      <Skeleton 
        className="w-full" 
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      />
    )}
  </Card>
);

export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  fallback,
  height
}) => {
  return (
    <Suspense fallback={fallback || <DefaultSkeleton height={height} />}>
      {children}
    </Suspense>
  );
};