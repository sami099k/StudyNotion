
//you don't have to  add a profile because it is already added with adding a User
require('dotenv').config();
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloduinary } = require("../utils/imageUploader");

exports.updateProfile = async (req, res) => {
    try {

        const { dateOfBirth = '', about = '', phNo, gender } = req.body;
        const user_id = req.user.id;
        if (!phNo || !gender || !user_id) {
            return res.status(400).json({
                success: false,
                messae: 'All fields are req'

            })
        }


        const user = await User.findById(user_id);

        const profile_id = user.additionalDetails;

        const updatedProfile = await Profile.findByIdAndUpdate(profile_id, {
            dateOfBirth,
            about,
            gender
        }, { new: true });

        return res.status(200).json({
            success: true,
            mesasage: 'Profile updated successfully',
            updatedProfile
        })

    } catch (err) {
        return res.status(500).json({
            succeess: false,
            message: 'Error in editing the profile',
        })
    }
}


//delete account 

exports.deleteAccount = async (req,res)=>{
    try{

        const uid = req.user.id;
        const user = await User.findById(uid);
        if(!user){
            return res.status(404).json({
                success:false,
                message:'user not found'
            })
        }
        const profile_id = user.additionalDetails;
        await Profile.findByIdAndDelete(profile_id);
        await User.findByIdAndDelete(uid);

        return res.status(200).json({
            success:true,
            message:'User deleted successfully',
            user
        })

    }catch(err){
        return res.status.json({
            success:false,
            message:err.mesasage
        })
    }
}

//scheduling requests and crone jobs


exports.getAllUserDetails = async (req,res)=>{
    try{
        const uid = req.user.id;
        const user = await User.findById(uid).populate('additionalDetails').populate('courses').populate('CourseProgress').exec();
        if(!user){
            return res.status(404).json({
                success:false,
                message:'User not found'
            });
        }
        return res.status(200).json({
            success:true,
            message:'Data fetched successfully',
            user
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

exports.updateDisplayPicture = async (req,res)=>{
    try{
        const uid = req.user.id;


        const imageFile = req.files.imageFile;

        console.log('hello');

        const uploadedImage = await uploadImageToCloduinary(imageFile,'Practice');
        console.log(process.env.FOLDER);
        const user = await User.findByIdAndUpdate(uid,{
            image:uploadedImage.secure_url,
        });
        if(!user){
            return res.status(404).json({
                success:false,
                mesage:'user not found'
            });
        }

        return res.status(200).json({
            success:true,
            user
        })
       

    }catch(err){
        return res.status(500).json({
            succeess:false,
            message:err.messae
        })
    }
}