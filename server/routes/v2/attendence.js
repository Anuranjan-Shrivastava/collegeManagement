const express = require('express') ;
const router = express.Router() ;
const passport = require('passport') ;
const attendenceControllerV2 = require('../../controllers/v2/attendenceController') ;


// router.post('/studentList' , (req , res) => {
//     console.log("Req List for Student") ;
//     console.log(req.body) ;
//     return res.json(200 , {
//         data : {
//             success : true ,
//             error : null , 
//             message : "Will send"
//         }
//     }) ;
// })
router.post('/studentList' ,passport.authenticate('jwt',{session : false}) , attendenceControllerV2.getStudentList) ;
router.post('/update' ,passport.authenticate('jwt',{session : false}) , attendenceControllerV2.update) ;
router.post('/fetchAttendenceDetail' , passport.authenticate('jwt' , {session : false}) , attendenceControllerV2.fetchAttendenceDetail) ;

module.exports = router  ; 