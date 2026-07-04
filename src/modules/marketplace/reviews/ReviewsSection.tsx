import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

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

  return (
    <div id="reviews-section" className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-amber-500" />
          <span>Customer Reviews ({count})</span>
        </h3>
        <div className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 text-xs text-amber-400 font-medium">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{averageRating ? averageRating.toFixed(1) : '0.0'} / 5.0</span>
        </div>
      </div>

      {count === 0 ? (
        <div className="text-center py-6 text-stone-500 text-xs italic">
          No reviews for this product yet. Be the first to purchase and review!
        </div>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-neutral-900/45 border border-neutral-850 p-3 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-stone-200">{rev.reviewerName}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${
                        i < rev.ratingValue 
                          ? 'text-amber-400 fill-current' 
                          : 'text-stone-700'
                      }`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">{rev.reviewText}</p>
              <div className="text-[9px] text-stone-500 font-mono">
                {new Date(rev.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
