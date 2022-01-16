const express = require('express') ;
const router = express.Router() ;
const passport = require('passport') ;
const assignmentController = require('../controllers/assignmentController') ;


router.post('/d' ,[passport.authenticate('jwt',{session : false}) , assignmentController.uploadAssignment] ,  assignmentController.makeAssignment) ;
router.get('/fetch' ,passport.authenticate('jwt',{session : false}) , assignmentController.fetchAssignment) ;
router.post('/submit', [passport.authenticate('jwt',{session : false}) , assignmentController.uploadAssignmentAnswer] ,  assignmentController.submitAssignmentAnswer) ;
module.exports = router ; 