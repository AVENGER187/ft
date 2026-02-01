import React from 'react';
import { Star } from 'lucide-react';
import { useRatings } from '../../hooks/phase3-hooks';
import ReviewCard from './ReviewCard';
import RatingsSummary from './RatingsSummary';

const ReviewsList = ({ projectId }) => {
  const { ratings, summary, isLoading, deleteRating } = useRatings(projectId, 'project');

  const handleReport = async (ratingId) => {
    // Implement report functionality
    console.log('Report rating:', ratingId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {summary && <RatingsSummary summary={summary} />}

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Reviews ({ratings.length})
        </h3>

        {ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onDelete={deleteRating}
                onReport={handleReport}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-2">Be the first to leave a review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
