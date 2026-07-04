import React, { useState } from 'react';
import { Play, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

interface ProductImage {
  id: string;
  imageUrl: string;
}

interface ProductVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

interface ProductMediaGalleryProps {
  images: ProductImage[];
  videos: ProductVideo[];
}

export const ProductMediaGallery: React.FC<ProductMediaGalleryProps> = ({ images, videos }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Combine media
  const totalImages = images.length > 0 ? images : [{ id: 'placeholder', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600' }];
  const hasVideo = videos && videos.length > 0;

  return (
    <div id="product-media-gallery" className="space-y-3">
      {/* Primary Display */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center">
        {isPlayingVideo && hasVideo ? (
          <video 
            src={videos[0].videoUrl} 
            controls 
            autoPlay 
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={totalImages[activeIndex]?.imageUrl} 
            alt="Product media" 
            className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
            referrerPolicy="no-referrer"
          />
        )}

        {hasVideo && !isPlayingVideo && (
          <button
            id="play-video-btn"
            onClick={() => setIsPlayingVideo(true)}
            className="absolute bottom-3 right-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Watch Video Demo</span>
          </button>
        )}

        {isPlayingVideo && (
          <button
            id="show-images-btn"
            onClick={() => setIsPlayingVideo(false)}
            className="absolute bottom-3 right-3 bg-neutral-900 hover:bg-neutral-800 text-stone-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-neutral-800 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>View Image Gallery</span>
          </button>
        )}
      </div>

      {/* Thumbnails list */}
      {!isPlayingVideo && totalImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {totalImages.map((img, index) => (
            <button
              key={img.id}
              id={`thumb-btn-${index}`}
              onClick={() => {
                setActiveIndex(index);
                setIsPlayingVideo(false);
              }}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all ${
                activeIndex === index 
                  ? 'border-amber-500 scale-95' 
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <img 
                src={img.imageUrl} 
                alt="thumbnail" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}

          {hasVideo && (
            <button
              id="video-thumb-btn"
              onClick={() => setIsPlayingVideo(true)}
              className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-neutral-800 hover:border-neutral-700 flex-shrink-0 flex flex-col items-center justify-center bg-neutral-900 text-stone-300 cursor-pointer"
            >
              <VideoIcon className="w-5 h-5 text-amber-500" />
              <span className="text-[9px] mt-1 font-medium">Video</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
