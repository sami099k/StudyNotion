const express = require('express');
const { deleteAccount, updateProfile, getAllUserDetails, updateDisplayPicture } = require('../controllers/profile_contr');
const { auth } = require('../middlewares/auth');
const router = express.Router();


router.delete('/deleteProfile',auth,deleteAccount);

router.put('/updateProfile',auth,updateProfile);

router.get('/getUserDetails',auth,getAllUserDetails);

// router.get('getEnrolledCourses',auth,getEnrolledCourses);
router.put('/updateDisplayPicture',auth,updateDisplayPicture);

module.exports = router;