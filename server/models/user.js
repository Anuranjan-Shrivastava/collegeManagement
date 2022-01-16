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
    monthlyAttendence : {
        type : Array , 
        required : true 
    } ,
    gender : {
        type : String , 
        required : true
    } , 
    about : {
        type : String 
    } , 
    skills : {
        type : Array
    } , 
    socialLinks : {
        type : Array
    } , 
    resume : {
        type : String
    } , 
    cover : {
        type : String
    } , 
    dp : {
        type : String
    } , 
    assignment : {
        type : Array
    }
}) ;

const users = mongoose.model('users' , user_schema) ;
module.exports = users ; 