const userdb = require('../../models/user') ;
const dailydb = require('../../models/dailything') ;
const attendencedb = require('../../models/attendence') ;
const attendence = require('../../models/attendence');

module.exports.getStudentList = async (req , res) => {
    console.log("Req List for Student") ;
    //console.log(req.body) ;

    //fetching totalClasses using teacher data base 
    //console.log(req.user) ;
    let teacherAttendenceId = req.user.attendence ; 
    let attendencedb_of_teacher = await attendencedb.findOne({_id : teacherAttendenceId}) ;
    let indexOfSemester = attendencedb_of_teacher.semester.findIndex((obj) => {
        if(obj.sem === req.body.semester && obj.branch === req.body.branch)return true ; 
        return false ; 
    })
    let totalClasses ;
    if(indexOfSemester === -1){
        totalClasses = 0 ; 
    }else{
        totalClasses = attendencedb_of_teacher.semester[indexOfSemester].classes ;
    }
    let students = await userdb.find(
        { 
            semester : req.body.semester , 
            branch : req.body.branch 
        }) ;
    let studentList = [] ;
    for(const student of students){
        let newStudent = {} ;
        newStudent.rollNo = student.rollno ; 
        newStudent.name = student.name ; 
        newStudent.id = student.attendence ; 
        //total num of classes this teacher has taken in this semester
        let attendencedb_of_student = await attendencedb.findOne({_id : student.attendence}) ;
        let indexOfTeacher = attendencedb_of_student.teachers.findIndex((obj) => {
            if(obj.teacherId.toString() === req.user._id.toString()){
                return true ;
            } else{
                return false ;
            }
         }) ; 
        if(indexOfTeacher === -1){
            newStudent.attendence = 0 ; 
        }else{
            newStudent.attendence = attendencedb_of_student.numClasses[indexOfTeacher] ;
        }
        console.log(indexOfTeacher) ;
        console.log(newStudent) ;
        studentList.push(newStudent) ;
    }
    return res.json(200 , {
        data : {
            success : true ,
            error : null , 
            message : "Will send" , 
            studentList : studentList , 
            totalClasses : totalClasses
        }
    }) ;
}


