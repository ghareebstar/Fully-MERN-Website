const mongoose = require('mongoose')
const DB = process.env.DATABASE      // .env file to secure our credentials : Fetching DATABASE from config.env

     mongoose.connect(DB).then(()=>{
        console.log('DB Connected');
     }).catch((err)=>{
        console.log('DB Not Connected',err);
     })
    
  