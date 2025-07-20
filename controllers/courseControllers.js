const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const { uploadImageToCloduinary } = require("../utils/imageUploader");

require('dotenv').config();



exports.addCourse = async (req,res) =>{

    try{

    const {courseName,courseDescription,whatYouWillLearn, price,category} = req.body;
    const thumbnail = req.files?.thumbnail ?? '';

    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail ){
        return res.status(401).json({
            success:false,
            message:'All fields are mandatory'
        })
    }

    const findCategory = await Category.findById(category);
    
    if(!findCategory){
        return res.status(404).json({
            success:false,
            message:'No such category available'
        });
    }
    const id = req.user.id;
    const user = await User.findById(id);

    if(!user){
        return res.status(404).json({
            success:false,
            message:'Error user not found'
        });
    }

    if(user.accountType!=='Instructor'){
        return res.status(402).json({
            success:false,
            message:'only instructors can create a id'
        });
    }

    const thumbnailImage = await uploadImageToCloduinary(thumbnail,process.env.FOLDER);
    console.log(thumbnailImage);
    
    const newCourse = await Course.create({
        courseName,
        instructor:user._id,
        courseDescription,
        whatYouWillLearn,
        price,
        category,
        thumbnail:thumbnailImage.secure_url,
    });

    //update course for user 
    await User.findByIdAndUpdate(id,{
        $push:{
            courses:newCourse._id,
        }
    });
    //update category schema
    await Category.findByIdAndUpdate(category,{
        $push:{
            courses:newCourse._id,
        }
    });

    return res.status(200).json({
        success:true,
        message:'Course added Successfully',
        course:newCourse
    });



    }catch(err){
        console.log(err);
        return res.status(500).json({
            successs:false,
            error : err.message,
            message:'Error while creating a course'
        })
    }

}

//get al courses 

exports.getAllCourses = async (req,res) =>{
    try{
        const id = req.user.id;

        const course = await Course.find({instructor:id});
        
        return res.status(200).json({
            success:true,
            course,
            message:'Fetch success'

        })

    }catch(err){
        console.log(err);
        return res.status(400).json({
            success:false,
            message:'Error while fetching courses',
        })
    }
}


//get course details 
exports.getCourseDetails = async(req,res)=>{
    try{
        const {courseId} = req.body; // Course ID from request body
        const userId = req.user?.id; // User ID from authenticated request (via auth middleware), if available

        console.log("getCourseDetails - courseId:", courseId);
        console.log("getCourseDetails - userId:", userId);

        // 1. Fetch general course details
        let course_details = await Course.findById(courseId)
            .populate({
                path:'instructor',
                populate:{
                    path:'additionalDetails', // Populates instructor's profile details
                }
            })
            .populate('category') // Populates course category
            .populate({
                path:'courseContent',
                populate:{
                    path:'subSection', // Populates subsections within sections
                }
            })
            .populate('ratingsAndReviews') // Populates rating and reviews
            .exec();

        console.log("getCourseDetails - course_details found:", !!course_details);
        console.log("getCourseDetails - courseContent length:", course_details?.courseContent?.length);

        // 2. Validate if course details were found
        if(!course_details){
            return res.status(404).json({
                success:false,
                message:'Course not found'
            });
        }

        let completedVideos = []; // Initialize completedVideos to empty array by default

        // 3. If a user is logged in (userId is present from auth middleware),
        //    fetch their CourseProgress for this specific course.
        if (userId) {
            try {
                // First, try to find the specific CourseProgress document for this user and course
                const courseProgress = await CourseProgress.findOne({
                    userId: userId,
                    courseID: courseId
                });

                if (courseProgress) {
                    completedVideos = courseProgress.completedVideos || [];
                    console.log("getCourseDetails - completedVideos found:", completedVideos.length);
                }
            } catch (error) {
                console.error("Error fetching course progress:", error);
                completedVideos = [];
            }
        }
        
        // 4. Return course details along with completed videos (if applicable)
        const responseData = {
            ...course_details.toObject(), // Convert Mongoose document to plain JS object
            completedVideos: completedVideos // Attach the completedVideos array
        };

        console.log("getCourseDetails - response data prepared");

        return res.status(200).json({
            success:true,
            message:'Course details fetched successfully',
            course_details: responseData
        });

    }catch(err){
        console.error("Error in getCourseDetails:", err); // Use console.error for better logging
        return res.status(500).json({
            success:false,
            message:'Internal Server error',
            error: err.message // Provide the actual error message
        });
    }
}

exports.deleteCourse = async(req,res)=>{
    try{
        const courseId = req.body.courseId;
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success:true,
            message:'Course Deleted Successfully'
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            err,
        })
    }
}

exports.changeStatus = async(req,res)=>{
    try{
        const {courseId }= req.body;
        if(!courseId){
            return res.status(401).json({
                success:false,
                message:'Data is missing'
            })
        }

        const course = await Course.findByIdAndUpdate(courseId,{
            status:'publish'
        },{new:true}).populate({
            path:'courseContent',
            populate:{
                path:'subSection'
            }
        })

        return res.status(200).json({
            success:true,
            course,
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:'Internal Server error',
            err,
        })
    }
}


