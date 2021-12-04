const usersdb = require('../models/user') ;
const noticedb = require('../models/notice') ;

const jwt = require('jsonwebtoken') ;

//Controller for user SignUp
module.exports.signup = async function(req,res){
    console.log("A req recieved") ;
    console.log(req.body) ; 
    const {name , email , password , branch,gender , profession , semester} = req.body ; 
    let user = await usersdb.findOne({
        email : email
    }) ;
    if(!user){
        //create user
        let newUser = await usersdb.create({
            name : name , 
            email : email , 
            password : password , 
            branch : branch , 
            gender : gender ,
            designation : profession , 
            semester : semester,
            totalClasses : 0 , 
            classesAttended : 0 
        }) ;


        if(newUser){
               return res.json(200 , {
                   data : {
                       success : true ,
                       error : null 
                   }
               }) ;          
        }
        else{
           // return that internal server error
            return res.json(500 , {
                data : {
                    success : false ,
                    message : 'Internal Server Error/Unable to Signup'
                }
            }) ;
        }
    }else{
        //user exist
        return res.json(200 , {
            data : {
                success : false ,
                message : 'This email is already in use'
            }
        }) ;
    }
}



//Controller for user login
module.exports.login = async function(req,res){
    console.log("A req recieved") ;
    console.log(req.body) ; 
    const { email , password}  = req.body ;
    let user = await usersdb.findOne({email : email}) ;
    if(!user || user.password != password){
        return res.json(400 , {
            data : {
                success : false ,
                message : "Invalid email/password"
            }
        }) ;
    } 
    const token = jwt.sign(user.toJSON(), 'collegeManagement' , { expiresIn: '1h' }) ;
    return res.json(200 , {
            data : {
                success : true ,
                token : token,
                user : user ,
                message : "Login Successful" , 
            }
    }) ;
    
  
}

module.exports.addnotice = async function(req, res){
    const { user, text }= req.body 
    console.log('in notice', user,text);
    
    let newNotice = await noticedb.create({
        user: user,
        text: text
    })
    // body = {
    //     notice_mesage : "notice to all student plz attend the classes"
    // }
    if(newNotice){
               return res.json(200 , {
                   data : {
                       success : true ,
                       error : null 
                   }
               }) ;          
        }
        else{
           // return that internal server error
            return res.json(500 , {
                data : {
                    success : false ,
                    message : 'Internal Server Error/Unable to Signup'
                }
            }) ;
        }
}

module.exports.getnotice = async function(req, res){
    console.log('get req in notice');
    console.log("userEmail ",req.query.user);
    let noticeData = await noticedb.find({}) ;
    
    if(noticeData) {
        res.status(200).send({
        data : {
            success : true , 
            data : noticeData
        }
    })}
    else{
        return res.status(500).send({
            data : {
                success : false , 
                err : "Internal Server Error"
            }
        })
    }
}