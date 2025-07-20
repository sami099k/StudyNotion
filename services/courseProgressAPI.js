import toast from "react-hot-toast";
import { apiConnector } from "./apiConnector";
import { courseAPIS } from "./apis";

export const updateCourseProgress = async (data, token) => {
    try {
        const response = await apiConnector('POST', courseAPIS.UPDATE_PROGRESS_API, data, {
            Authorization: `Bearer ${token}`
        });
        
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || 'Failed to update progress');
        }
        
        return response.data;
    } catch (error) {
        console.error('Error updating course progress:', error);
        throw error;
    }
};

export const getCourseProgress = async (courseId, token) => {
    try {
        const response = await apiConnector('GET', courseAPIS.GET_PROGRESS_API, { courseId }, {
            Authorization: `Bearer ${token}`
        });
        return response?.data;
    } catch (error) {
        console.error('Error fetching course progress:', error);
        return null;
    }
};

export const markLectureComplete = async (subSectionId, token) => {
    try {
        const response = await apiConnector('POST', courseAPIS.MARK_LECTURE_COMPLETE_API, { subSectionId }, {
            Authorization: `Bearer ${token}`
        });
        
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || 'Failed to mark lecture as complete');
        }
        
        return response.data;
    } catch (error) {
        console.error('Error marking lecture complete:', error);
        throw error;
    }
}; 