const mongoose = require('mongoose') ;

const user_schema = new mongoose.Schema({
    name : {
        type : String , 
        required : true 
    } , 
    email : {
        type : String , 
        required : true 
    },
    password : {
        type : String , 
        required : true 
    } , 
    branch : {
        type : String , 
        required : true 
    } , 
    designation : {
        type : String , 
        required : true 
    },
    semester : {
        type : String , 
        required : true 
    },
    totalClasses : {
        type : Number , 
        required : true 
    },
    classesAttended : {
        type : Number , 
        required : true 
    },
    gender : {
        type : String , 
        required : true
    }
}) ;

const users = mongoose.model('users' , user_schema) ;
module.exports = users ; 