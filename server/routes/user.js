const express = require('express') ;
const router = express.Router() ;
const user_controller = require('../controllers/userController') ;
const resume_controller = require('../controllers/resumeControllers') ;
const passport = require('passport') ;

router.post('/login' , user_controller.login) ;

router.post('/signup' , user_controller.signup ) ;

router.post('/addnotice', [passport.authenticate('jwt' , {session : false})  ,  user_controller.uploadPdf ] ,user_controller.addnotice)

router.get('/getNotice',passport.authenticate('jwt',{session : false})  ,user_controller.getnotice) ;

router.post('/deleteNotice',passport.authenticate('jwt',{session : false})  ,user_controller.deleteNotice)

router.post('/pdfUpload' ,[passport.authenticate('jwt' , {session : false})  ,  user_controller.uploadPdf ]   ,user_controller.pdfUpload )

router.get('/askPdf' ,passport.authenticate('jwt' , {session : false})  ,user_controller.askPdf )  ;

router.get('/getProfile',passport.authenticate('jwt',{session : false})  ,user_controller.getProfile) ; 

router.post('/updateProfile',passport.authenticate('jwt',{session : false})  ,user_controller.updateProfile) ; 

router.post('/deleteProperty' ,passport.authenticate('jwt',{session : false}),user_controller.deleteProperty ) ;

router.get('/deleteResume' ,passport.authenticate('jwt',{session : false}) ,  resume_controller.deleteResume) ;
router.post('/uploadResume' , [passport.authenticate('jwt',{session : false}) , resume_controller.uploadPdf]  ,resume_controller.uploadResume)

router.post('/uploadCover' , [passport.authenticate('jwt',{session : false}) , resume_controller.uploadCover]  ,resume_controller.uploadCoverC)

router.post('/uploadDp' , [passport.authenticate('jwt',{session : false}) , resume_controller.uploadProfilepic]  ,resume_controller.uploadDp)

module.exports = router  ; 