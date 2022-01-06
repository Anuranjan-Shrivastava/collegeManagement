//Requiring Modules
const express = require('express') ;
const app = express() ;
const port = 8000 ; 
const cors = require('cors') ;
const db = require('./config/mongoose') ;
const passport = require('passport') ;
const passport_jwt = require('./config/passport-jwt') ; ;


//Using Middleware
app.use(cors()) ;
app.use(express.json()) ;
app.use(express.urlencoded({
    extended : false  , 
    limit: '50mb'
})) ;
app.use(passport.initialize());



//diverging request to routes
const routes = require('./routes') ;
app.use('/' , routes) ;



//Listning to server
app.listen(port , (err) => {
    if(err){
        console.log("err") ;
    }
    console.log("Express Server Running on port " , port) ;
})