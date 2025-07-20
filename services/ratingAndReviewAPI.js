import toast from "react-hot-toast";
import { apiConnector } from "./apiConnector";
import { courseAPIS } from "./apis";

export const createRating = async (data, token) => {
    const toastId = toast.loading('Submitting review...');
    try {
        const response = await apiConnector('POST', courseAPIS.CREATE_RATING_API, data, {
            Authorization: `Bearer ${token}`
        });
        
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || 'Failed to submit review');
        }
        
        toast.dismiss(toastId);
        toast.success('Review submitted successfully!');
        return response.data;
    } catch (error) {
        toast.dismiss(toastId);
        toast.error(error.message || 'Failed to submit review');
        throw error;
    }
};

export const getAverageRating = async (courseId) => {
    try {
        const response = await apiConnector('GET', courseAPIS.GET_AVERAGE_RATING_API, { courseId });
        return response?.data;
    } catch (error) {
        console.error('Error fetching average rating:', error);
        return null;
    }
};

export const getAllReviews = async () => {
    try {
        const response = await apiConnector('GET', courseAPIS.GET_ALL_REVIEWS_API);
        return response?.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return null;
    }
}; 