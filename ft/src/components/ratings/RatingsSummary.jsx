import React from 'react';
import { Star } from 'lucide-react';
import RatingStars from './RatingStars';

const RatingsSummary = ({ summary }) => {
  const ratingDistribution = summary.distribution || {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  const totalRatings = summary.total_ratings || 0;
  const averageRating = summary.average_rating || 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Rating Summary</h3>

      <div className="flex items-start gap-8">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-800 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <RatingStars rating={Math.round(averageRating)} readonly size="md" />
          <p className="text-sm text-gray-500 mt-2">
            Based on {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingDistribution[stars] || 0;
            const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-600 w-8">{stars}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingsSummary;