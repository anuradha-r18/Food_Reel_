const mongoose = require('mongoose');
const userModel = require('./user.model');
const foodModel = require('./food.model');

const likeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"user",
        required:true
    },
    food:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"food",
        required:true
    }
},{
    timestamps:true
    
})




const Like = mongoose.model("like" , likeSchema);

module.exports = Like;