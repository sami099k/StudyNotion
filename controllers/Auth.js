const User = require('../models/User');
const OTP = require('../models/Otp');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');

require('dotenv').config();


//otp

exports.sendOTP = async (req,res)=>{
    try{
    //fetch email from UI
    const {email} = req.body;

    //check if User already exists
    const user =  await User.findOne({email}); //await for interaction with db
    if(user){
        return res.status(400).json({
            success:false,
            message:'An Account with the given email id already exists'
        })
    }

    // generate otp
    let otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
    });

    console.log(' otp generated successfully');

    //make sure that generated otp is unique 
    let result = await OTP.findOne({value:otp});

    while(result){
        otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
    });
    result = await OTP.findOne({value:otp});
    }

    const otpPayLoad = {email,value:otp};

    //create an otp for db
    const otpBody = await OTP.create(otpPayLoad);
    console.log(otpBody);

    res.status(200).json({
        success:true,
        message:'otp sent successfully',
        otp
    })
     

    }catch(err){
        console.log(err);
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}


//signUp
exports.signUp = async (req,res)=>{
    try{
        const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        phNo,
        otp,
        accountType
    } = req.body;  

    if(!email || !password || !confirmPassword || !firstName || !lastName
        || !otp){
            return res.status(403).json({
                success:false,
                message:'Some Data is missing - All fields are empty'
            })
    }
    if(password!==confirmPassword){
        return res.status(403).json({
            success:false,
            message:'Passwords do not match'
        });
    }

    const isExist = await User.findOne({email});
    if(isExist){
        return res.status(403).json({
            success:false,
            messgae:'Account with the given email already exists'
        })
    }
    //most recent response of otp
    // -1 in mongoDB corresponds to descending order
    const mostRecentOtp = await OTP.find({value:otp}).sort({createdAt:-1}).limit(1);
    console.log(mostRecentOtp);
    //validate otp
    if(mostRecentOtp.length==0){
        return res.status(403).json({
            success:false,
            message:'otp is not generated'
        })
    }
    if(otp!=mostRecentOtp[0].value){
        console.log(mostRecentOtp);
        return res.status(403).json({
            success:false,
            mostRecentOtp,
            message:'The otp entered is incorrect'
        })
    }

    //hashing the password using bcrypt
    const hashPass = await bcrypt.hash(password,10);
    const profile = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        phNo:phNo
    })


    const user = await User.create({
        email,
        firstName,
        lastName,
        password:hashPass,
        accountType,
        additionalDetails:profile,
        image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })

    return res.status(200).json({
        success:true,
        data:user,
        message:'Account Created successfully'

    })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:err.message
        })

    }
}


//login

exports.login = async (req,res) =>{
    
    try{
    const{email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:'All fields are required'
        })
    }
    const existingUser = await User.findOne({email}).populate('additionalDetails');
    if(!existingUser){
        return res.status(400).json({
            success:false,
            message:'No account with given email exists'
        })
    }
    if(!await bcrypt.compare(password,existingUser.password)){
        return res.status(403).json({
            success:false,
            message:'Incorrect Password'
        })
    }
    else{
        const payLoad  = {email,id:existingUser._id,role:existingUser.accountType};
        const token = jwt.sign(payLoad,process.env.JWT_SECRET,{
            expiresIn:'2h',
        });
        existingUser.token = token; 
        existingUser.password = null;
        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true 
        }
        res.cookie('token',token,options).status(200).json({
            success:true,
            token,
            user: existingUser,
            message:'Login Successful'
        })
    }


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message
        })

    }

}

//changePassword
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};
