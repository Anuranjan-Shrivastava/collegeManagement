const passport = require('passport') ;
const JwtStrategy = require('passport-jwt').Strategy ;
const ExtractJwt = require('passport-jwt').ExtractJwt ;
const Usersdb = require('../models/user') ;

var opts = {} ;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken() ;
opts.secretOrKey = 'collegeManagement' ;

passport.use(new JwtStrategy(opts , function(jwt_payload ,done ){
    Usersdb.findById(jwt_payload._id , function(err , user){
        if(err){
            console.log("Error At JWT startegy : " , err) ;
            return done(err , false) ;
        }
        if(user){
            return done(null , user) ;
        }else{
            return done(null , false) ;
        }
    }) 
}))

module.exports = passport ; 