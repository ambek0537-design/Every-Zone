import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string; // e.g. "aspect-square", "aspect-[4/3]"
}

/**
 * Parses and returns optimized URLs for known CDNs (like Unsplash)
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  format: string = 'webp',
  quality: number = 75
): string {
  if (!url) return '';
  
  // Unsplash CDN Optimization
  if (url.includes('images.unsplash.com') || url.includes('unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('fm', format);
      if (width) {
        urlObj.searchParams.set('w', width.toString());
      }
      urlObj.searchParams.set('q', quality.toString());
      if (!urlObj.searchParams.has('fit')) {
        urlObj.searchParams.set('fit', 'crop');
      }
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }

  // If not Unsplash, return original url
  return url;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  aspectRatio = 'aspect-square',
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate responsive srcSet for Unsplash images
  const isUnsplash = src.includes('images.unsplash.com') || src.includes('unsplash.com');
  
  const srcSet = isUnsplash
    ? [300, 600, 1000, 1600]
        .map((w) => `${getOptimizedImageUrl(src, w, 'webp')} ${w}w`)
        .join(', ')
    : undefined;

  const sizes = isUnsplash
    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : undefined;

  // Tiny low-resolution placeholder for blur-up effect (approx 30px width)
  const blurPlaceholder = isUnsplash
    ? getOptimizedImageUrl(src, 30, 'webp', 10)
    : src;

  // Reset loading state if src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} bg-zinc-900/50 w-full h-full ${className}`}>
      
      {/* 1. Low-Res Blurred Placeholder */}
      {!isLoaded && !error && (
        <img
          src={blurPlaceholder}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover filter blur-md scale-105 transition-opacity duration-300 pointer-events-none"
          referrerPolicy="no-referrer"
        />
      )}

      {/* 2. Skeleton / Ambient shimmer on top of placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/0 via-zinc-800/20 to-zinc-900/0 animate-shimmer pointer-events-none" />
      )}

      {/* 3. Error Fallback UI */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-stone-500 p-2 text-center">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C5A059] mb-1">
            Failed to Load Image
          </span>
          <span className="text-[9px] opacity-70 truncate max-w-full">
            {alt}
          </span>
        </div>
      )}

      {/* 4. High-Resolution Optimized Image with SrcSet & WebP format */}
      {!error && (
        <motion.img
          src={isUnsplash ? getOptimizedImageUrl(src, 800, 'webp') : src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-transform duration-750 ${imgClassName} ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
          referrerPolicy="no-referrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          {...rest}
        />
      )}
    </div>
  );
};