exports.editCousreDetails = async (req,res)=>{
    try{

        const {courseId,courseName=null,courseDescription=null,price=null,whatYouWillLearn=null,category=null,instructions=null} = req.body;
        const thumbnail = req?.files?.thumbnail ;
        let thumbnailImage = null;
        if(thumbnail){
             thumbnailImage = await uploadImageToCloduinary(thumbnail,process.env.FOLDER);
        }
        const id = req.user.id;
        if(!courseId){
            return res.status(401).json({
                success:false,
                message:'Data is missing',
            })
        }

        const oldCourse = await Course.findById(courseId);

        if(oldCourse.instructor != id){
            return res.status(401).json({
                success:false,
                message:'You are not the owner of this course',
            })
        }

        const updatedCourse = await Course.findByIdAndUpdate(courseId,{
        courseName: courseName ?? oldCourse.courseName,
        courseDescription: courseDescription ?? oldCourse.courseDescription,
        price : price  ?? oldCourse.price ,
        whatYouWillLearn : whatYouWillLearn  ?? oldCourse.whatYouWillLearn ,
        category : category  ?? oldCourse.category ,
        courseName: courseName ?? oldCourse.courseName,
        thumbnail : thumbnailImage?.secure_url ?? oldCourse.thumbnail,
        },{new:true}).populate('category').populate('instructor');

        return res.status(200).json({
            success:true,
            message:'Course Updated Successfully',
            course : updatedCourse,
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Internal Server Error',
            err : err.message,
        })
    }
}

// Get number of students per course for the logged-in instructor
exports.getInstructorCourseStudentAnalytics = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const courses = await require('../models/Course').find({ instructor: instructorId })
      .populate('studentsEnrolled', '_id');
    const data = courses.map(course => ({
      courseId: course._id,
      courseName: course.courseName,
      studentCount: course.studentsEnrolled.length
    }));
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch student analytics', error: error.message });
  }
};

// Get total income per course for the logged-in instructor
exports.getInstructorCourseIncomeAnalytics = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const courses = await require('../models/Course').find({ instructor: instructorId });
    const payments = await require('../models/Payments').find({ instructor: instructorId });
    const incomeMap = {};
    payments.forEach(payment => {
      if (!incomeMap[payment.course]) incomeMap[payment.course] = 0;
      incomeMap[payment.course] += payment.amount;
    });
    const data = courses.map(course => ({
      courseId: course._id,
      courseName: course.courseName,
      income: incomeMap[course._id] || 0
    }));
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch income analytics', error: error.message });
  }
};

// Get monthly income and enrollments for the logged-in instructor (last 12 months)
exports.getInstructorMonthlyAnalytics = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const Course = require('../models/Course');
    const Payments = require('../models/Payments');
    const courses = await Course.find({ instructor: instructorId }, '_id');
    const courseIds = courses.map(c => c._id);

    // Get enrollments per month
    const enrollments = await Course.aggregate([
      { $match: { instructor: instructorId } },
      { $unwind: '$studentsEnrolled' },
      { $project: { month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } } } },
      { $group: { _id: '$month', enrollments: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get income per month
    const payments = await Payments.aggregate([
      { $match: { instructor: instructorId } },
      { $project: { month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, amount: 1 } },
      { $group: { _id: '$month', income: { $sum: '$amount' } } },
      { $sort: { _id: 1 } }
    ]);

    // Merge results for the last 12 months
    const now = new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.toISOString().slice(0, 7);
      months.push(m);
    }
    const data = months.map(month => ({
      month,
      income: payments.find(p => p._id === month)?.income || 0,
      enrollments: enrollments.find(e => e._id === month)?.enrollments || 0
    }));
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch monthly analytics', error: error.message });
  }
};

// Get summary analytics for instructor: recent enrollments and top performing courses
exports.getInstructorAnalyticsSummary = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const Course = require('../models/Course');
    const User = require('../models/User');
    const Payments = require('../models/Payments');

    // Get all courses for instructor
    const courses = await Course.find({ instructor: instructorId })
      .populate('studentsEnrolled', 'firstName lastName email')
      .lean();

    // Recent Enrollments (latest 5)
    let recentEnrollments = [];
    for (const course of courses) {
      for (const student of course.studentsEnrolled) {
        recentEnrollments.push({
          courseName: course.courseName,
          studentName: student.firstName + ' ' + student.lastName,
          date: course.updatedAt || course.createdAt // fallback if no enrollment date
        });
      }
    }
    // Sort by date desc and take 5
    recentEnrollments.sort((a, b) => new Date(b.date) - new Date(a.date));
    recentEnrollments = recentEnrollments.slice(0, 5);

    // Top Performing Courses (by enrollments and revenue)
    let topCourses = [];
    for (const course of courses) {
      // Get revenue for this course
      const payments = await Payments.find({ course: course._id });
      const revenue = payments.reduce((sum, p) => sum + p.amount, 0);
      const enrollments = course.studentsEnrolled.length;
      topCourses.push({
        name: course.courseName,
        enrollments,
        revenue,
        avg: enrollments > 0 ? Math.round(revenue / enrollments) : 0
      });
    }
    // Sort by enrollments desc, then revenue desc, take top 3
    topCourses.sort((a, b) => b.enrollments - a.enrollments || b.revenue - a.revenue);
    topCourses = topCourses.slice(0, 3);

    return res.status(200).json({ success: true, data: { recentEnrollments, topCourses } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch analytics summary', error: error.message });
  }
};