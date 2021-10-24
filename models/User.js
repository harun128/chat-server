const mongoose = require("mongoose");
const Schema = mongoose.Schema
const refreshTokens = new Schema({
    token: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique:true,
        trim:true
    },
    password: {
        type:String,
        required: true,
        trim:true
    },
    messages: [
        {
            conversationId : {
                type:mongoose.SchemaTypes.ObjectId,
                ref: 'Conversations',
                required:true,
            },
            lastUpdate: {
                type:Date,
                default:Date.now
            }          
        }
    ],
    username: {
        type: String,
        required: true,
        trim:true
    },
    created: {
        type:Date,
        default:Date.now
    },
    isProUser: {
        type:Boolean,
        default:false
    },
    image : {
        type:String,
        default: "default.png"
    },
    profileDescription: {
        type:String,
        default: "",
        trim:true
    },
    location : {
        type:String,
        default:"",
        trim:true
    },
    refreshTokens: [refreshTokens]
}));