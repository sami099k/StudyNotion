const jwt = require('jsonwebtoken');

require('dotenv').config()

//auth 

exports.auth = async (req,res,next)=>{
    try{

        const token = req.header('Authorization').replace('Bearer ','');


        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decoded;
           

        }catch(err){
            res.status(401).json({
                success:false,
                data:err.message,
                message:'Error in decoding token'
            })
        }
         next();


    }catch(err){
        return res.status(401).json({
            success:false,
            message:err.message,
            data:'error in token verification'
        })
    }
}

//isStudent 

exports.isStudent = async (req,res,next)=>{
    try{
        if(req.user.role!=='Student'){
        return res.status(400).json({
            success:false,
            message:'This a protected route for students only'
        })
    }
    next();
    }catch(err){
        console.log(err);
        return res.status(401).json({
            success:false,
            message:err.message,
            data:'error in role verification for students'
        })
    }
}

//isInstructor

exports.isInstructor = async (req,res,next)=>{
    try{
        if(req.user.role!=='Instructor'){
        return res.status(400).json({
            success:false,
            message:'This a protected route for Instructor only'
        })
    }
    next();
    }catch(err){
        console.log(err);
        return res.status(401).json({
            success:false,
            message:err.message,
            data:'error in role verification for Instructor'
        })
    }
}

//isAdmin

exports.isAdmin = async (req,res,next)=>{
    try{
        if(req.user.role!=='Admin'){
        return res.status(400).json({
            success:false,
            message:'This a protected route for Admin only'
        })
    }
    next();
    }catch(err){
        console.log(err);
        return res.status(401).json({
            success:false,
            message:err.message,
            data:'error in role verification for Admin'
        })
    }
}