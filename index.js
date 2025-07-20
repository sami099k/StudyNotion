const express = require('express');
const { dbConnect } = require('./config/database');
const app = express();

const userRoute = require('./routers/User');
const profileRoute = require('./routers/Profile');
const paymentRoute = require('./routers/Payments');
const courseRoute = require('./routers/Course');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { CloudinaryConnect } = require('./config/clodinaryConnect');
const fileUpload = require('express-fileupload');


// Example: app.js or server.js
require('./models/User'); // This will load and register the User model
require('./models/Profile'); // Load Profile model
require('./models/CourseProgress'); // Load CourseProgress model
require('./models/Course'); // Load Course model (if User refers to it)
require('./models/SubSection'); // Load SubSection model (if CourseProgress refers to it)

// ... then connect to DB and start server

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp'
}))
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:'http://localhost:5173',
        credentials:true,
    })
);

require('dotenv').config();

app.use('/api/v1/auth',userRoute);
app.use('/api/v1/profile',profileRoute);
app.use('/api/v1/payment',paymentRoute);
app.use('/api/v1/course',courseRoute);

app.get('/',(req,res)=>{
    return res.json({
        success:true,
        message:'server started'
    })
})

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`App is Started at port ${PORT}`);
})

dbConnect();
CloudinaryConnect();