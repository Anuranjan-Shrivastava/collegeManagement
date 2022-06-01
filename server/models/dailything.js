const mongoose = require('mongoose') ;

const dailything_schema = new mongoose.Schema({
   date : {
       type : Date ,
       required : true 
   } , 
   totalClasses : {
       type : Number 
   } , 
   classesAttended : {
       type : Number 
   } , 
   classesBy : {
       type : Array 
   },
   classesTaken : {
       type : Array 
   },
   classesIn : {
       type : Array 
   }
}) ;

const dailything = mongoose.model('dailything' , dailything_schema) ;
module.exports = dailything ;                                          