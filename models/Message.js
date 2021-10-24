const mongoose = require("mongoose");
const Schema = mongoose.Schema

module.exports = mongoose.model("Message", new mongoose.Schema({
    sender : {
        ref : 'User',
        type: mongoose.SchemaTypes.ObjectId,
        required :true
    },
    message: {
        type: String,
        required:true,
    },
    country : {
        type : Number,
        required:true
    },
    sendDate: {
        type:Date,
        default:Date.now
    },
    
}));