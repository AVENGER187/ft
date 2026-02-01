import React, { useState } from 'react';
import { Send } from 'lucide-react';
import RatingStars from './RatingStars';
import { useRatings } from '../../hooks/phase3-hooks';

const WriteReview = ({ projectId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { submitRating } = useRatings(projectId, 'project');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await submitRating({
        rating,
        comment: comment.trim(),
      });

      // Reset form
      setRating(0);
      setComment('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          <RatingStars rating={rating} onRatingChange={setRating} size="lg" />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
            placeholder="Share your experience working on this project..."
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            {comment.length} / 500 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || !comment.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default WriteReview;

