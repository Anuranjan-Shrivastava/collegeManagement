const usersDB = require('../models/user') ;

module.exports.getStudentList = async function(req,res){
    console.log("Req List for Student") ;
    console.log(req.body) ;
    let students = await usersDB.find(
        { 
            semester : req.body.semester , 
            branch : req.body.branch 
        }) ;
    console.log(students) ;
    return res.json(200 , {
        data : {
            success : true ,
            error : null , 
            message : "Will send" , 
            studentList : students
        }
    }) ;
}

module.exports.updateStudent = async  function(req , res){
    console.log("Update Req Rec") ;
    console.log(req.body) ;
    for(student of req.body){
        let id = student.id ; 
        let user = await usersDB.findById({ _id : id}) ;
        let tc = user.totalClasses ; 
        let ca = user.classesAttended ;
        if(student.value === 'present'){
             user.totalClasses = tc+1 ; 
             user.classesAttended = ca +1 ; 
        }else{
            user.totalClasses = tc+1 ; 
        }
        await user.save() ;

    }
    return res.json(200 , {
        data : {
            success : true ,
            error : null , 
            message : "Updated" , 
        }
    }) ;
}