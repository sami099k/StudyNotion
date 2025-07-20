import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { createRating } from '../../services/ratingAndReviewAPI';

const CourseReviewModal = ({ setReviewModal }) => {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (!review.trim()) {
      alert('Please write a review');
      return;
    }

    setLoading(true);
    try {
      await createRating({
        course_id: courseId,
        rating: rating,
        review: review.trim()
      }, token);
      
      setReviewModal(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[500px] rounded-lg border border-[#2C333F] bg-[#161D29] p-6 text-[#F1F2F3]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2C333F] pb-3">
          <p className="text-2xl font-semibold">Add Your Review</p>
          <button
            onClick={() => setReviewModal(false)}
            className="text-lg text-[#999DAA] hover:text-[#F1F2F3] transition-colors duration-200"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-8 flex flex-col items-center">
            {/* User Info */}
            {user && (
                <div className="flex items-center gap-4 mb-4">
                    <img src={user.image} alt="User" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-[#999DAA]">Posting Publicly</p>
                    </div>
                </div>
            )}

            {/* Star Rating Input */}
            <div className="mb-4">
                <p className="text-lg mb-2">Overall rating:</p>
                <div className="flex gap-1 text-3xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            className={`cursor-pointer transition-colors duration-200 ${
                                star <= (hoveredRating || rating) ? 'text-[#FFD60A]' : 'text-[#424855]'
                            }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                        />
                    ))}
                </div>
                <p className="text-sm text-[#999DAA] mt-1">
                    {rating > 0 ? `${rating} out of 5 stars` : 'Click to rate'}
                </p>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmit} className="w-full">
                <label className="w-full">
                    <p className="text-sm text-[#F1F2F3] mb-1">Add your review <sup className="text-pink-200">*</sup></p>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your experience with this course..."
                        className="w-full min-h-[120px] rounded-md border border-[#2C333F] bg-[#000814] p-3 text-[#F1F2F3] placeholder:text-[#999DAA] focus:outline-none focus:ring-1 focus:ring-[#FFD60A] resize-none"
                        required
                    />
                </label>

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-x-4">
                    <button
                        type="button"
                        onClick={() => setReviewModal(false)}
                        className="rounded-md bg-[#2C333F] px-5 py-2 font-semibold text-[#F1F2F3] hover:bg-[#424855] transition-colors duration-200"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-[#FFD60A] px-5 py-2 font-semibold text-[#000000] hover:scale-95 transition-transform duration-200 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;