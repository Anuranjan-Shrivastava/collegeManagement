const mongoose = require('mongoose') ;

const notes_schema = new mongoose.Schema({
    nameTeacher : {
        type : String , 
        required : true 
    } , 
    subject : {
        type : String , 
        required : true 
    },
    nameNotes : {
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
    dateProvided : {
        type : Date  , 
        required : true , 
    } , 
    notesPdf : {
        type : String , 
    } , 
} , {
    timestamps : true 
}) ;

const notes = mongoose.model('notes' , notes_schema) ;
module.exports = notes ; 