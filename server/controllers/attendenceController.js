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
    let month = req.body.month ; 
    for(student of req.body.attendence){
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
        for(let i = 0 ; i < 12 ; i++){
            if(user.monthlyAttendence[i].month === month){
                if(student.value === 'present'){
                    let monthtc = user.monthlyAttendence[i].tc  ; 
                    let monthca = user.monthlyAttendence[i].ca  ;
                    user.monthlyAttendence[i].tc = monthtc + 1 ; 
                    await user.save() ;
                    user.monthlyAttendence[i].ca = monthca +1 ;  
                    await user.save() ;
                    break ; 

               }else{
                    let monthtc = user.monthlyAttendence[i].tc  ; 
                    user.monthlyAttendence[i].tc = monthtc + 1 ; 
                    await user.save() ;
               } 
               break ; 
            }
        }

     }
    return res.json(200 , {
        data : {
            success : true ,
            error : null , 
            message : "Updated" , 
        }
    }) ;
   
}