module.exports.update = async (req, res) => {
     console.log("Student Attendence List") ;
     console.log(req.body);
    
     let {attendenceList , date , month , semester , branch} = req.body ;  
     for(let i = 0 ; i < req.body.attendenceList.length ; i++){
         let attendencedb_of_student = await attendencedb.findOne({_id : attendenceList[i].id}) ;
         let indexOfTeacherInStudentDb = attendencedb_of_student.teachers.findIndex((obj) => {
            if(obj.teacherId.toString() === req.user._id.toString()){
                return true ;
            } else{
                return false ;
            }
         }) ; 
         if(indexOfTeacherInStudentDb === -1){
            attendencedb_of_student.teachers.push({teacherId : req.user._id , name : req.user.name}) ;
            if(attendenceList[i].value == 1){
                attendencedb_of_student.numClasses.push(1); 
            }else{
                attendencedb_of_student.numClasses.push(0); 
            }
         }
         else{
            if(attendenceList[i].value == 1){
                attendencedb_of_student.numClasses[indexOfTeacherInStudentDb] = attendencedb_of_student.numClasses[indexOfTeacherInStudentDb] + 1; 
            }
         }
         await attendencedb_of_student.save() ;

         if(month === 'january'){
              if(attendencedb_of_student.january.length === date){
                     let thisDayRecordId = attendencedb_of_student.january[date] ;
                     let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
                     thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
                     if(attendenceList[i].value === 1){
                         thisDayRecord.classesAttended = thisDayRecord.classesAttended +1
                         thisDayRecord.classesTaken.push(1) ;
                     }else{
                         thisDayRecord.classesTaken.push(0) ;
                     }
                     thisDayRecord.classesBy.push({id : req.user._id , name : req.user.name }) ;
                     await thisDayRecord.save() ;

              }else{
                    let thisDayRecord = await dailydb.create({
                        date : Date.now() , 
                        totalClasses : 1 ,
                        classesAttended : attendenceList[i].value === 1 ? 1 : 0 ,
                        classesBy : [{id : req.user._id , name : req.user.name }] ,
                        classesTaken : attendenceList[i].value === 1 ? [1] : [0] ,  
                        }) ;
                        while(attendencedb_of_student.january.length < date - 1){
                            attendencedb_of_student.january.push(null) ;
                        } 
                    attendencedb_of_student.january.push(thisDayRecord._id) ;
                    await attendencedb_of_student.save() ;
                    

              }
              attendencedb_of_student.totalClasses = attendencedb_of_student.totalClasses + 1 ;
              attendencedb_of_student.tcjanuary = attendencedb_of_student.tcjanuary + 1  ;
              if(attendenceList[i].value == 1){
                  attendencedb_of_student.classesAttended = attendencedb_of_student.classesAttended + 1 ;
                  attendencedb_of_student.cajanuary = attendencedb_of_student.cajanuary + 1 ; 
              }  
              await attendencedb_of_student.save() ;  
         }else if(month === 'february'){
                if(attendencedb_of_student.february.length === date){
                    let thisDayRecordId = attendencedb_of_student.february[date] ;
                    let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
                    thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
                    if(attendenceList[i].value === 1){
                        thisDayRecord.classesAttended = thisDayRecord.classesAttended +1
                        thisDayRecord.classesTaken.push(1) ;
                    }else{
                        thisDayRecord.classesTaken.push(0) ;
                    }
                    thisDayRecord.classesBy.push({id : req.user._id , name : req.user.name }) ;
                    await thisDayRecord.save() ;

                }else{
                    let thisDayRecord = await dailydb.create({
                    date : Date.now() , 
                    totalClasses : 1 ,
                    classesAttended : attendenceList[i].value === 1 ? 1 : 0 ,
                    classesBy : [{id : req.user._id , name : req.user.name }] ,
                    classesTaken : attendenceList[i].value === 1 ? [1] : [0] ,  
                    }) ; 
                    while(attendencedb_of_student.february.length < date - 1){
                        attendencedb_of_student.february.push(null) ;
                    }
                    attendencedb_of_student.february.push(thisDayRecord._id) ;
                    await attendencedb_of_student.save() ;
                }
                attendencedb_of_student.totalClasses = attendencedb_of_student.totalClasses + 1 ;
            attendencedb_of_student.tcfebruary = attendencedb_of_student.tcfebruary + 1  ;
            if(attendenceList[i].value == 1){
                attendencedb_of_student.classesAttended = attendencedb_of_student.classesAttended + 1 ;
                attendencedb_of_student.cafebruary = attendencedb_of_student.cafebruary + 1 ; 
            }     
            await attendencedb_of_student.save() ;  
         }else if(month === 'march'){
                if(attendencedb_of_student.march.length === date){
                    let thisDayRecordId = attendencedb_of_student.march[date] ;
                    let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
                    thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
                    if(attendenceList[i].value === 1){
                        thisDayRecord.classesAttended = thisDayRecord.classesAttended +1
                        thisDayRecord.classesTaken.push(1) ;
                    }else{
                        thisDayRecord.classesTaken.push(0) ;
                    }
                    thisDayRecord.classesBy.push({id : req.user._id , name : req.user.name }) ;
                    await thisDayRecord.save() ;

                }else{
                    let thisDayRecord = await dailydb.create({
                    date : Date.now() , 
                    totalClasses : 1  ,
                    classesAttended : attendenceList[i].value === 1 ? 1 : 0 ,
                    classesBy : [{id : req.user._id , name : req.user.name }] ,
                    classesTaken : attendenceList[i].value === 1 ? [1] : [0] ,  
                    }) ; 
                    while(attendencedb_of_student.march.length < date - 1){
                        attendencedb_of_student.march.push(null) ;
                    }
                    attendencedb_of_student.march.push(thisDayRecord._id) ;
                    await attendencedb_of_student.save() ;
                }  
                attendencedb_of_student.totalClasses = attendencedb_of_student.totalClasses + 1 ;
            attendencedb_of_student.tcmarch = attendencedb_of_student.tcmarch + 1  ;
            if(attendenceList[i].value == 1){
                attendencedb_of_student.classesAttended = attendencedb_of_student.classesAttended + 1 ;
                attendencedb_of_student.camarch = attendencedb_of_student.camarch + 1 ; 
            }       
            await attendencedb_of_student.save() ;             
         }else if(month === 'april'){
            if(attendencedb_of_student.april.length === date){
                let thisDayRecordId = attendencedb_of_student.april[date] ;
                let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
                thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
                if(attendenceList[i].value === 1){
                    thisDayRecord.classesAttended = thisDayRecord.classesAttended +1
                    thisDayRecord.classesTaken.push(1) ;
                }else{
                    thisDayRecord.classesTaken.push(0) ;
                }
                thisDayRecord.classesBy.push({id : req.user._id , name : req.user.name }) ;
                await thisDayRecord.save() ;

            }else{
                let thisDayRecord = await dailydb.create({
                date : Date.now() , 
                totalClasses : 1  ,
                classesAttended : attendenceList[i].value === 1 ? 1 : 0 ,
                classesBy : [{id : req.user._id , name : req.user.name }] ,
                classesTaken : attendenceList[i].value === 1 ? [1] : [0] ,  
                }) ; 
                while(attendencedb_of_student.april.length < date - 1){
                    attendencedb_of_student.april.push(null) ;
                }
                attendencedb_of_student.april.push(thisDayRecord._id) ;
                await attendencedb_of_student.save() ;
            }  
            attendencedb_of_student.totalClasses = attendencedb_of_student.totalClasses + 1 ;
            attendencedb_of_student.tcapril = attendencedb_of_student.tcapril + 1  ;
            if(attendenceList[i].value == 1){
                attendencedb_of_student.classesAttended = attendencedb_of_student.classesAttended + 1 ;
                attendencedb_of_student.caapril = attendencedb_of_student.caapril + 1 ; 
            }      
            await attendencedb_of_student.save() ;                          
         }else if(month === 'may'){
            if(attendencedb_of_student.may.length === date){
                let thisDayRecordId = attendencedb_of_student.may[date-1] ;
                let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
                thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
                if(attendenceList[i].value === 1){
                    thisDayRecord.classesAttended = thisDayRecord.classesAttended +1
                    thisDayRecord.classesTaken.push(1) ;
                }else{
                    thisDayRecord.classesTaken.push(0) ;
                }
                thisDayRecord.classesBy.push({id : req.user._id , name : req.user.name }) ;
                await thisDayRecord.save() ;

            }else{
                let thisDayRecord = await dailydb.create({
                date : Date.now() , 
                totalClasses : 1  ,
                classesAttended : attendenceList[i].value === 1 ? 1 : 0 ,
                classesBy : [{id : req.user._id , name : req.user.name }] ,
                classesTaken : attendenceList[i].value === 1 ? [1] : [0] ,  
                }) ; 
                while(attendencedb_of_student.may.length < date - 1){
                     attendencedb_of_student.may.push(null) ;
                }
                attendencedb_of_student.may.push(thisDayRecord._id) ;      
                await attendencedb_of_student.save() ;
            }  
            
            attendencedb_of_student.totalClasses = attendencedb_of_student.totalClasses + 1 ;
            attendencedb_of_student.tcmay = attendencedb_of_student.tcmay + 1  ;
        
            if(attendenceList[i].value == 1){
                attendencedb_of_student.classesAttended = attendencedb_of_student.classesAttended + 1 ;
                attendencedb_of_student.camay = attendencedb_of_student.camay + 1 ; 
            } 
            await attendencedb_of_student.save() ;             
         }else if(month === 'june'){
            if(attendencedb_of_student.june.length === date){
                let thisDayRecordId = attendencedb_of_student.june[date] ;
                let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
                thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
                if(attendenceList[i].value === 1){
                    thisDayRecord.classesAttended = thisDayRecord.classesAttended +1
                    thisDayRecord.classesTaken.push(1) ;
                }else{
                    thisDayRecord.classesTaken.push(0) ;
                }
                thisDayRecord.classesBy.push({id : req.user._id , name : req.user.name }) ;
                await thisDayRecord.save() ;

            }else{
                let thisDayRecord = await dailydb.create({
                date : Date.now() , 
                totalClasses : 1  ,
                classesAttended : attendenceList[i].value === 1 ? 1 : 0 ,
                classesBy : [{id : req.user._id , name : req.user.name }] ,
                classesTaken : attendenceList[i].value === 1 ? [1] : [0] ,  
                }) ; 
                while(attendencedb_of_student.june.length < date - 1){
                    attendencedb_of_student.june.push(null) ;
                }
                attendencedb_of_student.june.push(thisDayRecord._id) ;
                await attendencedb_of_student.save() ;
            } 
            attendencedb_of_student.totalClasses = attendencedb_of_student.totalClasses + 1 ;
            attendencedb_of_student.tcjune = attendencedb_of_student.tcjune + 1  ;
            if(attendenceList[i].value == 1){
                attendencedb_of_student.classesAttended = attendencedb_of_student.classesAttended + 1 ;
                attendencedb_of_student.cajune = attendencedb_of_student.cajune + 1 ; 
            }   
            await attendencedb_of_student.save() ;                              
         }else if(month === 'july'){
            if(attendencedb_of_student.july.length === date){
                let thisDayRecordId = attendencedb_of_student.july[date] ;
                let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
                thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
                if(attendenceList[i].value === 1){
                    thisDayRecord.classesAttended = thisDayRecord.classesAttended +1
                    thisDayRecord.classesTaken.push(1) ;
                }else{
                    thisDayRecord.classesTaken.push(0) ;
                }
                thisDayRecord.classesBy.push({id : req.user._id , name : req.user.name }) ;
                await thisDayRecord.save() ;

            }else{
                let thisDayRecord = await dailydb.create({
                date : Date.now() , 
                totalClasses : 1  ,
                classesAttended : attendenceList[i].value === 1 ? 1 : 0 ,
                classesBy : [{id : req.user._id , name : req.user.name }] ,
                classesTaken : attendenceList[i].value === 1 ? [1] : [0] ,  
                }) ; 
                while(attendencedb_of_student.july.length < date - 1){
                    attendencedb_of_student.july.push(null) ;
                }
                attendencedb_of_student.july.push(thisDayRecord._id) ;
                await attendencedb_of_student.save() ;
            } 
            attendencedb_of_student.totalClasses = attendencedb_of_student.totalClasses + 1 ;
            attendencedb_of_student.tcjuly = attendencedb_of_student.tcjuly + 1  ;
            if(attendenceList[i].value == 1){
                attendencedb_of_student.classesAttended = attendencedb_of_student.classesAttended + 1 ;
                attendencedb_of_student.cajuly = attendencedb_of_student.cajuly + 1 ; 
            }  
            await attendencedb_of_student.save() ;                   
         }else if(month === 'august'){
            if(attendencedb_of_student.august.length === date){
                let thisDayRecordId = attendencedb_of_student.august[date] ;
                let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
                thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
                if(attendenceList[i].value === 1){
                    thisDayRecord.classesAttended = thisDayRecord.classesAttended +1
                    thisDayRecord.classesTaken.push(1) ;
                }else{
                    thisDayRecord.classesTaken.push(0) ;
                }
                thisDayRecord.classesBy.push({id : req.user._id , name : req.user.name }) ;
                await thisDayRecord.save() ;

            }else{
                let thisDayRecord = await dailydb.create({
                date : Date.now() , 
                totalClasses : 1  ,
                classesAttended : attendenceList[i].value === 1 ? 1 : 0 ,
                classesBy : [{id : req.user._id , name : req.user.name }] ,
                classesTaken : attendenceList[i].value === 1 ? [1] : [0] ,  
                }) ; 
                while(attendencedb_of_student.august.length < date - 1){
                    attendencedb_of_student.august.push(null) ;
                }
                attendencedb_of_student.august.push(thisDayRecord._id) ;
                await attendencedb_of_student.save() ;
            }   
            attendencedb_of_student.totalClasses = attendencedb_of_student.totalClasses + 1 ;
            attendencedb_of_student.tcaugust = attendencedb_of_student.tcaugust + 1  ;
            if(attendenceList[i].value == 1){
                attendencedb_of_student.classesAttended = attendencedb_of_student.classesAttended + 1 ;
                attendencedb_of_student.caaugust = attendencedb_of_student.caaugust + 1 ; 
            } 
            await attendencedb_of_student.save() ;                             
         }else if(month === 'september'){
            if(attendencedb_of_student.september.length === date){
                let thisDayRecordId = attendencedb_of_student.september[date] ;
                let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
                thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
                if(attendenceList[i].value === 1){
                    thisDayRecord.classesAttended = thisDayRecord.classesAttended +1
                    thisDayRecord.classesTaken.push(1) ;
                }else{
                    thisDayRecord.classesTaken.push(0) ;
                }
                thisDayRecord.classesBy.push({id : req.user._id , name : req.user.name }) ;
                await thisDayRecord.save() ;

            }else{
                let thisDayRecord = await dailydb.create({
                date : Date.now() , 
                totalClasses : 1  ,
                classesAttended : attendenceList[i].value === 1 ? 1 : 0 ,
                classesBy : [{id : req.user._id , name : req.user.name }] ,
                classesTaken : attendenceList[i].value === 1 ? [1] : [0] ,  
                }) ; 
                while(attendencedb_of_student.september.length < date - 1){
                    attendencedb_of_student.september.push(null) ;
                }
                attendencedb_of_student.september.push(thisDayRecord._id) ;
                await attendencedb_of_student.save() ;
            }   
            attendencedb_of_student.totalClasses = attendencedb_of_student.totalClasses + 1 ;
            attendencedb_of_student.tcseptember = attendencedb_of_student.tcseptember + 1  ;
            if(attendenceList[i].value == 1){
                attendencedb_of_student.classesAttended = attendencedb_of_student.classesAttended + 1 ;
                attendencedb_of_student.caseptember = attendencedb_of_student.caseptember + 1 ; 
            } 
            await attendencedb_of_student.save() ;                  
         }else if(month === 'october'){
            if(attendencedb_of_student.october.length === date){
                let thisDayRecordId = attendencedb_of_student.october[date] ;
                let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
                thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
                if(attendenceList[i].value === 1){
                    thisDayRecord.classesAttended = thisDayRecord.classesAttended +1
                    thisDayRecord.classesTaken.push(1) ;
                }else{
                    thisDayRecord.classesTaken.push(0) ;
                }
                thisDayRecord.classesBy.push({id : req.user._id , name : req.user.name }) ;
                await thisDayRecord.save() ;

            }else{
                let thisDayRecord = await dailydb.create({
                date : Date.now() , 
                totalClasses : 1  ,
                classesAttended : attendenceList[i].value === 1 ? 1 : 0 ,
                classesBy : [{id : req.user._id , name : req.user.name }] ,
                classesTaken : attendenceList[i].value === 1 ? [1] : [0] ,  
                }) ; 
                while(attendencedb_of_student.october.length < date - 1){
                    attendencedb_of_student.october.push(null) ;
                }
                attendencedb_of_student.october.push(thisDayRecord._id) ;
                await attendencedb_of_student.save() ;
            }     
            attendencedb_of_student.totalClasses = attendencedb_of_student.totalClasses + 1 ;
            attendencedb_of_student.tcoctober = attendencedb_of_student.tcoctober + 1  ;
            if(attendenceList[i].value == 1){
                attendencedb_of_student.classesAttended = attendencedb_of_student.classesAttended + 1 ;
                attendencedb_of_student.caoctober = attendencedb_of_student.caoctober + 1 ; 
            }   
            await attendencedb_of_student.save() ;                         
         }else if(month === 'november'){
            if(attendencedb_of_student.november.length === date){
                let thisDayRecordId = attendencedb_of_student.november[date] ;
                let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
                thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
                if(attendenceList[i].value === 1){
                    thisDayRecord.classesAttended = thisDayRecord.classesAttended +1
                    thisDayRecord.classesTaken.push(1) ;
                }else{
                    thisDayRecord.classesTaken.push(0) ;
                }
                thisDayRecord.classesBy.push({id : req.user._id , name : req.user.name }) ;
                await thisDayRecord.save() ;

            }else{
                let thisDayRecord = await dailydb.create({
                date : Date.now() , 
                totalClasses : 1  ,
                classesAttended : attendenceList[i].value === 1 ? 1 : 0 ,
                classesBy : [{id : req.user._id , name : req.user.name }] ,
                classesTaken : attendenceList[i].value === 1 ? [1] : [0] ,  
                }) ; 
                while(attendencedb_of_student.november.length < date - 1){
                    attendencedb_of_student.november.push(null) ;
                }
                attendencedb_of_student.november.push(thisDayRecord._id) ;
                await attendencedb_of_student.save() ;
            }     
            attendencedb_of_student.totalClasses = attendencedb_of_student.totalClasses + 1 ;
            attendencedb_of_student.tcnovember = attendencedb_of_student.tcnovember + 1  ;
            if(attendenceList[i].value == 1){
                attendencedb_of_student.classesAttended = attendencedb_of_student.classesAttended + 1 ;
                attendencedb_of_student.canovember = attendencedb_of_student.canovember + 1 ; 
            }    
            await attendencedb_of_student.save() ;             
         }else if(month === 'december'){
            if(attendencedb_of_student.december.length === date){
                let thisDayRecordId = attendencedb_of_student.december[date] ;
                let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
                thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
                if(attendenceList[i].value === 1){
                    thisDayRecord.classesAttended = thisDayRecord.classesAttended +1
                    thisDayRecord.classesTaken.push(1) ;
                }else{
                    thisDayRecord.classesTaken.push(0) ;
                }
                thisDayRecord.classesBy.push({id : req.user._id , name : req.user.name }) ;
                await thisDayRecord.save() ;

            }else{
                let thisDayRecord = await dailydb.create({
                date : Date.now() , 
                totalClasses : 1  ,
                classesAttended : attendenceList[i].value === 1 ? 1 : 0 ,
                classesBy : [{id : req.user._id , name : req.user.name }] ,
                classesTaken : attendenceList[i].value === 1 ? [1] : [0] ,  
                }) ; 
                while(attendencedb_of_student.december.length < date - 1){
                    attendencedb_of_student.december.push(null) ;
                }
                attendencedb_of_student.december.push(thisDayRecord._id) ;
                await attendencedb_of_student.save() ;
            } 
            attendencedb_of_student.totalClasses = attendencedb_of_student.totalClasses + 1 ;
            attendencedb_of_student.tcdecember = attendencedb_of_student.tcdecember + 1  ;
            if(attendenceList[i].value == 1){
                attendencedb_of_student.classesAttended = attendencedb_of_student.classesAttended + 1 ;
                attendencedb_of_student.cadecember = attendencedb_of_student.cadecember + 1 ; 
            }       
            await attendencedb_of_student.save() ;                         
         }
     }

     //teacher section start
     let teacherAttendenceId = req.user.attendence ; 
     let attendencedb_of_teacher = await attendencedb.findOne({_id : teacherAttendenceId}) ;
     let indexOfSemester = attendencedb_of_teacher.semester.findIndex((obj) => {
          if(obj.sem === semester && obj.branch === branch)return true ;
          return false ; 
     }) ; 
     console.log("Teacher Section :- " , indexOfSemester) ;
     if(indexOfSemester === -1){
        attendencedb_of_teacher.semester.push({
            sem : semester  , 
            branch : branch , 
            classes : 1 
        }) ;
     }else{
         console.log(attendencedb_of_teacher.semester[indexOfSemester]) ;
         let cls = attendencedb_of_teacher.semester[indexOfSemester].classes ;
         console.log(cls) ;
         attendencedb_of_teacher.semester[indexOfSemester].classes = cls + 1 ; 
         attendencedb_of_teacher.markModified("semester")
         await attendencedb_of_teacher.save() ;
     }
     await attendencedb_of_teacher.save() ;
     if(month === 'january'){
        if(attendencedb_of_teacher.january.length === date){
               let thisDayRecordId = attendencedb_of_teacher.january[date-1] ;
               let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
               thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
               thisDayRecord.classesIn.push({sem : semester , branch : branch}) ;
               await thisDayRecord.save() ;
        }else{
              let thisDayRecord = await dailydb.create({
                  date : Date.now() , 
                  totalClasses : 1 ,
                  classesIn : [{sem : semester , branch : branch}]  
              }) ; 
              while(attendencedb_of_teacher.january.length < date - 1){
                attendencedb_of_teacher.january.push(null) ;
              }
             attendencedb_of_teacher.january.push(thisDayRecord._id) ;
             await attendencedb_of_teacher.save() ;
        }
        attendencedb_of_teacher.totalClasses = attendencedb_of_teacher.totalClasses + 1 ;
        attendencedb_of_teacher.tcjanuary = attendencedb_of_teacher.tcjanuary + 1 ;
        await attendencedb_of_teacher.save() ;

     }else if(month === 'february'){
          if(attendencedb_of_teacher.february.length === date){
              let thisDayRecordId = attendencedb_of_teacher.february[date-1] ;
              let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
              thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
              thisDayRecord.classesIn.push({sem : semester , branch : branch}) ;
              await thisDayRecord.save() ;

          }else{
              let thisDayRecord = await dailydb.create({
              date : date , 
              totalClasses : 1 ,
              classesIn : [{sem : semester , branch : branch}]
               }) ; 
               while(attendencedb_of_teacher.february.length < date - 1){
                attendencedb_of_teacher.february.push(null) ;
              }
              attendencedb_of_teacher.february.push(thisDayRecord._id) ;
              await attendencedb_of_teacher.save() ;
          }
          attendencedb_of_teacher.totalClasses = attendencedb_of_teacher.totalClasses + 1 ;
          attendencedb_of_teacher.tcfebruary = attendencedb_of_teacher.tcfebruary + 1 ;
          await attendencedb_of_teacher.save() ;
     }else if(month === 'march'){
          if(attendencedb_of_teacher.march.length === date){
              let thisDayRecordId = attendencedb_of_teacher.march[date-1] ;
              let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
              thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
              thisDayRecord.classesIn.push({sem : semester , branch : branch}) ;
              await thisDayRecord.save() ;

          }else{
              let thisDayRecord = await dailydb.create({
              date : date , 
              totalClasses : 1 ,
              classesIn : [{sem : semester , branch : branch}]
              }) ; 
              while(attendencedb_of_teacher.march.length < date - 1){
                attendencedb_of_teacher.march.push(null) ;
              }
              attendencedb_of_teacher.march.push(thisDayRecord._id) ;
              await attendencedb_of_teacher.save() ;
            } 
            attendencedb_of_teacher.totalClasses = attendencedb_of_teacher.totalClasses + 1 ;
            attendencedb_of_teacher.tcmarch = attendencedb_of_teacher.tcmarch + 1 ;
            await attendencedb_of_teacher.save() ;              
     }else if(month === 'april'){
      if(attendencedb_of_teacher.april.length === date){
          let thisDayRecordId = attendencedb_of_teacher.april[date-1] ;
          let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
          thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
          thisDayRecord.classesIn.push({sem : semester , branch : branch}) ;
          await thisDayRecord.save() ;

      }else{
          let thisDayRecord = await dailydb.create({
          date : date , 
          totalClasses : 1 ,
          classesIn : [{sem : semester , branch : branch}]
          }) ; 
          while(attendencedb_of_teacher.april.length < date - 1){
            attendencedb_of_teacher.april.push(null) ;
          }
          attendencedb_of_teacher.april.push(thisDayRecord._id) ;
          await attendencedb_of_teacher.save() ;
         }  
         attendencedb_of_teacher.totalClasses = attendencedb_of_teacher.totalClasses + 1 ;
         attendencedb_of_teacher.tcapril = attendencedb_of_teacher.tcapril + 1 ;
         await attendencedb_of_teacher.save() ;                         
     }else if(month === 'may'){
        console.log("This is may") ; 
        if(attendencedb_of_teacher.may.length === date){
            let thisDayRecordId = attendencedb_of_teacher.may[date-1] ;
            let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
            thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
            thisDayRecord.classesIn.push({sem : semester , branch : branch}) ;
            await thisDayRecord.save() ;

        }else{
            let thisDayRecord = await dailydb.create({
            date : date , 
            totalClasses : 1 ,
            classesIn : [{sem : semester , branch : branch}]
            }) ; 
            while(attendencedb_of_teacher.may.length < date - 1){
                attendencedb_of_teacher.may.push(null) ;
            }
            attendencedb_of_teacher.may.push(thisDayRecord._id) ;
            await attendencedb_of_teacher.save() ;
        }  
            attendencedb_of_teacher.totalClasses = attendencedb_of_teacher.totalClasses + 1 ;
            attendencedb_of_teacher.tcmay = attendencedb_of_teacher.tcmay + 1 ; 
            await attendencedb_of_teacher.save() ;             
     }else if(month === 'june'){
      if(attendencedb_of_teacher.june.length === date){
          let thisDayRecordId = attendencedb_of_teacher.june[date-1] ;
          let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
          thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
          thisDayRecord.classesIn.push({sem : semester , branch : branch}) ;
          await thisDayRecord.save() ;

      }else{
          let thisDayRecord = await dailydb.create({
          date : date , 
          totalClasses : 1 ,
          classesIn :[{sem : semester , branch : branch}]
          }) ; 
          while(attendencedb_of_teacher.june.length < date - 1){
            attendencedb_of_teacher.june.push(null) ;
          }
          attendencedb_of_teacher.june.push(thisDayRecord._id) ;
          await attendencedb_of_teacher.save() ;
         }    
         attendencedb_of_teacher.totalClasses = attendencedb_of_teacher.totalClasses + 1 ;
         attendencedb_of_teacher.tcjune = attendencedb_of_teacher.tcjune + 1 ;
         await attendencedb_of_teacher.save() ;                       
     }else if(month === 'july'){
      if(attendencedb_of_teacher.july.length === date){
          let thisDayRecordId = attendencedb_of_teacher.july[date-1] ;
          let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
          thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
          thisDayRecord.classesIn.push({sem : semester , branch : branch}) ;
          await thisDayRecord.save() ;

      }else{
          let thisDayRecord = await dailydb.create({
          date : date , 
          totalClasses : 1 ,
          classesIn : [{sem : semester , branch : branch}]
          }) ; 
          while(attendencedb_of_teacher.july.length < date - 1){
            attendencedb_of_teacher.july.push(null) ;
          }
          attendencedb_of_teacher.july.push(thisDayRecord._id) ;
          await attendencedb_of_teacher.save() ;
         }  
         attendencedb_of_teacher.totalClasses = attendencedb_of_teacher.totalClasses + 1 ;
         attendencedb_of_teacher.tcjuly = attendencedb_of_teacher.tcjuly + 1 ;
         await attendencedb_of_teacher.save() ;             
     }else if(month === 'august'){
      if(attendencedb_of_teacher.august.length === date){
          let thisDayRecordId = attendencedb_of_teacher.august[date-1] ;
          let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
          thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
          thisDayRecord.classesIn.push({sem : semester , branch : branch}) ;
          await thisDayRecord.save() ;

      }else{
          let thisDayRecord = await dailydb.create({
          date : date , 
          totalClasses : 1 ,
          classesIn : [{sem : semester , branch : branch}]
           }) ; 
           while(attendencedb_of_teacher.august.length < date - 1){
            attendencedb_of_teacher.august.push(null) ;
          }
          attendencedb_of_teacher.august.push(thisDayRecord._id) ;
          await attendencedb_of_teacher.save() ;
         } 
         attendencedb_of_teacher.totalClasses = attendencedb_of_teacher.totalClasses + 1 ;
         attendencedb_of_teacher.tcaugust = attendencedb_of_teacher.tcaugust + 1 ;
         await attendencedb_of_teacher.save() ;                         
     }else if(month === 'september'){
      if(attendencedb_of_teacher.september.length === date){
          let thisDayRecordId = attendencedb_of_teacher.september[date-1] ;
          let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
          thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
          thisDayRecord.classesIn.push({sem : semester , branch : branch}) ;
          await thisDayRecord.save() ;

      }else{
          let thisDayRecord = await dailydb.create({
          date : date , 
          totalClasses : 1 ,
          classesIn :[{sem : semester , branch : branch}] 
          }) ; 
          while(attendencedb_of_teacher.september.length < date - 1){
            attendencedb_of_teacher.september.push(null) ;
          }
          attendencedb_of_teacher.september.push(thisDayRecord._id) ;
          await attendencedb_of_teacher.save() ;
        }  
        attendencedb_of_teacher.totalClasses = attendencedb_of_teacher.totalClasses + 1 ;
        attendencedb_of_teacher.tcseptember = attendencedb_of_teacher.tcseptember + 1 ;
        await attendencedb_of_teacher.save() ;             
     }else if(month === 'october'){
      if(attendencedb_of_teacher.october.length === date){
          let thisDayRecordId = attendencedb_of_teacher.october[date-1] ;
          let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
          thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
          thisDayRecord.classesIn.push({sem : semester , branch : branch}) ;
          await thisDayRecord.save() ;

      }else{
          let thisDayRecord = await dailydb.create({
          date : date , 
          totalClasses : 1 ,
          classesIn : [{sem : semester , branch : branch}]   
          }) ; 
          while(attendencedb_of_teacher.october.length < date - 1){
            attendencedb_of_teacher.october.push(null) ;
          }
          attendencedb_of_teacher.october.push(thisDayRecord._id) ;
          await attendencedb_of_teacher.save() ;
         }  
         attendencedb_of_teacher.totalClasses = attendencedb_of_teacher.totalClasses + 1 ;
         attendencedb_of_teacher.tcoctober = attendencedb_of_teacher.tcoctober + 1 ;
         await attendencedb_of_teacher.save() ;                        
     }else if(month === 'november'){
      if(attendencedb_of_teacher.november.length === date){
          let thisDayRecordId = attendencedb_of_teacher.november[date-1] ;
          let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
          thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
          thisDayRecord.classesIn.push({sem : semester , branch : branch}) ;
          await thisDayRecord.save() ;

      }else{
          let thisDayRecord = await dailydb.create({
          date : date , 
          totalClasses : 1 ,
          classesIn :[{sem : semester , branch : branch}]  
          }) ; 
          while(attendencedb_of_teacher.november.length < date - 1){
            attendencedb_of_teacher.november.push(null) ;
          }
          attendencedb_of_teacher.november.push(thisDayRecord._id) ;
          await attendencedb_of_teacher.save() ;
        }  
        attendencedb_of_teacher.totalClasses = attendencedb_of_teacher.totalClasses + 1 ;
        attendencedb_of_teacher.tcnovember = attendencedb_of_teacher.tcnovember + 1 ;
        await attendencedb_of_teacher.save() ;             
     }else if(month === 'december'){
      if(attendencedb_of_teacher.december.length === date){
          let thisDayRecordId = attendencedb_of_teacher.december[date-1] ;
          let thisDayRecord = await dailydb.findOne({_id : thisDayRecordId}) ;
          thisDayRecord.totalClasses = thisDayRecord.totalClasses + 1 ; 
          thisDayRecord.classesIn.push({sem : semester , branch : branch}) ;
          await thisDayRecord.save() ;

      }else{
          let thisDayRecord = await dailydb.create({
          date : date , 
          totalClasses : 1 ,
          classesIn : [{sem : semester , branch : branch}]
          }) ; 
          while(attendencedb_of_teacher.december.length < date - 1){
            attendencedb_of_teacher.december.push(null) ;
          }
          attendencedb_of_teacher.december.push(thisDayRecord._id) ;
          await attendencedb_of_teacher.save() ;
        }  
        attendencedb_of_teacher.totalClasses = attendencedb_of_teacher.totalClasses + 1 ;
        attendencedb_of_teacher.tcdecember = attendencedb_of_teacher.tcdecember + 1 ; 
        await attendencedb_of_teacher.save() ;                        
     }
     

     return res.json(200 , {
        data : {
            success : true ,
            error : null , 
            message : "Will update" , 
        }
    }) ;
}

