const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mongoose = require('mongoose');
const { sendMail } = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail_templates/courseEnrollementEmail");
const crypto = require('crypto'); // <-- ADD THIS LINE

exports.capturePayment = async (req, res) => {
    try {
        const { courses } = req.body;
        const userId = req.user.id;

        if (courses.length === 0) {
            return res.status(402).json({
                success: false,
                message: 'No Course to Initiate order',
            });
        }

        let totalAmount = 0;

        for (const course_id of courses) {
            let course;
            try {
                course = await Course.findById(course_id);
                if (!course) {
                    return res.status(200).json({ success: false, message: 'Could not find the course' });
                }

                const uid = new mongoose.Types.ObjectId(userId);

                if (course.studentsEnrolled.includes(uid)) {
                    return res.status(200).json({ success: false, message: 'Student is already enrolled' });
                }

                totalAmount += course.price;

            } catch (err) {
                console.error("Error while fetching course or checking enrollment:", err); // More specific logging
                return res.status(500).json({ success: false, message: err.message }); // Corrected 'json' typo
            }
        }

        const options = {
            amount: totalAmount * 100, // Convert to smallest currency unit (e.g., paise for INR)
            currency: 'INR',
            receipt: Math.random(Date.now()).toString(),
        };

        try {
            const paymentResponse = await instance.orders.create(options);

            res.json({
                success: true,
                message: paymentResponse,
            });
        } catch (err) {
            console.error("Error creating Razorpay order:", err); // More specific logging
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }

    } catch (err) {
        console.error("General error in capturePayment:", err); // More specific logging
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


exports.verifySignature = async (req, res) => {
    try {
        const razorpay_order_id = req?.body?.razorpay_order_id;
        const razorpay_payment_id = req?.body?.razorpay_payment_id;
        const razorpay_signature = req.body?.razorpay_signature;
        const courses = req.body?.courses;
        const userId = req.user.id;

        if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature ||
            !userId ||
            !courses
        ) {
            return res.status(200).json({ success: false, message: 'Payment Failed: Missing required fields.' });
        }

        let body = razorpay_order_id + "|" + razorpay_payment_id;

        // Ensure process.env.RAZORPAY_SECRET is correctly loaded (e.g., with dotenv)
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET) // Use createHmac, not Hmac
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            await enrollStudents(courses, userId); // Pass res only if enrollStudents handles sending response

            return res.status(200).json({
                success: true,
                message: 'Payment Verified and Students Enrolled',
            });
        }

        return res.status(200).json({
            success: false,
            message: 'Payment Failed: Signature mismatch.',
        });

    } catch (err) {
        console.error("Error in verifySignature:", err); // More specific logging
        return res.status(500).json({
            success: false,
            message: err.message, // Corrected typo 'messgae' to 'message'
        });
    }
};


const enrollStudents = async (courses, userId) => { // Removed 'res' from here if you want verifySignature to send the final response
    try {
        // Fetch user details once to avoid redundant database calls inside the loop
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            console.error('User not found for enrollment:', userId);
            // Consider throwing an error here to propagate up
            throw new Error('User not found for enrollment.');
        }

        for (const courseId of courses) { // Renamed 'course' to 'courseId' for clarity
            try {
                // 1. Update Course: Add student to the course's studentsEnrolled array
                const enrolledCourse = await Course.findByIdAndUpdate(
                    courseId,
                    { $push: { studentsEnrolled: userId } },
                    { new: true }
                );

                if (!enrolledCourse) {
                    console.error(`Course not found during enrollment for courseId: ${courseId}. Skipping enrollment for this course.`);
                    // If a course is not found, you might want to skip it for this user,
                    // or flag it as an error to the user later.
                    continue; // Skip to the next course
                }

                // 2. Update User: Add course to the user's courses array
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { $push: { courses: courseId } },
                    { new: true }
                );

                if (!updatedUser) {
                    console.error(`User not found when updating courses for userId: ${userId}. This should not happen.`);
                    throw new Error('User not found during course update.'); // This is a critical error
                }

                // 3. Send Enrollment Email
                const email_response = await sendMail(
                    updatedUser.email,
                    `Successfully Enrolled in ${enrolledCourse.courseName}`, // Corrected typo
                    courseEnrollmentEmail(enrolledCourse.courseName, updatedUser.firstName)
                );
                console.log('Email sent successfully:', email_response.response);

            } catch (err) {
                console.error(`Error enrolling user ${userId} into course ${courseId}:`, err);
                // Propagate the error up to the calling function (verifySignature)
                // so it can send an appropriate error response.
                throw new Error(`Enrollment failed for course ${courseId}: ${err.message}`);
            }
        }

    } catch (err) {
        console.error('General error in enrollStudents process:', err);
        // Re-throw to allow verifySignature to catch and respond
        throw new Error(`Enrollment process failed: ${err.message}`);
    }
};


