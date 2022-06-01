import React from 'react' ;
import {connect} from 'react-redux' ;
import { StudentList} from './index' ;
import '../css/attendence.css';

class Attendence extends React.Component{

    constructor(){
        super() ;
        this.state = {
            branch : "CSE" ,
            semester : "one" ,
            studentList : null , 
            attendence : [] ,  
            month : "Jan" , 
            monthS : "Jan" , 
        
        }
    }

    handleChange = async (field , value) => {
            await this.setState({
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
        const attendence = this.state.attendence ; 
        const month = this.state.month ;
        let formBody = { month , attendence};
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
        console.log(this.state.monthS) ;
        const {designation , totalClasses , classesAttended} = this.props.auth.user ;
        let attendencePercentage = (classesAttended/totalClasses)*100 ; ; 
        if(classesAttended === 0){
             attendencePercentage = 0 ;
        }
       
        let Jan = 0; 
        let Feb = 0;
        let Mar = 0;
        let Apr = 0;
        let May = 0;
        let June =0;
        let July =0;
        let Aug = 0;
        let Sep = 0;
        let Oct = 0;
        let Nov = 0 ;
        let Dec = 0 ;

        if(isNaN(Dec))Dec =   0  ;
        if(isNaN(Nov))Nov =   0  ;
        if(isNaN(Oct))Oct =   0  ;
        if(isNaN(Sep))Sep =   0  ;
        if(isNaN(Aug))Aug =   0  ;
        if(isNaN(May))May =   0  ;
        if(isNaN(Apr))Apr =   0  ;
        if(isNaN(Mar))Mar =   0  ;
        if(isNaN(Feb))Feb =   0  ;
        if(isNaN(June))June = 0  ;
        if(isNaN(July))July = 0  ;
        if(isNaN(Jan))Jan =   0  ;
                            
        if(designation === "stu"){
            //kuch krna padega
            return (
                <div className="attend1">
                    <div className="preattend">
                        <div>
                            <h4 className="attendlabel">
                            Total classes attended was : {classesAttended}
                            <br/><br/>
                            Total classes conducted was : {totalClasses}
                            <br/><br/>
                            Your attendence percentage is : {attendencePercentage}%
                            </h4>             
                        </div><br/>
                <h4 className="attendlabel">Monthly Attendence</h4>
                <br/>
                    <select className="attendencelabel" onChange={(e) => this.handleChange("monthS" ,e.target.value)} >
                                    <option value="Jan" >Jan</option>
                                    <option value="Feb">Feb</option>
                                    <option value="Mar">Mar</option>
                                    <option value="Apr">Apr</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="Aug">Aug</option>
                                    <option value="Sep">Sep</option>
                                    <option value="Oct">Oct</option>
                                    <option value="Nov">Nov</option>
                                    <option value="Dec">Dec</option>
                    </select>
                    {this.state.monthS === "Jan" && <h4>{Jan}%</h4>}
                    {this.state.monthS === "Feb" && <h4>{Feb}%</h4>}
                    {this.state.monthS === "Mar" && <h4>{Mar}%</h4>}
                    {this.state.monthS === "Apr" && <h4>{Apr}%</h4>}
                    {this.state.monthS === "May" && <h4>{May}%</h4>}
                    {this.state.monthS === "June" && <h4>{June}%</h4>}
                    {this.state.monthS === "July" && <h4>{July}%</h4>}
                    {this.state.monthS === "Aug" && <h4>{Aug}%</h4>}
                    {this.state.monthS === "Sep" && <h4>{Sep}%</h4>}
                    {this.state.monthS === "Oct" && <h4>{Oct}%</h4>}
                    {this.state.monthS === "Nov" && <h4>{Nov}%</h4>}
                    {this.state.monthS === "Dec" && <h4>{Dec}%</h4>}

                </div>
                </div>
            )
        } 
        return (
            <div className="attend">
                <div className="preattend">
                    <h3 className="attendlabel">Branch</h3>
                    <select className="attendencelabel"  onChange={(e) => this.handleChange("branch" ,e.target.value)} >
                                    <option value="CSE" >CSE</option>
                                    <option value="Mech">Mech</option>
                                    <option value="Mining">Mining</option>
                                    <option value="Civil">Civil</option>
                                    <option value="IT">IT</option>
                                    <option value="ET&T">ET&T</option>
                                    <option value="Electrical">Electrical</option>
                    </select>
                    <br/>
                    <h3 className="attendlabel">Semester</h3>
                    <select className="attendencelabel" onChange={(e) => this.handleChange("semester" ,e.target.value)} >
                                    <option value="one" >1</option>
                                    <option value="two">2</option>
                                    <option value="three">3</option>
                                    <option value="four">4</option>
                                    <option value="five">5</option>
                                    <option value="six">6</option>
                                    <option value="seven">7</option>
                                    <option value="eight">8</option>
                    </select>
                    <br/>
                    <h3 className="attendlabel">Month</h3>
                    <select className="attendencelabel" onChange={(e) => this.handleChange("month" ,e.target.value)} >
                                    <option value="Jan" >Jan</option>
                                    <option value="Feb">Feb</option>
                                    <option value="Mar">Mar</option>
                                    <option value="Apr">Apr</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="Aug">Aug</option>
                                    <option value="Sep">Sep</option>
                                    <option value="Oct">Oct</option>
                                    <option value="Nov">Nov</option>
                                    <option value="Dec">Dec</option>
                    </select>
                    <br/>   
                    {this.state.studentList === null &&
                    <div className="stulist">
                    <button onClick={() => this.handleSubmit()}>Get Student List</button>
                    </div>
                    
                    }
                    
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
                        <div className="stulist">
                        
                            <button onClick={() => this.handleSubmit()}>Get Student List</button>
                            <br/> <br/>
                        No Student found ... !  

                            </div>}

                    <br/><br/>
                    {this.state.studentList !== null && this.state.studentList.length > 0 &&
                    <div className="upload"> 
                        <button
                            onClick={() => this.handleUploadAttendence()}>Upload</button>
                            </div>
                    }
                
                </div>
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


// let Jan = (this.props.auth.user.monthlyAttendence[0].ca/this.props.auth.user.monthlyAttendence[0].tc )* 100 ; 
//         let Feb = (this.props.auth.user.monthlyAttendence[1].ca/this.props.auth.user.monthlyAttendence[1].tc )* 100 ;
//         let Mar = (this.props.auth.user.monthlyAttendence[2].ca/this.props.auth.user.monthlyAttendence[2].tc )* 100 ;
//         let Apr = (this.props.auth.user.monthlyAttendence[3].ca/this.props.auth.user.monthlyAttendence[3].tc )* 100 ;
//         let May = (this.props.auth.user.monthlyAttendence[4].ca/this.props.auth.user.monthlyAttendence[4].tc )* 100 ;
//         let June = (this.props.auth.user.monthlyAttendence[5].ca/this.props.auth.user.monthlyAttendence[5].tc )* 100 ;
//         let July = (this.props.auth.user.monthlyAttendence[6].ca/this.props.auth.user.monthlyAttendence[6].tc )* 100 ;
//         let Aug = (this.props.auth.user.monthlyAttendence[7].ca/this.props.auth.user.monthlyAttendence[7].tc )* 100 ;
//         let Sep = (this.props.auth.user.monthlyAttendence[8].ca/this.props.auth.user.monthlyAttendence[8].tc )* 100 ;
//         let Oct = (this.props.auth.user.monthlyAttendence[9].ca/this.props.auth.user.monthlyAttendence[9].tc )* 100 ;
//         let Nov = (this.props.auth.user.monthlyAttendence[10].ca/this.props.auth.user.monthlyAttendence[10].tc )* 100 ;
//         let Dec = (this.props.auth.user.monthlyAttendence[11].ca/this.props.auth.user.monthlyAttendence[11].tc )* 100 ;