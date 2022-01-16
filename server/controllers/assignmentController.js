const { findOne } = require('../models/assignment');
var assignmentDB = require('../models/assignment') ;
var userDB = require('../models/user') ;
var mongoose = require('mongoose') ;
const multer = require('multer') ;
const datauri = require('datauri') ;


// multer for configuration of assignment 

const multerConfigAssignment = multer.diskStorage({
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


const isValidAssignmentFile = (req , file , cb) => {
   let ext = file.mimetype.split('/')[1] ;
   if(ext == "pdf" || ext == "jpg" || ext =="png" || ext == "jpeg"){
       cb(null , true) ;
   } 
}

const  uploadAssign = multer({ 
    storage : multerConfigAssignment , 
    fileFilter : isValidAssignmentFile
}) ;

module.exports.uploadAssignment = uploadAssign.fields([
    {
        name : "assignPicture",
        maxCount: 1 
    } , 
    {
        name : "assignPdf",
        maxCount: 1 
    }
]) ;



// controller to create an assignment 
module.exports.makeAssignment = async function(req , res){
    console.log("In MakeAssignment Controller") ;
    //get the teacher name who made this assignment
    let nameTeacher = req.user.name ; 
    let idTeacher = req.user._id ; 

    //fetch all students of that branch and sem for whom this assignment is
    const students = await userDB.find({
        branch : req.body.branch , 
        semester : req.body.semester 
    })
    const student_id_name = [] ;
    for(let i = 0 ; i < students.length ; i++){
        const student = students[i] ;
        let id = student._id.toString() ;
        let name = student.name ; 
        student_id_name.push({id , name}) ;
    }

    // fetching uploaded pdf/picture as assignment from multer
    let pdf = req.files.assignPdf == undefined ? null : `/uploads/${req.files.assignPdf[0].filename}` ; 
    let img = req.files.assignPicture == undefined ? null : `/uploads/${req.files.assignPicture[0].filename}`;

    //enter all student just now fetched to nosubmission of new assignment
    //create new assignment
    let newAssignment = await assignmentDB.create({
        nameTeacher : nameTeacher , 
        subject : req.body.subName, 
        nameAssignment : req.body.assignmentName , 
        branch : req.body.branch , 
        semester : req.body.semester ,  
        lastdate : req.body.date , 
        submission : [] , 
        nosubmission : student_id_name , 
        assignPdf : pdf , 
        assignPicture : img , 
    })
    //enter new assignment id into teacher db
    if(newAssignment)
    {   
        let teacher = await userDB.findOne({_id : idTeacher}) ;
        teacher.assignment.push(newAssignment._id) ;
        teacher.markModified('assignment') ;
        teacher.save() ;
        
        return res.status(200).send({
            data : {
                success : true , 
                message : "Assignment Ban Gaya"
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


//controller to fetch an assignment 
module.exports.fetchAssignment = async function(req , res){
    console.log("Request to fetch Assignment") ;
    let whoisUser = req.user.designation ; 
    // console.log(req.user) ;
     
     if(whoisUser === "fac"){
        let assignmentIds = req.user.assignment ; 
        let assignmentArray = [] ;
        for(let i = 0 ; i < assignmentIds.length ; i++){
            let assignment = await assignmentDB.findOne({_id : assignmentIds[i]}) ;
            let betterAssignment = {
                subject : assignment.subject , 
                nameAssignment : assignment.nameAssignment , 
                branch : assignment.branch , 
                semester : assignment.semester , 
                lastdate : assignment.lastdate , 
                nosubmission : assignment.nosubmission 
            } ;
            if(assignment.assignPdf){
                let content = await datauri(`.${assignment.assignPdf}`) ;
                betterAssignment.pdf = content ;
            }
            if(assignment.assignPicture){
                let content = await datauri(`.${assignment.assignPicture}`) ;
                betterAssignment.img = content ;
            }
            let submission = [] ;
            for(let i = 0 ; i < assignment.submission.length ; i++){
                let pdfContent = await datauri(`.${assignment.submission[i].filename}`) ;
                let submissionObj = {} ;
                submissionObj.name = assignment.submission[i].name ; 
                submissionObj.id = assignment.submission[i].id ; 
                submissionObj.content = pdfContent ; 
                submission.push(submissionObj) ;

            }
            betterAssignment.submission  = submission ;

            assignmentArray.push(betterAssignment) ;
        
        }
        return res.status(200).send({
            data : {
                success : true   , 
                assignment : assignmentArray
            }
        })
    }
    let assignmentArray = await assignmentDB.find({
        branch : req.user.branch , 
        semester : req.user.semester 
    })
    let betterAssignmentArray = [] ;
    for(let i = 0 ; i < assignmentArray.length ; i++){
        let assignment = assignmentArray[i] ;
        console.log(assignment)
        let betterAssignment = {
            nameTeacher : assignment.nameTeacher , 
            subject : assignment.subject , 
            nameAssignment : assignment.nameAssignment , 
            lastdate : assignment.lastdate , 
            _id : assignment._id 
        } ;
        if(assignment.assignPdf){
            let content = await datauri(`.${assignment.assignPdf}`) ;
            betterAssignment.pdf = content ;
        }
        if(assignment.assignPicture){
            let content = await datauri(`.${assignment.assignPicture}`) ;
            betterAssignment.img = content ;
        }
        let submissionIndex = assignment.submission.findIndex(obj => obj.id === req.user._id.toString()) ;
        console.log(submissionIndex) 
       
        if(submissionIndex !== -1){
            betterAssignment.submitted = true ;
        }else{
            betterAssignment.submitted = false ;
        }

        betterAssignmentArray.push(betterAssignment) ;
    }
    return res.status(200).send({
        data : {
            success : true   , 
            assignment : betterAssignmentArray
        }
    })

}

// controller & multer to submit users answer

const multerConfigAssignmentAnswer = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("At destination : " , file) ;
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        console.log("At fileName : " , file) ;
        const ext = file.mimetype.split('/')[1] ;
        const name = file.originalname.split('.')[0] ;
        const fileName = `assignans${name}-${req.user._id}-${Date.now()}.${ext}` ;
        console.log(fileName) ;
        cb(null , fileName) ;
    },
})


const isValidAssignmentAnswerFile = (req , file , cb) => {
   let ext = file.mimetype.split('/')[1] ;
   if(ext == "pdf"){
       cb(null , true) ;
   } 
}

const  uploadAssignAnswer = multer({ 
    storage : multerConfigAssignmentAnswer , 
    fileFilter : isValidAssignmentAnswerFile
}) ;

module.exports.uploadAssignmentAnswer = uploadAssignAnswer.fields([
    {
        name : "assignmentAns",
        maxCount: 1 
    } , 
]) ;

module.exports.submitAssignmentAnswer = async function(req , res){
    console.log("Submitting Answer to Assignment") ;
    //decide the name of answer pdf -> done 

    //assigmen k db m submission m naam , id , answer ka address dalo -> done 
    let assignmentId = req.body.assignmentId ; 
    var assignment = await assignmentDB.findOne({_id : assignmentId}) ;
    let submissionObject = {
        name : req.user.name , 
        id : req.user._id.toString() , 
        filename : `/uploads/${req.files.assignmentAns[0].filename}`
    }
   
    assignment.submission.push(submissionObject) ;
    assignment.markModified('submission') ;
    await assignment.save() ;




    //no submisson se delete krdo id -> done  
    let studentId = req.user._id.toString() ;
    let indexOfNoSubmission = assignment.nosubmission.findIndex(obj => obj.id === studentId) ;
    assignment.nosubmission.splice(indexOfNoSubmission,1) ;
    assignment.markModified('nosubmission') ;
    await assignment.save() ;

    //fetch answer samay bachhe k array m submitted not submitted ki detail do
    return res.status(200).send({
        data : {
            success : true , 
            message : "Assignment Submitted"
        }
    })

}
