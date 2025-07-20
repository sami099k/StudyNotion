const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String
    },
    courseDescription: {
        type: String
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    whatYouWillLearn: {
        type: String
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section'
    }],
    instructions :{
        type : String,
    },
    ratingsAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatingAndReview'
    }],
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    tag:{
        type:[String],
    },
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],

    status: {
        type: String,
        enum: ['draft', 'publish'],
        default: 'draft'
    }



})

module.exports = mongoose.model('Course', courseSchema)