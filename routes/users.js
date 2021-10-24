var express = require('express');
var router = express.Router();
var User = require("./../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {registerValidation,loginValidation} = require("../validation");
const verifyToken = require("./../middleware/verifyToken");
const multer = require("multer");
//const apth = require("path");
const { path } = require('../app');
const fs = require("fs");
const sharp = require('sharp');

const imageFilter = require("./../helper/imageFilter");

const Jimp = require('jimp');

var aws = require('aws-sdk');

var multerS3 = require('multer-s3');


router.get('/',verifyToken, function(req, res, next) {
  res.send(req.user);
  const u =User.findByIdAndRemove({_id:req.user});
  res.send(u);
});

router.post('/register', async function(req,res,next) {  
    const {error} =registerValidation(req.body);
    if(error) return res.status(400).send({success:false,message:error.details[0].message});

    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send({success: false,message:"Email Exists"});

    const salt = await bcrypt.genSalt(10);
    const hashPasword = await bcrypt.hash(req.body.password,salt);

    const user = new User({
      email : req.body.email,
      password:hashPasword,
      username:req.body.username
    })
    try{
      const saveUser = await user.save();
      if(saveUser){
        res.send({success:true,user:user});
      } else {
        res.status(400).send({success:false,message:"Deneme1"});
      }
    }catch(err) {
      res.status(400).send({success:false,message:"Deneme2"});
    }
});

router.post("/login",async function(req,res,next) {
 
    const {error} = loginValidation(req.body);
    
    if(error) return res.status(400).send({success:false,message:error.details[0].message});

    const user = await User.findOne({email:req.body.email});

    if(!user) return res.status(400).send({success: false,message:"Email or password is wrong"});
    const validPass = await bcrypt.compare(req.body.password,user.password);
    
    if(!validPass) return res.status(400).send({success:false,message:"InvalidPassword"});
  
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    
    res.header("auth-token",token).send({success:true,user:user._id,image:user.image,username:user.username,location:user.location,description:user.profileDescription,token})

});

router.post("/my-account",verifyToken,async function(req,res,next) {
  const user = await User.findOne({_id:req.user._id},["email","image","username","profileDescription","email","location","isProUser"]);
  res.json(user);
});

router.post("/update-my-account",verifyToken,async function(req,res,next) {
  try{
    const user = await (await User.findOneAndUpdate({_id:req.user._id},req.body,{new:true,upsert:true,select:"username email image profileDescription location"}));
    res.json({success:true,user:user});
    console.log({success:true,user:user})
  }catch(e) {
    res.json({success:false});
    console.log({success:false})
  }  
})

router.post("/verify-account",verifyToken,function(req,res,next) {

  res.json({success:true});
})

const Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './public/images/profile')
    callback(null, './public/images/avatar')
    
  },
  filename(req, file, callback) {
    //callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
    callback(null,req.user._id+".png");
  },
})

//const upload = multer({ storage: Storage })

const upload = require("./../helper/FileUpload");


router.post("/change-profile-image",verifyToken,async function(req,res,next) {
  const singleUpload = upload(req.user._id).single("photo");
  singleUpload(req,res,async function(err){
    if(err){
      console.log(err);
    }
    //console.log(req.file.transforms);
    const user =  (await User.findOneAndUpdate({_id:req.user._id},{"image":req.user._id+".jpg"},{new:true,upsert:true,select:"username email image profileDescription location"}));
   
   
    const account = await User.findOne({_id:req.user._id},["email","image","username","profileDescription","email","location","isProUser"]);
    console.log({success:true,message:"image uploaded",user:account});
    res.json({success:true,message:"image uploaded",user:account});
  });



  
  
});


module.exports = router;
