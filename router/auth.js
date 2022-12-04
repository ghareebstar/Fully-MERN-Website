const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')
const router = express.Router();
const Authenticate = require("../middleware/authenticate");
require("../db/conn");
const User = require("../models/userSchema");










// Middleware
router.use(express.json()); // To Show Data in Json Format while Using POSTMAN We use This Method

// router.use(express.urlencoded({extended:false})) // To Show Data On Front-End , We use This Method
// const middleware = (req, res, next) => {
//   console.log("Hello This is Middleware");
//   next();
// };







// Using Async Await Approch By Using Try Catch Block
// User Registeration Code 
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body; // If any Field is not Filled Throw Error to Fill All The Fields
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Please Fill All The Fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json("Email is Already Registered");
    } else if (password != cpassword) {
      res.status(422).json({ error: "Password not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      await user.save();
      res.status(201).json('User Registered Successfully');
      // res.send('User Registered Successfully')
    }
  } catch (error) {
    console.log("Error on Finding and Saving User to Databse", error);
  }

});








  // User Sign In Authentication Code 

router.post("/signin", async (req, res) => {
 
  try {

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please Fill All The Fields" });
    }

    const userLogin = await User.findOne({ email: email });

    // console.log(userLogin);

    if(userLogin){
      const isMatch = await bcrypt.compare(password, userLogin.password);

      // Calling JWT TOKEN FROM UserSchema : generateAuthToken 
      const token = await userLogin.generateAuthToken()
      // console.log(token);

       // Generating JWT on Every Login
 
       // How to Store JWT Token in Cookie For Authentication 
 
       res.cookie('jwtoken', token, {
       expires:new Date(Date.now()+ 25892000000),
       httpOnly:true
 
       })

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        res.status(201).json({ message: "User Sign in Successfully" });
      }
      // res.status(400).json({ error : 'user error '})
      }else{
        res.status(400).json({ error: "Invalid Credentials" });
    } 

    }
     catch (error) {
      console.log("Error on Signin " + error);
    }







     
//  About Us Page
router.get("/about", Authenticate , (req ,  res) => {
  // console.log('Hello About Us Page');
  res.send(req.rootUser)
});


  //  Get User Data For Contact Us and Home Page
router.get("/getdata" , Authenticate , (req ,  res) => {
  // console.log('Hello Contact Us');
  // res.send('Contact')
  res.send(req.rootUser)
});


router.post("/contact" , Authenticate , async(req ,  res) => {

  try {
    
    const {name, email, phone, message }  = req.body

    if( !name || !email || !phone || !message ){

      
      // console.log('Error in Contact Form ');
      
      return res.json({error : 'Please Fill The Conact Form'})
    }
    

    const userContact = await User.findOne({ _id : req.userID })

  if(userContact){

      const userMessage = await userContact.addMessage(name, email, phone, message)
      await userContact.save()

      res.status(201).json({message:'Message Received Successfully'})
    }

  } catch (error) {
    console.log(error);
  }
 
});

});




router.get("/logout",  (req ,  res) => {
  // console.log('Hello Logout');
  res.clearCookie('jwtoken', {path:'/'})
  res.status(200).send('User Logout')
});


module.exports = router;
