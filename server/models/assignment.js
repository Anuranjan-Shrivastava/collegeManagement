const mongoose = require('mongoose') ;

const assignment_schema = new mongoose.Schema({
    nameTeacher : {
        type : String , 
        required : true 
    } , 
    subject : {
        type : String , 
        required : true 
    },
    nameAssignment : {
        type : String , 
        required : true 
    },
    branch : {
        type : String , 
        required : true 
    } , 
    semester : {
        type : String , 
        required : true 
    },
    lastdate : {
        type : Date  , 
        required : true , 
    } , 
    submission : {
        type : Array 
    } , 
    nosubmission : {
        type : Array
    } , 
    assignPdf : {
        type : String , 
    } , 
    assignPicture : {
        type : String 
    }

} , {
    timestamps : true 
}) ;

const assignment = mongoose.model('assignment' , assignment_schema) ;
module.exports = assignment ; 