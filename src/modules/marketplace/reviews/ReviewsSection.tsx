import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Video, Image as ImageIcon, CornerDownRight, CheckCircle } from 'lucide-react';

interface Review {
  id: string;
  reviewerName: string;
  ratingValue: number;
  reviewText: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, averageRating }) => {
  const count = reviews.length;

  // Track counts locally for Helpful and Not Helpful interactivity
  const [feedback, setFeedback] = useState<Record<string, { helpful: number; notHelpful: number; clicked: 'up' | 'down' | null }>>(() => {
    const initial: Record<string, { helpful: number; notHelpful: number; clicked: 'up' | 'down' | null }> = {};
    reviews.forEach(r => {
      // Seed deterministic feedback count
      let hash = 0;
      for (let i = 0; i < r.id.length; i++) {
        hash = r.id.charCodeAt(i) + ((hash << 5) - hash);
      }
      initial[r.id] = {
        helpful: Math.abs(hash % 15) + 3,
        notHelpful: Math.abs(hash % 3),
        clicked: null
      };
    });
    return initial;
  });

  const handleFeedbackClick = (reviewId: string, type: 'up' | 'down') => {
    setFeedback(prev => {
      const current = prev[reviewId] || { helpful: 5, notHelpful: 0, clicked: null };
      if (current.clicked === type) {
        // Undo click
        return {
          ...prev,
          [reviewId]: {
            helpful: type === 'up' ? current.helpful - 1 : current.helpful,
            notHelpful: type === 'down' ? current.notHelpful - 1 : current.notHelpful,
            clicked: null
          }
        };
      } else if (current.clicked !== null) {
        // Swap click
        return {
          ...prev,
          [reviewId]: {
            helpful: type === 'up' ? current.helpful + 1 : current.helpful - 1,
            notHelpful: type === 'down' ? current.notHelpful + 1 : current.notHelpful - 1,
            clicked: type
          }
        };
      } else {
        // New click
        return {
          ...prev,
          [reviewId]: {
            helpful: type === 'up' ? current.helpful + 1 : current.helpful,
            notHelpful: type === 'down' ? current.notHelpful + 1 : current.notHelpful,
            clicked: type
          }
        };
      }
    });
  };

  // Get simulated attachments (images, video) for a review based on its text or ID
  const getAttachments = (id: string, text: string) => {
    const hasImage = id.charCodeAt(0) % 2 === 0;
    const hasVideo = id.charCodeAt(1) % 3 === 0;
    
    return {
      images: hasImage ? [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=150',
        'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=150'
      ] : [],
      video: hasVideo ? {
        thumbnail: 'https://images.unsplash.com/photo-1447078806655-40579c2520d6?auto=format&fit=crop&q=80&w=150',
        duration: '0:18'
      } : null
    };
  };

  // Simulated vendor replies based on ratings
  const getVendorReply = (reviewerName: string, rating: number) => {
    if (rating >= 4) {
      return `Dear ${reviewerName}, thank you so much for the 5-star feedback! Our weaving cooperatives take immense pride in crafting these certified premium products for Every-zone. Enjoy!`;
    } else {
      return `Hello ${reviewerName}, we apologize for not fully meeting your expectations. Please message our support chat directly so we can make this right or arrange a free return under our 14-Day Escrow return policy.`;
    }
  };

  return (
    <div id="reviews-section" className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-amber-500" />
          <span>Customer Reviews ({count})</span>
        </h3>
        <div className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 text-xs text-amber-400 font-medium">
          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
          <span className="font-mono font-bold">{averageRating ? averageRating.toFixed(1) : '5.0'} / 5.0</span>
        </div>
      </div>

      {count === 0 ? (
        <div className="text-center py-6 text-stone-500 text-xs italic">
          No reviews for this product yet. Be the first to purchase and review!
        </div>
      ) : (
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 no-scrollbar text-left">
          {reviews.map((rev) => {
            const fb = feedback[rev.id] || { helpful: 5, notHelpful: 0, clicked: null };
            const attachments = getAttachments(rev.id, rev.reviewText);
            const vendorReply = getVendorReply(rev.reviewerName, rev.ratingValue);

            return (
              <div key={rev.id} className="bg-neutral-900/60 border border-neutral-850 p-4 rounded-2xl space-y-3 transition-all hover:bg-neutral-900">
                
                {/* Header: Reviewer Name, rating, and date */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-xs text-stone-200 block">{rev.reviewerName}</span>
                    <span className="text-[9px] text-stone-500 font-mono block mt-0.5">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex gap-0.5 bg-neutral-950 px-2 py-1 rounded-xl border border-neutral-850">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${
                          i < rev.ratingValue 
                            ? 'text-amber-500 fill-[#E2B755]' 
                            : 'text-stone-700'
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Body Text */}
                <p className="text-[11.5px] text-stone-300 leading-relaxed font-sans">{rev.reviewText}</p>

                {/* Attachments: Images and Videos */}
                {(attachments.images.length > 0 || attachments.video) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {attachments.images.map((img, imgIdx) => (
                      <div key={imgIdx} className="relative w-12 h-12 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 group cursor-pointer">
                        <img src={img} alt="review attachment" className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <ImageIcon className="w-3 h-3 text-white/70" />
                        </div>
                      </div>
                    ))}
                    {attachments.video && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 group cursor-pointer">
                        <img src={attachments.video.thumbnail} alt="video review attachment" className="w-full h-full object-cover brightness-75 transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Video className="w-3.5 h-3.5 text-[#E2B755]" />
                        </div>
                        <span className="absolute bottom-0.5 right-0.5 bg-black/85 text-[8px] px-1 rounded font-mono text-white/95">{attachments.video.duration}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Row: Helpful / Not Helpful */}
                <div className="flex items-center gap-3 text-[10px] border-t border-neutral-850/50 pt-2.5">
                  <span className="text-stone-500 font-medium">Was this review helpful?</span>
                  
                  {/* Helpful Button */}
                  <button
                    onClick={() => handleFeedbackClick(rev.id, 'up')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      fb.clicked === 'up'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-neutral-950 border-neutral-850 text-stone-400 hover:text-stone-200 hover:border-neutral-700'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({fb.helpful})</span>
                  </button>

                  {/* Not Helpful Button */}
                  <button
                    onClick={() => handleFeedbackClick(rev.id, 'down')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      fb.clicked === 'down'
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-neutral-950 border-neutral-850 text-stone-400 hover:text-stone-200 hover:border-neutral-700'
                    }`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                    <span>Not Helpful ({fb.notHelpful})</span>
                  </button>
                </div>

                {/* Vendor Reply Nest */}
                <div className="mt-3.5 bg-neutral-950/70 border-l-2 border-[#C5A059] p-3 rounded-r-2xl space-y-1 text-left">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-[#E2B755] uppercase tracking-wider font-mono">
                    <CornerDownRight className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Official Vendor Reply</span>
                    <span className="inline-flex items-center gap-0.5 bg-[#C5A059]/10 text-[#C5A059] text-[8px] px-1 py-0.2 rounded-full border border-[#C5A059]/20 font-bold uppercase">
                      <CheckCircle className="w-2 h-2 text-[#E2B755]" /> Verified Store
                    </span>
                  </div>
                  <p className="text-[10.5px] text-stone-400 leading-relaxed italic">{vendorReply}</p>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
