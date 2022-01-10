const mongoose = require('mongoose') ;

const notice_schema = new mongoose.Schema({
    user : {
        type : String,
        required: true
    },
    text: {
        type:String,
    } , 
    pdf : {
        type : String 
    } , 
    img : {
        type : String
    } , 
    userDesignation : {
        type : String
    }

} , 
   {
    timestamps : true , 
    }
 )

const notice = mongoose.model('notice' , notice_schema);
module.exports = notice ; 