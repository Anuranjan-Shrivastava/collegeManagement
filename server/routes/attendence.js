const express = require('express') ;
const router = express.Router() ;
const attendence_controller = require('../controllers/attendenceController'); ;
const passport = require('passport') ;


// router.post('/studentList' , (req , res) => {
//     console.log("Req List for Student") ;
//     return res.json(200 , {
//         data : {
//             success : true ,
//             error : null , 
//             message : "Will send"
//         }
//     }) ;
// })
router.post('/studentList',passport.authenticate('jwt',{session : false}) , attendence_controller.getStudentList) ;
router.post('/update' ,passport.authenticate('jwt',{session : false}) , attendence_controller.updateStudent )
module.exports = router  ; 