module.exports.fetchAttendenceDetail = async (req , res) => {
    console.log("Fetch Attendnecne Detail Request") ;
    const attendenceId = req.user.attendence ; 
    const attendenceDb = await attendencedb.findOne({_id : attendenceId}) ;
    let attendenceObj = {
        tc : attendenceDb.totalClasses , 
        ca : attendenceDb.classesAttended , 
        tcJan : attendenceDb.tcjanuary , 
        tcFeb : attendenceDb.tcfebruary , 
        tcMar : attendenceDb.tcmarch , 
        tcApr : attendenceDb.tcapril , 
        tcMay : attendenceDb.tcmay , 
        tcJun : attendenceDb.tcjune ,
        tcJul : attendenceDb.tcjuly , 
        tcAug : attendenceDb.tcaugust , 
        tcSep : attendenceDb.tcseptember ,
        tcOct : attendenceDb.tcoctober , 
        tcNov : attendenceDb.tcnovember , 
        tcDec : attendenceDb.tcdecember ,
        caJan : attendenceDb.cajanuary , 
        caFeb : attendenceDb.cafebruary , 
        caMar : attendenceDb.camarch , 
        caApr : attendenceDb.caapril , 
        caMay : attendenceDb.camay , 
        caJun : attendenceDb.cajune ,
        caJul : attendenceDb.cajuly , 
        caAug : attendenceDb.caaugust , 
        caSep : attendenceDb.caseptember ,
        caOct : attendenceDb.caoctober , 
        caNov : attendenceDb.canovember , 
        caDec : attendenceDb.cadecember ,
    };
    let teachersArray = [] ;
    for(let i = 0 ; i < attendenceDb.teachers.length ; i++){
        let obj = attendenceDb.teachers[i] ;
        let newObj = {
            name : obj.name , 
            class : attendenceDb.numClasses[i] 
        }
        teachersArray.push(newObj) ;
    }
    attendenceObj.teachersArray = teachersArray ;
    let jan = [] , feb = [] , mar = [] , apr = [] , may = [] ;
    let jun = [] , jul = [] , aug = [] , sep = [] , oct = [] ; 
    let nov = [] , dec = [] ;
    for(let i = 0 ; i < attendenceDb.january.length ; i++){
        let dayId = attendenceDb.january[i] ;
        let dayRecord = await dailydb.findOne({_id : dayId}) ;
        jan.push(dayRecord) ;
    }
    for(let i = 0 ; i < attendenceDb.february.length ; i++){
        let dayId = attendenceDb.february[i] ;
        let dayRecord = await dailydb.findOne({_id : dayId}) ;
        feb.push(dayRecord) ;
    }
    for(let i = 0 ; i < attendenceDb.march.length ; i++){
        let dayId = attendenceDb.march[i] ;
        let dayRecord = await dailydb.findOne({_id : dayId}) ;
        mar.push(dayRecord) ;
    }
    for(let i = 0 ; i < attendenceDb.april.length ; i++){
        let dayId = attendenceDb.april[i] ;
        let dayRecord = await dailydb.findOne({_id : dayId}) ;
        apr.push(dayRecord) ;
    }
    for(let i = 0 ; i < attendenceDb.may.length ; i++){
        let dayId = attendenceDb.may[i] ;
        let dayRecord = await dailydb.findOne({_id : dayId}) ;
        may.push(dayRecord) ;
    }
    for(let i = 0 ; i < attendenceDb.june.length ; i++){
        let dayId = attendenceDb.june[i] ;
        let dayRecord = await dailydb.findOne({_id : dayId}) ;
        jun.push(dayRecord) ;
    }
    for(let i = 0 ; i < attendenceDb.july.length ; i++){
        let dayId = attendenceDb.july[i] ;
        let dayRecord = await dailydb.findOne({_id : dayId}) ;
        jul.push(dayRecord) ;
    }
    for(let i = 0 ; i < attendenceDb.august.length ; i++){
        let dayId = attendenceDb.august[i] ;
        let dayRecord = await dailydb.findOne({_id : dayId}) ;
        aug.push(dayRecord) ;
    }
    for(let i = 0 ; i < attendenceDb.september.length ; i++){
        let dayId = attendenceDb.september[i] ;
        let dayRecord = await dailydb.findOne({_id : dayId}) ;
        sep.push(dayRecord) ;
    }
    for(let i = 0 ; i < attendenceDb.october.length ; i++){
        let dayId = attendenceDb.october[i] ;
        let dayRecord = await dailydb.findOne({_id : dayId}) ;
        oct.push(dayRecord) ;
    }
    for(let i = 0 ; i < attendenceDb.november.length ; i++){
        let dayId = attendenceDb.november[i] ;
        let dayRecord = await dailydb.findOne({_id : dayId}) ;
        nov.push(dayRecord) ;
    }
    for(let i = 0 ; i < attendenceDb.december.length ; i++){
        let dayId = attendenceDb.december[i] ;
        let dayRecord = await dailydb.findOne({_id : dayId}) ;
        dec.push(dayRecord) ;
    }
    attendenceObj.jan = jan ; 
    attendenceObj.feb = feb ;
    attendenceObj.mar = mar ; 
    attendenceObj.apr = apr ;
    attendenceObj.may = may ; 
    attendenceObj.jun = jun ;
    attendenceObj.jul = jul ; 
    attendenceObj.aug = aug ;
    attendenceObj.sep = sep ; 
    attendenceObj.oct = oct ;
    attendenceObj.nov = nov ; 
    attendenceObj.dec = dec ;


    console.log(attendenceObj) ; 
    return res.json(200 , {
        data : {
            success : true ,
            attendence : attendenceObj
        }
    })
}


//done :- 
//Errors while login/signup.
//Password retrieval.
//Attendance section is not well specified.




//not done yet :-


//One cannot find the relevant notice.
//Notice was not sharable.
//One cannot ask his/her queries.
//Technically assisted report can’t be generated.
//Personal schedulers for faculties as well as students were not provided.
//Notes sharing functionality was not available.

