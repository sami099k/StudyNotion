const mongoose = require('mongoose');


exports.dbConnect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{console.log('Connected to the DB sucessfully')})
    .catch((err)=>{console.log(err)})
}

