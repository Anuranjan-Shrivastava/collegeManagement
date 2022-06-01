const mongoose = require('mongoose') ;

const attendence_schema = new mongoose.Schema({
    user : {
        type : mongoose.ObjectId , 
        required : true 
    } , 
    totalClasses : {
        type : Number ,
    },
    classesAttended : {
        type : Number ,
    },
    january : {
        type : Array
    },
    february : {
        type : Array
    },
    march : {
        type : Array
    },
    april : {
        type : Array
    },
    may : {
        type : Array
    },
    june : {
        type : Array
    },
    july : {
        type : Array
    },
    august : {
        type : Array
    },
    september : {
        type : Array
    },
    october : {
        type : Array
    },
    november : {
        type : Array
    },
    december : {
        type : Array
    },
    tcjanuary : {
        type : Number
    },
    tcfebruary : {
        type : Number
    },
    tcmarch : {
        type : Number
    },
    tcapril : {
        type : Number
    },
    tcmay : {
        type : Number
    },
    tcjune : {
        type : Number
    },
    tcjuly : {
        type : Number
    },
    tcaugust : {
        type : Number
    },
    tcseptember : {
        type : Number
    },
    tcoctober : {
        type : Number
    },
    tcnovember : {
        type : Number
    },
    tcdecember : {
        type : Number
    },
    cajanuary : {
        type : Number
    },
    cafebruary : {
        type : Number
    },
    camarch : {
        type : Number
    },
    caapril : {
        type : Number
    },
    camay : {
        type : Number
    },
    cajune : {
        type : Number
    },
    cajuly : {
        type : Number
    },
    caaugust : {
        type : Number
    },
    caseptember : {
        type : Number
    },
    caoctober : {
        type : Number
    },
    canovember : {
        type : Number
    },
    cadecember : {
        type : Number
    },
    teachers : {
        type : Array
    },
    numClasses : {
        type : Array
    },
    semester : {
        type : Array 
    }
}) ;

const attendence = mongoose.model('attendence' , attendence_schema) ;
module.exports = attendence ; 