// exports.capturePayment = async (req, res) => {

//     try {
//         const { course_id } = req.body;
//         const user_id = req.user.id;

//         if (!user_id || !course_id) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'All fields are mandatory'
//             })
//         };
//         const user_details = await User.findById(user_id);
//         const course_details = await Course.findById(course_id);
//         if (!user_details || !course_details) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User or Course not found'
//             })
//         };
//         //check weather the course is already purchased by the user or not
//         const ci = mongoose.Types.ObjectId(course_id);
//         if (user_details.courses.includes(ci)) {
//             return res.status(409).json({
//                 success: false,
//                 message: 'The course is already purchased by the user'
//             })
//         };

//         const price = course_details.price;
//         const currency = 'INR';
//         const options = {
//             amount: price * 100,
//             currency,
//             receipt: Math.random(Date.now().toString()),
//             notes: {
//                 course_id,
//                 user_id
//             }
//         };
//         try {
//             const paymentResponse = await instance.orders.create(options);
//             console.log(paymentResponse);

//             return res.status(200).json({
//                 success: true,
//                 courseName: course_details.courseName,
//                 courseDescription: course_details.courseDescription,
//                 thumbnail: course_details.thumbnail,
//                 order_id: paymentResponse.id,
//                 amount: paymentResponse.amount
//             })

//         } catch (err) {

//             console.log(err);
//             return res.status(500).json({
//                 success: false,
//                 message: err.message
//             });

//         }

//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({
//             success: false,
//             messsage: 'Error in capturing the payment'
//         })
//     }

// }

// //verify

// exports.verifySignature = async (req, res) => {

//     const webhookSecret = "12345678";
//     const signature = req.headers['x-razorpay-signature'];
//     const shasum = crypto.createHmac('sha256', webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum('hex');

//     if (signature === digest) {
//         console.log('payment is authorised');

//         const { course_id, user_id } = req.body.payLoad.entity.notes;

//         try {
//             const user_details = await User.findById(user_id);
//             const course_details = await Course.findById(course_id);

//             const updatedUser = await User.findByIdAndUpdate(user_id, {
//                 $push: {
//                     courses: course_details._id
//                 }
//             }, { new: true });
//             const updatedCourse = await Course.findByIdAndUpdate(course_id, {
//                 $push: {
//                     studentsEnrolled: user_details._id
//                 }
//             }, { new: true });

//             console.log(updatedCourse, updatedUser);

//             //sending success mail
//             const mail_response = sendMail(updatedUser.email, 'Congratulations', 'congo   ');
//             console.log(mail_response);

//             return res.status(200).json({
//                 success: true,
//                 message: 'Course Purchase success'
//             })


//         } catch (err) {
//             console.log(err);
//             return res.status(500).json({
//                 success: false,
//                 message: err.message
//             })
//         }
//     }
//     else{
//         return res.status(400).json({
//             success:false,
//             message:'invalid request'
//         })
//     }

// }

