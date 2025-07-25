const mongoose = require('mongoose');

const rrSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String
    }
})

module.exports = mongoose.model('RatingAndReview',rrSchema)