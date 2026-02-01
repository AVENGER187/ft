import React from 'react';
import { Trash2, Flag, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import RatingStars from './RatingStars';
import { useAuth } from '../../context/AuthContext';

const ReviewCard = ({ review, onDelete, onReport }) => {
  const { user } = useAuth();
  const isOwnReview = user?.id === review.user_id;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-lg">
              {review.user_name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold text-gray-800">{review.user_name || 'Anonymous'}</h4>
              <RatingStars rating={review.rating} readonly size="sm" />
            </div>
            <p className="text-sm text-gray-500 mb-3">
              {review.created_at && 
                formatDistanceToNow(new Date(review.created_at), { addSuffix: true })
              }
            </p>
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isOwnReview ? (
            <button
              onClick={() => onDelete(review.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete review"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          ) : (
            <button
              onClick={() => onReport(review.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Report review"
            >
              <Flag className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Helpful */}
      {review.helpful_count > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500 pt-3 border-t border-gray-100">
          <ThumbsUp className="w-4 h-4" />
          <span>{review.helpful_count} people found this helpful</span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
