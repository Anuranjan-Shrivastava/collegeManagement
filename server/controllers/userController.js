const usersdb = require('../models/user') ;
const noticedb = require('../models/notice') ;
const multer = require('multer') ;
const fs = require('fs') ;
const jwt = require('jsonwebtoken') ;
const datauri = require('datauri');

//Controller for user SignUp
module.exports.signup = async function(req,res){
    console.log("A SignUp Req recieved") ;
    console.log(req.body) ; 
    const {name , email , password , branch,gender , profession , semester} = req.body ; 
    let user = await usersdb.findOne({
        email : email
    }) ;
    if(!user){
        //create user
        //ta -> total Classes 
        //ca -> class Attended
        let monthlyAttendenceArray = [
            {
                month : "Jan",
                tc : 0 , 
                ca : 0
            },
            {
                month : "Feb",
                tc : 0 , 
                ca : 0
            },
            {
                month : "Mar",
                tc : 0 , 
                ca : 0
            },
            {
                month : "Apr",
                tc : 0 , 
                ca : 0
            },
            {
                month : "May",
                tc : 0 , 
                ca : 0
            },
            {
                month : "June",
                tc : 0 , 
                ca : 0
            },
            {
                month : "July",
                tc : 0 , 
                ca : 0
            },
            {
                month : "Aug",
                tc : 0 , 
                ca : 0
            },
            {
                month : "Sep",
                tc : 0 , 
                ca : 0
            },
            {
                month : "Oct",
                tc : 0 , 
                ca : 0
            },
            {
                month : "Nov",
                tc : 0 , 
                ca : 0
            },
            {
                month : "Dec",
                tc : 0 , 
                ca : 0
            }
        ]
        let newUser = await usersdb.create({
            name : name , 
            email : email , 
            password : password , 
            branch : branch , 
            gender : gender ,
            designation : profession , 
            semester : semester,
            totalClasses : 0 , 
            classesAttended : 0 ,
            monthlyAttendence : monthlyAttendenceArray , 
            resume : "" , 
            about : "" , 
            skills : [] , 
            socialLinks : [] , 
            cover : "" , 
            dp : "" , 
            assignment : [] , 
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

// controller for notice handler

module.exports.addnotice = async function(req, res){
    console.log("In add notce trying to add pdf & images : " ) ;
    console.log("File Name :  " , req.files) ;
   

    const { user, text , userDesignation}= req.body 

    let newNoticet = {
        user: user,
        text: text , 
        userDesignation : userDesignation , 
        pdf : req.files.pdf == undefined ? null : req.files.pdf[0].filename , 
        img : req.files.img == undefined ? null : req.files.img[0].filename , 
    }
    console.log("New Notice : " , newNoticet) ;


    let newNotice = await noticedb.create({
        user: user,
        text: text , 
        pdf : req.files.pdf == undefined ? null : req.files.pdf[0].filename , 
        img : req.files.img == undefined ? null : req.files.img[0].filename , 
        userDesignation : userDesignation , 
    })
   
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
    console.log('Request to fetch all notice');
    
    let noticeData = await noticedb.find({}).sort({"createdAt": -1}) ; 
    let noticeToSend = [] ;
    for(let i = 0 ; i < noticeData.length ; i++){
        let notice = noticeData[i] ;
        let emailId = notice.user  ; 
        let postedBy =  await usersdb.findOne({email : emailId}) ;
        let name = postedBy.name ;
        let posterId = postedBy._id ; 
        let pdfToSend = null ;
        let pdfOriginalName = "" ;
        if(notice.pdf != null){
            let pdf = `../Server/uploads/${notice.pdf}` ; 
            pdfToSend = await datauri(pdf) ;
            pdfOriginalName= notice.pdf.split('-')[0] ;
        }
        let imgToSend = null ; 
        if(notice.img != null){
            let img = `../Server/uploads/${notice.img}` ; 
            imgToSend = await datauri(img) ;
        }

        let newNotice = {
            text : notice.text ,
            name : name , 
            posterId : posterId , 
            date : notice.createdAt , 
            id : notice._id ,
            useremail : emailId,
            pdf : pdfToSend , 
            pdfname : pdfOriginalName ,
            img : imgToSend , 
            designation : notice.userDesignation
        }
    
        noticeToSend.push(newNotice) ;
    }

    if(noticeToSend) {
        res.status(200).send({
        data : {
            success : true , 
            data : noticeToSend
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


module.exports.deleteNotice = async function(req, res){
   console.log("Delete Notice Recieved") ;
   let postId = req.body.postId ; 
   let notice = await noticedb.findOneAndDelete({_id : postId}) ;
   console.log(notice) ;
   return res.status(200).send({
        data : {
            success : true , 
            message : "Deleted"
        }
   }) ;
}



//multer configuration 

const multerConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("At destination : " , file) ;
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        console.log("At fileName : " , file) ;
        const ext = file.mimetype.split('/')[1] ;
        const name = file.originalname.split('.')[0] ;
        const fileName = `${name}-${req.user._id}-${Date.now()}.${ext}` ;
        console.log(fileName) ;
        cb(null , fileName) ;
    },
})


const isValidFile = (req , file , cb) => {
   let ext = file.mimetype.split('/')[1] ;
   if(ext == "pdf" || ext == "jpg" || ext =="png" || ext == "jpeg"){
       cb(null , true) ;
   } 
}

const  upload = multer({ 
    storage : multerConfig , 
    fileFilter : isValidFile
}) ;

module.exports.uploadPdf = upload.fields([
    {
        name : "img",
        maxCount: 1 
    } , 
    {
        name : "pdf",
        maxCount: 1 
    }
]) ;


module.exports.pdfUpload = async function(req, res){
    console.log("Pdf Recieved") ;
    res.status(200).send({
        data : {
            success : true , 
            message : "Pdf Reached"
        }
    })
 }

 module.exports.askPdf = async function(req, res){
    console.log("Ask Pdf") ;
    // var file = fs.createReadStream("./uploads/Anuranjan's Resume-61bb8818561053415b575cb4-1640460018485.pdf");
    const content = await datauri("./uploads/Anuranjan's Resume-61bb8818561053415b575cb4-1640460018485.pdf" , (err, content, meta) => {
        if (err) {
          throw err;
        }
      
        // console.log(content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
      
        // console.log("Mime : " , meta.mimetype); //=> "image/png"
        // console.log("Base64 : " , meta.base64); //=> "iVBORw0KGgoAAAANSUhEUgAA..."
        // console.log("Buffer  : " ,meta.buffer); //=> file buffer
      });

    res.status(200).send({
        data : {
            success : true , 
            message : "sending" ,
            pdf : content  
        }
    })
 }



//  controller related to user profile
 module.exports.getProfile = async function(req, res){
     console.log("Profile Fetching Request Recieved") ;
     const userId = req.query.user ; 
     const user = await usersdb.find({_id : userId}) ;
     const fileName = `resumeof${userId}.pdf` ;
     let newUser = {
        _id : user[0]._id , 
        name : user[0].name , 
        email : user[0].email , 
        branch : user[0].branch , 
        designation : user[0].designation,
        semester : user[0].semester ,  
        totalClasses : user[0].totalClasses , 
        classesAttended : user[0].classesAttended , 
        monthlyAttendence : user[0].monthlyAttendence , 
        skills : user[0].skills , 
        socialLinks : user[0].socialLinks , 
        about : user[0].about , 
        resume : null , 
        cover : null , 
        dp : null ,
    }
     if(user[0].resume === `/uploads/resumeof${user[0]._id}.pdf`){
         console.log("Rsume Present")
         const content = await datauri(`.${user[0].resume}`) ;
         newUser.resume = content 
     }
     const fileName1 = `/uploads/coverof${user[0]._id}.jpg` ;
     const fileName2 = `/uploads/coverof${user[0]._id}.jpeg` ;
     const fileName3 = `/uploads/coverof${user[0]._id}.png` ;
     if(user[0].cover === fileName1 || user[0].cover === fileName2 || user[0].cover === fileName3){
        console.log("Rsume Present")
        const content = await datauri(`.${user[0].cover}`) ;
        newUser.cover = content 
     }
     const dp1 = `/uploads/dpof${user[0]._id}.jpg` ;
     const dp2 = `/uploads/dpof${user[0]._id}.jpeg` ;
     const dp3 = `/uploads/dpof${user[0]._id}.png` ;
     if(user[0].dp === dp1 || user[0].dp === dp2 || user[0].dp === dp3){
        console.log("DP Present")
        const content = await datauri(`.${user[0].dp}`) ;
        newUser.dp = content 
     }

    
    return res.status(200).send({
        data : {
            success : true , 
            message : "sending" ,
            user : newUser 
        }
    })
 }

 module.exports.updateProfile = async function(req, res){
    console.log("Profile Update Request Recieved") ;
    const field = req.query.user ; 
    const data = req.body.data;
    console.log(field , data) ;
    const user = await usersdb.find({_id : req.user._id}) ; 
    
       if(field === "about"){
           user[0].about = data ; 
           user[0].save() ;
       }
       if(field === "skills"){
            user[0].skills.push(data) ; 
            user[0].save() ;
       }
       if(field === "socialLinks"){
           user[0].socialLinks.push({data}) ;
           user[0].save() ;
       }
       let newUser = {
        _id : user[0]._id , 
        name : user[0].name , 
        email : user[0].email , 
        branch : user[0].branch , 
        designation : user[0].designation,
        semester : user[0].semester ,  
        totalClasses : user[0].totalClasses , 
        classesAttended : user[0].classesAttended , 
        monthlyAttendence : user[0].monthlyAttendence , 
        skills : user[0].skills , 
        socialLinks : user[0].socialLinks , 
        about : user[0].about , 
        resume : null , 
        cover : null , 
        dp : null ,
    }
     if(user[0].resume === `/uploads/resumeof${user[0]._id}.pdf`){
         console.log("Rsume Present")
         const content = await datauri(`.${user[0].resume}`) ;
         newUser.resume = content 
     }
     const fileName1 = `/uploads/coverof${user[0]._id}.jpg` ;
     const fileName2 = `/uploads/coverof${user[0]._id}.jpeg` ;
     const fileName3 = `/uploads/coverof${user[0]._id}.png` ;
     if(user[0].cover === fileName1 || user[0].cover === fileName2 || user[0].cover === fileName3){
        console.log("Rsume Present")
        const content = await datauri(`.${user[0].cover}`) ;
        newUser.cover = content 
     }
     const dp1 = `/uploads/dpof${user[0]._id}.jpg` ;
     const dp2 = `/uploads/dpof${user[0]._id}.jpeg` ;
     const dp3 = `/uploads/dpof${user[0]._id}.png` ;
     if(user[0].dp === dp1 || user[0].dp === dp2 || user[0].dp === dp3){
        console.log("DP Present")
        const content = await datauri(`.${user[0].dp}`) ;
        newUser.dp = content 
     }

    
    return res.status(200).send({
        data : {
            success : true , 
            message : "sending" ,
            user : newUser 
        }
    })
    
}

module.exports.deleteProperty = async function(req , res){
    console.log("Delete Propery Request Recieved") ;
    let name = req.query.propertyname ; 
    let value = req.body.value ;
    
    if(name === "skill"){
        const user = await usersdb.findOne({_id : req.user._id}) ;
        let index = user.skills.findIndex(skill => skill === value) ;
        user.skills.splice(index,1) ;
        await user.save() ;

    }
    if(name === "link"){
        const user = await usersdb.findOne({_id : req.user._id}) ;
        let index = user.socialLinks.findIndex(link => link.platform === value) ;
        user.socialLinks.splice(index,1) ;
        await user.save() ;
    }

    return res.status(200).send({
        data  : {
            success : true , 
            message : "Delete"
        }
    })
}