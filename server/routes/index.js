const express = require('express') ;
const router = express.Router() ;



router.use('/user' , require('./user')) ;
router.use('/assignment' , require('./assignment')) ;
router.use('/attendence' , require('./attendence')) ;
router.use('/V2' , require('./v2')) ;


module.exports = router ;