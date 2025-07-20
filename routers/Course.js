const express = require('express');
const { auth, isAdmin, isStudent, isInstructor } = require('../middlewares/auth');
const { addACategory, getAllCategories, categoryPageDetails } = require('../controllers/category_contr');
const { createRating, getAverageRating, getAllRating } = require('../controllers/ratingAndReview');
const { updateProgress, getProgress, markLectureComplete, markVideoCompleted, getCourseProgress } = require('../controllers/courseProgress');
const { addCourse, getAllCourses, getCourseDetails, changeStatus, deleteCourse, editCousreDetails, getInstructorCourseStudentAnalytics, getInstructorCourseIncomeAnalytics, getInstructorMonthlyAnalytics, getInstructorAnalyticsSummary } = require('../controllers/courseControllers');
const { addSection, updateSection, deleteSection } = require('../controllers/sectionControllers');
const { addSubSection, updateSubSection, deleteSubSection } = require('../controllers/subSectionContr');
const router = express.Router();


router.post('/createCourse',auth,isInstructor,addCourse);
router.put('/updateCourse',auth,isInstructor,editCousreDetails);
router.delete('/deleteCourse',auth,isInstructor,deleteCourse)
router.post('/addSection',auth,isInstructor,addSection);
router.put('/updateSection',auth,isInstructor,updateSection);
router.delete('/deleteSection',auth,isInstructor,deleteSection);
router.post('/addSubSection',auth,isInstructor,addSubSection);
router.put('/updateSubSection',auth,isInstructor,updateSubSection);


router.post('/getCategoryPageDetails',categoryPageDetails);

router.delete('/deleteSubSection',auth,isInstructor,deleteSubSection);

router.get('/getAllCourses',auth,isInstructor,getAllCourses);
router.post('/getCourseDetails', auth, getCourseDetails);

router.put('/updateStatus',auth,isInstructor,changeStatus);


router.post('/createCategory',auth,isAdmin,addACategory);

router.get('/showAllCategories',getAllCategories);

router.post('/createRating',auth,isStudent,createRating);
router.get('/getAverageRating',getAverageRating);
router.get('/getReviews',getAllRating);

// Course Progress Routes
router.post('/updateProgress',auth,isStudent,updateProgress);
router.get('/getProgress',auth,isStudent,getProgress);
router.post('/markLectureComplete',auth,isStudent,markLectureComplete);
router.post('/markVideoCompleted',auth,isStudent,markVideoCompleted);
router.get('/getCourseProgress',auth,isStudent,getCourseProgress);

// Instructor Analytics
router.get('/analytics/students', auth, isInstructor, getInstructorCourseStudentAnalytics);
router.get('/analytics/income', auth, isInstructor, getInstructorCourseIncomeAnalytics);
router.get('/analytics/monthly', auth, isInstructor, getInstructorMonthlyAnalytics);
router.get('/analytics/summary', auth, isInstructor, getInstructorAnalyticsSummary);

module.exports = router;