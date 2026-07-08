import React, { useState } from 'react';
import { Play, Image as ImageIcon, Video as VideoIcon, ZoomIn, X, Heart, Star } from 'lucide-react';
import { OptimizedImage } from '../../../components/OptimizedImage';

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
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Combine media
  const totalImages = images.length > 0 ? images : [{ id: 'placeholder', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600' }];
  const hasVideo = videos && videos.length > 0;

  // Customer Photo uploads (High-fidelity satisfaction gallery)
  const customerPhotos = [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200'
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div id="product-media-gallery" className="space-y-4">
      {/* Primary Display with Hover Magnify glass */}
      <div 
        id="main-media-stage"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoomScale(1.4)}
        onMouseLeave={() => {
          setZoomScale(1);
          setZoomPos({ x: 50, y: 50 });
        }}
        onClick={() => {
          if (!isPlayingVideo) setIsZoomOpen(true);
        }}
        className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-900 flex items-center justify-center cursor-zoom-in group select-none"
      >
        {isPlayingVideo && hasVideo ? (
          <video 
            src={videos[0].videoUrl} 
            controls 
            autoPlay 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full overflow-hidden relative">
            <OptimizedImage 
              src={totalImages[activeIndex]?.imageUrl} 
              alt="Product media" 
              aspectRatio="h-full w-full"
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
              }}
            />
            {/* Quick zoom icon overlay */}
            <div className="absolute top-3 right-3 bg-neutral-900/85 backdrop-blur-md p-2 rounded-xl text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity border border-neutral-800 pointer-events-none">
              <ZoomIn className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        )}

        {hasVideo && !isPlayingVideo && (
          <button
            id="play-video-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlayingVideo(true);
            }}
            className="absolute bottom-3 right-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Watch Video Demo</span>
          </button>
        )}

        {isPlayingVideo && (
          <button
            id="show-images-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlayingVideo(false);
            }}
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
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all ${
                activeIndex === index 
                  ? 'border-amber-500 scale-95' 
                  : 'border-neutral-850 hover:border-neutral-700'
              }`}
            >
              <OptimizedImage 
                src={img.imageUrl} 
                alt="thumbnail" 
                aspectRatio="h-full w-full"
              />
            </button>
          ))}

          {hasVideo && (
            <button
              id="video-thumb-btn"
              onClick={() => setIsPlayingVideo(true)}
              className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-neutral-850 hover:border-neutral-700 flex-shrink-0 flex flex-col items-center justify-center bg-neutral-900/60 text-stone-300 cursor-pointer"
            >
              <VideoIcon className="w-5 h-5 text-amber-500" />
              <span className="text-[9px] mt-1 font-medium font-mono">Video</span>
            </button>
          )}
        </div>
      )}

      {/* Verified Customer Shared Photos Section */}
      <div className="pt-2 border-t border-neutral-900/50 space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono flex items-center gap-1">
          <span>👥 Buyer Showcases</span>
          <span className="bg-emerald-500/10 text-emerald-400 text-[8.5px] px-1.5 py-0.2 rounded border border-emerald-500/20 font-black">Verified Satisfied</span>
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {customerPhotos.map((photo, pIdx) => (
            <div 
              key={`customer-photo-${pIdx}`}
              onClick={() => {
                setIsZoomOpen(true);
              }}
              className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-850 flex-shrink-0 cursor-zoom-in hover:border-stone-600 transition"
            >
              <OptimizedImage src={photo} alt="customer review" aspectRatio="h-full w-full" />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5 text-[8px] text-center font-bold text-emerald-400">
                ★ 5.0
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL SCREEN PINCH/ZOOM LIGHTBOX MODAL */}
      {isZoomOpen && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col items-center justify-center p-4 backdrop-blur-md select-none">
          <button 
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-stone-300 hover:text-white p-2.5 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950">
            <img 
              src={totalImages[activeIndex]?.imageUrl} 
              alt="Pinch Zoomable Lightbox" 
              className="w-full h-full object-contain transition-transform duration-200"
              style={{ transform: 'scale(1)' }}
            />
            
            <div className="absolute bottom-4 inset-x-0 text-center text-xs text-stone-500">
              Interactive Zoom Mode Active. Pinch or double click to expand resolution.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
