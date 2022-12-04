const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
app.use(cookieParser());
// const port = process.env.PORT || 80

// DB Config

dotenv.config({ path: "./config.env" }); // .env file to secure our credentials
// DB Connection must require Here, not anywhere above {Error : The `uri` parameter to `openUri()` must be a string......Undefined}
require("./db/conn");
const UserModel = require("./models/userSchema"); // UserModel reuqire Here
app.use(require("./router/auth")); // We Link the Routes File to Make Our Routes Easy and Less Code in App.js

const PORT = process.env.PORT || 5000; // .env file to secure our credentials : Listening PORT From config.env

//  Step 1- Move Client Folder into Server : because we have to deploy just {Important: Delete git folder from client }
//  backend and front end will be deploy automatically
//  Step 2- Run : npm run build (in Client Folder)
//  Step 3- Write the Following Code to Serve Front End
//  Step 4- Delete the Proxy From Client's Package.json
//  Step 5- Add These Scripts in Server's Package.json
// {  "start": "node app.js",
//     "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install npm && run build "
//   }
//  Step 6- Login to Heroku and create a new app
//  Step 7- cd my project : and run ==> : git init
//  Step 8- heroku git:remote -a azsoftdevelopers
//  Step 9- git status : to check either files or uploaded or not : it's not mandatory
//  Step 10- git add .
//  Step 11- git commit -am "make it better"
//  Step 12- git push heroku master
//  Step 13- Add Daatabse and Secret Key Value to Heroku Variable

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

// Listeners

app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
});
