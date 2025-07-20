const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");
const Course = require("../models/Course");

// Update course progress
exports.updateProgress = async (req, res) => {
    try {
        const { courseId, subSectionId } = req.body;
        const userId = req.user.id;

        if (!courseId || !subSectionId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID and Sub-section ID are required'
            });
        }

        // Find or create course progress
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId
        });

        if (!courseProgress) {
            courseProgress = new CourseProgress({
                courseID: courseId,
                userId: userId,
                completedVideos: []
            });
        }

        // Add sub-section to completed videos if not already completed
        if (!courseProgress.completedVideos.includes(subSectionId)) {
            courseProgress.completedVideos.push(subSectionId);
        }

        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: 'Progress updated successfully',
            data: courseProgress
        });

    } catch (error) {
        console.error('Error updating progress:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating progress'
        });
    }
};

// Get course progress
exports.getProgress = async (req, res) => {
    try {
        const { courseId } = req.query;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        const courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId
        });

        return res.status(200).json({
            success: true,
            data: courseProgress || { completedVideos: [] }
        });

    } catch (error) {
        console.error('Error getting progress:', error);
        return res.status(500).json({
            success: false,
            message: 'Error getting progress'
        });
    }
};

// Mark lecture as complete
exports.markLectureComplete = async (req, res) => {
    try {
        const { subSectionId } = req.body;
        const userId = req.user.id;

        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: 'Sub-section ID is required'
            });
        }

        // Find the course progress for this user and sub-section
        const courseProgress = await CourseProgress.findOne({
            userId: userId,
            'completedVideos': subSectionId
        });

        if (!courseProgress) {
            return res.status(404).json({
                success: false,
                message: 'Course progress not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lecture marked as complete'
        });

    } catch (error) {
        console.error('Error marking lecture complete:', error);
        return res.status(500).json({
            success: false,
            message: 'Error marking lecture complete'
        });
    }
};

// Mark video as completed
exports.markVideoCompleted = async (req, res) => {
    try {
        const { courseId, subSectionId } = req.body;
        const userId = req.user.id;

        if (!courseId || !subSectionId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID and Sub-section ID are required'
            });
        }

        // Find or create course progress
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId
        });

        if (!courseProgress) {
            courseProgress = new CourseProgress({
                courseID: courseId,
                userId: userId,
                completedVideos: []
            });
        }

        // Add sub-section to completed videos if not already completed
        if (!courseProgress.completedVideos.includes(subSectionId)) {
            courseProgress.completedVideos.push(subSectionId);
        }

        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: 'Video marked as completed',
            data: courseProgress
        });

    } catch (error) {
        console.error('Error marking video completed:', error);
        return res.status(500).json({
            success: false,
            message: 'Error marking video completed'
        });
    }
};

// Get course progress for a specific course
exports.getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.query;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        const courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId
        }).populate('completedVideos');

        return res.status(200).json({
            success: true,
            data: courseProgress || { completedVideos: [] }
        });

    } catch (error) {
        console.error('Error getting course progress:', error);
        return res.status(500).json({
            success: false,
            message: 'Error getting course progress'
        });
    }
}; 