const mongoose = require('mongoose') ;

mongoose.connect('mongodb://localhost/CollegeManagement' , 
 {
    useUnifiedTopology : true ,
    useNewUrlParser : true
 }) ;

 const db = mongoose.connection ; 

 db.on('error' , (err) => {
     console.log("Error in Database : " , err.message) ;
 }) ;

 db.once('open' , () => {
     console.log("Successfully connected to DB") ;
 }) ;

 module.exports = db ;