const nodemailer = require('nodemailer')

exports.sendMail = async (email,title,body)=>{

    try{
        let transporter = nodemailer.createTransport({
            host:process.env.HOST_MAIL,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        let info = transporter.sendMail({
            from:'sami',
            to:email,
            subject:title,
            html: body
        })
        console.log(info)
        return info

    }catch(err){
        console.log(err.message);
    }

}