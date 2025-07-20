const mongoose = require('mongoose');
const { sendMail } = require('../utils/mailSender');
const otpTemplate = require('../mail_templates/emailVerificationTemplate');

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    value:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
})

async function sendVerification(email,otp) {
    try{
        const mailResponse = await sendMail(email,'verification email from studynotion',otp);
        console.log('email sent successfully: ',mailResponse)
    }catch(err){
        console.log('err in sending mail: ',err);
    }
}

otpSchema.pre('save',async function(next){
    await sendVerification(this.email,otpTemplate(this.value));
    next();
})

module.exports = mongoose.model('OTP',otpSchema)