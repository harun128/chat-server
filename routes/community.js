var express = require('express');
var router = express.Router();
var User = require("./../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {communityMessageValidation} = require("../validation");
const verifyToken = require("./../middleware/verifyToken");
const Message = require("./../models/Message");
const {countries} = require("./../helper/countries")

router.post("/last-messages",function(req,res,next) {
    const id = (req.params.id) ? req.params.id : 1;
    Message.find().limit(5).sort({"sendDate":-1}).populate("sender","username  location sendDate").exec(function(err,result){
        
        for(i =0 ; i< result.length;i++) {
            if(result[i].message.length > 29) {
                result[i].message = (result[i].message).substring(0,29)+"...";
            }            
        }
        res.json(result);        
    })   
    
});

router.post("/send-message",verifyToken, async function (req,res,next) {
    const {error} =communityMessageValidation(req.body);
    if(error) return res.status(400).send({success:false,message:error.details[0].message});
    
    const message = new Message({
        sender : req.user._id,
        message : req.body.message,
        country:req.body.country
    });
    try{
        const saveMessage =  await  message.save();
        if(saveMessage) {
            res.json({success:true});
        }else {
            res.json({success:false});
        }

    }catch(e) {
        console.log(e);
    }
})


router.get("/countries",function(req,res,next) {
    res.json(countries);
});


module.exports = router;