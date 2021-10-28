import React from 'react' ;
import {connect} from 'react-redux' ;
import { StudentList} from './index' ;


class Attendence extends React.Component{

    constructor(){
        super() ;
        this.state = {
            branch : "CSE" ,
            semester : "one" ,
            studentList : null , 
            attendence : [] ,  
        }
    }

    handleChange = (field , value) => {
            this.setState({
                [field] : value
            })
    }
   
    handleSubmit = () => {
        console.log("Student List Pressed");
        let { branch , semester} = this.state ; 
    
        let formBody = {branch,semester} ;
        const token = localStorage.getItem('token') ;
        const url = "http://localhost:8000/attendence/studentList" ;
        const options = {
            method : "POST" ,
            headers : {
                'Content-Type' : 'application/json' ,
                Authorization : `Bearer ${token}`
            } ,
            body : JSON.stringify(formBody)
        }

        fetch(url , options).then(res => res.json()).then(async (data) => {
            console.log(data) ;
            await this.setState({
                studentList : data.data.studentList
            }) ;   
            
        })
    }
    handleAttendence = async (value , id) => {
        //do something
        if(this.state.attendence.length === 0){
            await this.setState({
                attendence : [...this.state.attendence,{id,value}]
            })
            console.log(this.state.attendence) ;
            return ;
        }
        let index = this.state.attendence.findIndex(obj => obj.id === id) ;
        console.log(index) ;
        if(index === -1){
            //console.log("This Id is not Present") ;
            await this.setState({
                attendence : [...this.state.attendence,{id,value}]
            })
        }
        else{
            //console.log("This Id is Present") ;
            let newAttendence = [] ;
            for(let i = 0 ; i < this.state.attendence.length ; i++){
                let obj = this.state.attendence[i] ;
                if(obj.id === id){
                   
                    newAttendence.push({id,value}) ;
                    continue ;
                }
                newAttendence.push(obj) ;
            }
            console.log(newAttendence) ;
            await this.setState({
                attendence : newAttendence
            })

        }
        console.log(this.state.attendence) ;
    }
    handleUploadAttendence = () => {
        console.log("Upload Clicked") ;
        let formBody = this.state.attendence ;
        const token = localStorage.getItem('token') ;
        const url = "http://localhost:8000/attendence/update" ;
        const options = {
            method : "POST" ,
            headers : {
                'Content-Type' : 'application/json' ,
                Authorization : `Bearer ${token}`
            } ,
            body : JSON.stringify(formBody)
        }

        fetch(url , options).then(res => res.json()).then(async (data) => {
            console.log(data) ; 
            await this.setState({
                studentList : null
            }) ; 
            
        })
    }
    render(){
        const {designation , totalClasses , classesAttended} = this.props.auth.user ;
        const attendencePercentage = (classesAttended/totalClasses)*100 ; 
        
        if(designation === "stu"){
            //kuch krna padega
            return (
                <div>
                    This is Attendence Page for Student<br/>
                    Total classes attended was : {classesAttended}
                    <br/>
                    Total classes conducted was : {totalClasses}
                    <br/>
                    Your attendence percentage is : {attendencePercentage}%
                     
                </div>
            )
        } 
        return (
            <div>This is Attendence Page for Teacher
                <br/>
                Branch
                 <select  onChange={(e) => this.handleChange("branch" ,e.target.value)} >
                                <option value="CSE" >CSE</option>
                                <option value="Mech">Mech</option>
                                <option value="Mining">Mining</option>
                                <option value="Civil">Civil</option>
                                <option value="IT">IT</option>
                                <option value="ET&T">ET&T</option>
                                <option value="Electrical">Electrical</option>
                 </select>
                 <br/>
                 Semester
                 <select  onChange={(e) => this.handleChange("semester" ,e.target.value)} >
                                <option value="one" >1</option>
                                <option value="two">2</option>
                                <option value="three">3</option>
                                <option value="four">4</option>
                                <option value="five">5</option>
                                <option value="six">6</option>
                                <option value="seven">7</option>
                                <option value="eight">8</option>
                 </select>
                 <br/><br/>   
                 {this.state.studentList === null && <button onClick={() => this.handleSubmit()}>Get Student List</button>}
                 {this.state.studentList !== null && this.state.studentList.length > 0 &&
                      this.state.studentList.map((student) => {
                          return (
                            <StudentList 
                               student={student}
                               markAttendence={this.handleAttendence}
                            /> 
                             )
                      })
                 }
                 {this.state.studentList !== null && this.state.studentList.length === 0 && 
                    <div>
                       
                        <button onClick={() => this.handleSubmit()}>Get Student List</button>
                        <br/> <br/>
                        No Student found ... !
                        </div>}

                 <br/><br/>
                 {this.state.studentList !== null && this.state.studentList.length > 0 && 
                       <button
                         onClick={() => this.handleUploadAttendence()}>Upload</button>
                 }
            
            </div>
        )
    }
}

function mapStateToProps({auth}){
    return {
        auth 
    }
}

export default connect(mapStateToProps)(Attendence) ; 