const express = require('express') ;
const router = express.Router() ;

router.use('/attendence' , require('./attendence')) ;
router.use('/user' , require('./user')) ;
router.use('/notes' , require('./notes')) ;


module.exports = router ;