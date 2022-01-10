const usersdb = require('../models/user') ;
const multer = require('multer') ;
const fs = require('fs') ;
const datauri = require('datauri');


//controller for resume upload 

const multerConfig = multer.diskStorage({
    destination: (req, file, cb) => {
       console.log("At destination : ") ;
        cb(null, "uploads/")
    },
    filename: async (req, file, cb) => {
        console.log("At fileName : ") ;
        const ext = file.mimetype.split('/')[1] ;
        const name = file.originalname.split('.')[0] ;
        const fileName = `resumeof${req.user._id}.${ext}` ;
        const user = await usersdb.find({_id : req.user._id}) ;
      
        if(user[0].resume === `/uploads/${fileName}`){
            let oldResumePath = `../Server${user[0].resume}` ;
            fs.unlinkSync(oldResumePath) ;
            user[0].resume = `/uploads/${fileName}` ;
            await user[0].save() ;

        }else {
            user[0].resume = `/uploads/${fileName}` ;
            await user[0].save() ;

        }

        console.log(fileName) ;
        cb(null , fileName) ;
    },
})


const isValidFile = (req , file , cb) => {
   let ext = file.mimetype.split('/')[1] ;
   if(ext == "pdf"){
       cb(null , true) ;
   } 
}

const  upload = multer({ 
    storage : multerConfig , 
    fileFilter : isValidFile
}) ;

module.exports.uploadPdf = upload.single("pdf");


module.exports.uploadResume  = async function(req,res) {
    console.log("Resume Upload Req Rec") ;
    return res.status(200).send({
        data : {
            success : true , 
            message : "Resume Uploaded"
        }
    })
}

//Multer and controller for cover pic 


const multerConfig2 = multer.diskStorage({
    destination: (req, file, cb) => {
       console.log("At destination : ") ;
        cb(null, "uploads/")
    },
    filename: async (req, file, cb) => {
        console.log("At fileName : ") ;
        const ext = file.mimetype.split('/')[1] ;
        const name = file.originalname.split('.')[0] ;
        const fileName = `coverof${req.user._id}.${ext}` ;
        const user = await usersdb.find({_id : req.user._id}) ;
      
        if(user[0].cover === `/uploads/${fileName}`){
            let oldResumePath = `../Server${user[0].cover}` ;
            fs.unlinkSync(oldResumePath) ;
            user[0].cover = `/uploads/${fileName}` ;
            await user[0].save() ;

        }else {
            user[0].cover = `/uploads/${fileName}` ;
            await user[0].save() ;

        }

        console.log(fileName) ;
        cb(null , fileName) ;
    },
})


const isValidImage = (req , file , cb) => {
   let ext = file.mimetype.split('/')[1] ;
   if(ext == "png" || ext == "jpg" || ext == "jpeg"){
       cb(null , true) ;
   } 
}

const  upload2 = multer({ 
    storage : multerConfig2 , 
    fileFilter : isValidImage
}) ;

module.exports.uploadCover = upload2.single("cover");


module.exports.uploadCoverC  = async function(req,res) {
    console.log("Cover Pic Upload Req Rec") ;
    return res.status(200).send({
        data : {
            success : true , 
            message : "Cover Uploaded"
        }
    })
}

//multer & controller for dp



const multerConfig3 = multer.diskStorage({
    destination: (req, file, cb) => {
       console.log("At destination : ") ;
        cb(null, "uploads/")
    },
    filename: async (req, file, cb) => {
        console.log("At fileName : ") ;
        const ext = file.mimetype.split('/')[1] ;
        const name = file.originalname.split('.')[0] ;
        const fileName = `dpof${req.user._id}.${ext}` ;
        const user = await usersdb.find({_id : req.user._id}) ;
      
        if(user[0].dp === `/uploads/${fileName}`){
            let oldResumePath = `../Server${user[0].dp}` ;
            fs.unlinkSync(oldResumePath) ;
            user[0].dp = `/uploads/${fileName}` ;
            await user[0].save() ;

        }else {
            user[0].dp = `/uploads/${fileName}` ;
            await user[0].save() ;

        }

        console.log(fileName) ;
        cb(null , fileName) ;
    },
})


const isValidDp = (req , file , cb) => {
   let ext = file.mimetype.split('/')[1] ;
   if(ext == "png" || ext == "jpg" || ext == "jpeg"){
       cb(null , true) ;
   } 
}

const  upload3 = multer({ 
    storage : multerConfig3 , 
    fileFilter : isValidDp
}) ;

module.exports.uploadProfilepic = upload3.single("dp");


module.exports.uploadDp  = async function(req,res) {
    console.log("Dp Pic Upload Req Rec") ;
    return res.status(200).send({
        data : {
            success : true , 
            message : "DP Uploaded"
        }
    })
}

// comtroller for deleting resume 

module.exports.deleteResume = async function(req , res) {
    console.log("About to delete this resume ")
    let id = req.user._id ; 
    let user = await usersdb.findOne({_id : id}) ;
    let oldResumePath = `../Server${user.resume}` ;
    fs.unlinkSync(oldResumePath) ;
    user.resume = "" ;
    user.markModified('resume') ;
    await user.save() ;

    return res.status(200).send({
        data : {
            success : true 
        }
    })

}


