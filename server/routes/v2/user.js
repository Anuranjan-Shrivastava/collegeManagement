const express = require('express') ;
const router = express.Router() ;
const passwordReset = require('../../controllers/v2/passwordReset') ;

router.post('/passwordreset' , passwordReset.resetPassword)  ; 
router.post('/passwordupdate' , passwordReset.passwordUpdate) ;


module.exports = router  ; 