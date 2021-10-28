const express = require('express') ;
const router = express.Router() ;
const user_controller = require('../controllers/userController') ;
const passport = require('passport') ;

router.post('/login' , user_controller.login) ;

router.post('/signup' , user_controller.signup ) ;

router.post('/addnotice', passport.authenticate('jwt',{session : false}) ,user_controller.addnotice)

router.get('/addnotice',passport.authenticate('jwt',{session : false})  ,user_controller.getnotice)

module.exports = router  ; 