const mongoose = require('mongoose') ;

const cse_schema = new mongoose.Schema({
    first : {
        type : Array
    },
    second : {
        type : Array
    },
    third : {
        type : Array
    },
    fourth : {
        type : Array
    },
    fifth : {
        type : Array
    },
    sixth : {
        type : Array
    },
    seventh : {
        type : Array
    },
    eight : {
        type : Array
    },
})

const cse = mongoose.model('cse' , 'cse_schema') ;
module.exports = cse ; 