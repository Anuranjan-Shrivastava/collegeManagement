const express = require('express') ;
const router = express.Router() ;


router.get('/' , (req , res) => {
    console.log("Request Recived") ;
    return res.json(200 , {
        data : {
            success : true ,
            error : null 
        }
    }) ;  
})

router.use('/user' , require('./user')) ;
router.use('/attendence' , require('./attendence') ) ;

module.exports = router ;