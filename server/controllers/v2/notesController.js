var notesDB = require('../../models/notes') ;
var userDB = require('../../models/user') ;
var mongoose = require('mongoose') ;
const multer = require('multer') ;
const datauri = require('datauri') ;


// multer for configuration of assignment 

const multerConfigNotes = multer.diskStorage({
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


const isValidNotesFile = (req , file , cb) => {
   let ext = file.mimetype.split('/')[1] ;
   if(ext == "pdf" || ext == "jpg" || ext =="png" || ext == "jpeg"){
       cb(null , true) ;
   } 
}

const  uploadNotes = multer({ 
    storage : multerConfigNotes , 
    fileFilter : isValidNotesFile
}) ;

module.exports.uploadNotes = uploadNotes.fields([
    {
        name : "notesPdf",
        maxCount: 1 
    }
]) ;

// controller to create an assignment 
module.exports.makeNotes = async function(req , res){
    console.log("In makeNotes Controller") ;
    //get the teacher name who made this assignment
    let nameTeacher = req.user.name ; 
    let idTeacher = req.user._id ; 

    // fetching uploaded pdf/picture as assignment from multer
    let pdf = req.files.notesPdf == undefined ? null : `/uploads/${req.files.notesPdf[0].filename}` ; 

    //create new assignment
    let newAssignment = await notesDB.create({
        nameTeacher : nameTeacher , 
        subject : req.body.subName, 
        nameNotes : req.body.notesName , 
        branch : req.body.branch , 
        semester : req.body.semester ,  
        dateProvided : req.body.date , 
        notesPdf : pdf , 
    })
    //enter new assignment id into teacher db
    if(newAssignment)
    {   
        let teacher = await userDB.findOne({_id : idTeacher}) ;
        teacher.notes.push(newAssignment._id) ;
        teacher.markModified('notes') ;
        await teacher.save() ;
        
         
        return res.status(200).send({
            data : {
                success : true   , 
            }
        })
   }
   return res.status(400).send({
        data : {
            success : true , 
            message : "Assignment Error"
        }
    }) 
}

module.exports.fetchNotes = async function(req , res){
    console.log("Notes req rec") ; 
    // return res.status(200).json({
    //     data : {
    //         message : "Haan bhj ra notes "
    //     }
    // })


    console.log("Request to fetch notes") ;
    let whoisUser = req.user.designation ; 
    // console.log(req.user) ;
     
     if(whoisUser === "fac"){
        let notesIds = req.user.notes ;
        let notesArray = [] ;
        for(let i = 0 ; i < notesIds.length ; i++){
            let notes = await notesDB.findOne({_id : notesIds[i]}) ;
            let betterNotes = {
                subject : notes.subject , 
                nameNotes : notes.nameNotes , 
                branch : notes.branch , 
                semester : notes.semester , 
                date : notes.dateProvided , 
            } ;
            if(notes.notesPdf){
                let content = await datauri(`.${notes.notesPdf}`) ;
                betterNotes.pdf = content ;
            }


            notesArray.push(betterNotes) ;
        
        }
        return res.status(200).send({
            data : {
                success : true   , 
                notes : notesArray
            }
        })
    }
    let notesArray = await notesDB.find({
        branch : req.user.branch , 
        semester : req.user.semester 
    })
    let betterNotesArray = [] ;
    for(let i = 0 ; i < notesArray.length ; i++){
        let notes = notesArray[i] ;
        let betterNotes = {
            nameTeacher : notes.nameTeacher , 
            subject : notes.subject , 
            nameNotes : notes.nameNotes , 
            date : notes.dateProvided , 
            _id : notes._id 
        } ;
        if(notes.notesPdf){
            let content = await datauri(`.${notes.notesPdf}`) ;
            betterNotes.pdf = content ;
        }
        betterNotesArray.push(betterNotes) ;
    }
    return res.status(200).send({
        data : {
            success : true   , 
            notes : betterNotesArray
        }
    })
}