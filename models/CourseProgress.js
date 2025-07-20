const mongoose = require('mongoose');

const cpSchema = new mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubSection',
    }],
    lastAccessed: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure unique course-user combinations
cpSchema.index({ courseID: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('CourseProgress', cpSchema);