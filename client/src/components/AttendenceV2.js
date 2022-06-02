import React from 'react' ;
import {connect} from 'react-redux' ;
import { StudentList} from './index' ;
import '../css/attendence2.css';

class Attendence extends React.Component{

    constructor(){
        super() ;
        this.state = {
            branch : null ,
            semester : null ,
            studentData : [] ,
            attendenceList : []  , 
            totalClasses : 0 , 
            month : [
                1,2,3,4,5,6,7,8,9,10,11,12,12,14,15,
                16,17,18,19,20,21,22,23,24,25,26,27,
                28,29,30,31
            ] , 
            selectedDate : 0 ,
            dateIsSelected : false , 
            attendenceDetail : null , 
            attendenceLoading : true , 
            attendenceInMonth : 0 , 
            attendenceInTeacher : 0 
        }
    }

    
    componentWillMount() {
        const url = "http://localhost:8000/V2/attendence/fetchAttendenceDetail" ;
        const token = localStorage.getItem('token') ;
        const options = {
            method : "POST" ,
            headers : {
                'Content-Type' : 'application/json' ,
                Authorization : `Bearer ${token}`
            } 
        }

        fetch(url , options)
        .then(res => res.json())
        .then(async (data) => {
            console.log(data) ;
            this.setState({
                attendenceLoading : false  , 
                attendenceDetail : data.data.attendence 
            })
        })
    }
    

    handleChange = (id , value) => {
           console.log(id , value) ;
           let elementP = document.getElementById(`${id}present`) ;
           let elementA = document.getElementById(`${id}absent`) ;
           elementP.style.backgroundColor = "white" ;
           elementA.style.backgroundColor = "white" ;
           if(value === 0 ){
                elementA.style.backgroundColor = "red" ;
           }else{
                elementP.style.backgroundColor = "green" ;
           }
    }
    
    handleInputDetails =  (field , value) => {
        this.setState({
            [field] : value
        }) ;
    }
    handleSubmit = () => {

        console.log("Get Student List Pressed");
        let { branch , semester} = this.state ; 
        let formBody = {branch,semester} ;
        const token = localStorage.getItem('token') ;
        const url = "http://localhost:8000/V2/attendence/studentList" ;
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
                studentData : data.data.studentList , 
                totalClasses : data.data.totalClasses
            }) ;   
            
        })
    }
    handleAttendence = async (id , value) => {
        console.log(id , value) ;
        //changing the button color according to click ; 
        let elementP = document.getElementById(`${id}present`) ;
        let elementA = document.getElementById(`${id}absent`) ;
        elementP.style.backgroundColor = "white" ;
        elementA.style.backgroundColor = "white" ;
        if(value === 0 ){
             elementA.style.backgroundColor = "red" ;
        }else{
             elementP.style.backgroundColor = "green" ;
        }
        //according to click on present or absent 
        //manipulation the attendenceList 
        if(this.state.attendenceList.length === 0){
            this.setState({
                attendenceList : [...this.state.attendenceList,{id,value}]
            })
            console.log(this.state.attendenceList) ;
            return ;
        }
        let index = this.state.attendenceList.findIndex(obj => obj.id === id) ;
        if(index === -1){
            console.log("This Id is not Present") ;
            this.setState({
                attendenceList : [...this.state.attendenceList,{id,value}]
            })
        }
        else{
            console.log("This Id is Present") ;
            let newattendenceList = [] ;
            for(let i = 0 ; i < this.state.attendenceList.length ; i++){
                let obj = this.state.attendenceList[i] ;
                if(obj.id === id){ 
                    newattendenceList.push({id,value}) ;
                    continue ;
                }
                newattendenceList.push(obj) ;
            }
            this.setState({
                attendenceList : newattendenceList
            })

        }
        console.log(this.state.attendenceList) ;
    }
    getMonth = (idx) => {
        if(idx === 1)return "january" ;
        if(idx === 2)return "february" ;
        if(idx === 3)return "march" ;
        if(idx === 4)return "april" ;
        if(idx === 5)return "may" ;
        if(idx === 6)return "june" ;
        if(idx === 7)return "july" ;
        if(idx === 8)return "august" ;
        if(idx === 9)return "september" ;
        if(idx === 10)return "october" ;
        if(idx === 11)return "novermber" ;
        if(idx === 12)return "december" ;
    }
    handleUploadAttendence = () => {
        console.log("Upload Clicked") ;
        const {attendenceList,semester , branch } = this.state ; 
        console.log(attendenceList) ;
        if(attendenceList.length !== this.state.studentData.length){
            alert("Fill details for every student") ;
            return ;
        }
        const current = new Date();
        let date = current.getDate() ;
        let month = this.getMonth(current.getMonth()+1) ;
        console.log(date, month) ;
        let formBody = {attendenceList,date , month,semester , branch};
        const token = localStorage.getItem('token') ;
        const url = "http://localhost:8000/V2/attendence/update" ;
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
            this.setState({
                studentData : []
            }) ; 
            
        })
    }
    dateSelected = (index) => {
        console.log("Date Selector clicked") ;
        this.setState({
            selectedDate : this.state.month[index] , 
            dateIsSelected : true 
        })
    }
    handleMonthChange = (month) => {
        let att = this.state.attendenceDetail ; 
        let attm ; 
        if(month === "1"){
            attm = (att.tcJan / att.caJan) * 100 ;
        }
        if(month === "2"){
            attm = (att.tcFeb / att.caFeb) * 100 ;
        }
        if(month === "3"){
            attm = (att.tcMar / att.caMar) * 100 ;
        }
        if(month === "4"){
            attm = (att.tcApr / att.caApr) * 100 ;
        }
        if(month === "5"){
            attm = (att.tcMay / att.caMay) * 100 ;
        }
        if(month === "6"){
            attm = (att.tcJun / att.caJun) * 100 ;
        }
        if(month === "7"){
            attm = (att.tcJul / att.caJul) * 100 ;
        }
        if(month === "8"){
            attm = (att.tcAug / att.caAug) * 100 ;
        }
        if(month === "9"){
            attm = (att.tcSep / att.caSep) * 100 ;
        }
        if(month === "10"){
            attm = (att.tcOct / att.caOct) * 100 ;
        }
        if(month === "11"){
            attm = (att.tcNov / att.caNov) * 100 ;
        }
        if(month === "12"){
            attm = (att.tcDec / att.caDec) * 100 ;
        }
        if(isNaN(attm)){
            attm = 0 ;
        }
        this.setState({
            attendenceInMonth : attm 
        })

    }
    handleTeacherChange = (idx) => {
        console.log(idx) ;
        let classes = this.state.attendenceDetail.teachersArray[idx].class ; 
        this.setState({
            attendenceInTeacher : classes
        })
    }
    render(){   
        //this is section for faculty
        if(this.props.auth.user.designation === 'fac'){
            return (
                <div className="attendenceV2">
                    <div className='attendenceV2-details-input'>
                        <div>
                            <select className='attendenceV2-details-input-select'
                                    onChange={(e) => this.handleInputDetails("branch",e.target.value)}>
                                <option>Branch</option>
                                <option value="CSE" >CSE</option>
                                <option value="Mech">Mech</option>
                                <option value="Mining">Mining</option>
                                <option value="Civil">Civil</option>
                                <option value="IT">IT</option>
                                <option value="ET&T">ET&T</option>
                                <option value="Electrical">Electrical</option>
                            </select>
                        </div>
                        <div> 
                            <select className='attendenceV2-details-input-select'
                                    onChange={(e) => this.handleInputDetails("semester",e.target.value)}>
                                <option >Semester</option>
                                <option value="one" >1</option>
                                <option value="two">2</option>
                                <option value="three">3</option>
                                <option value="four">4</option>
                                <option value="five">5</option>
                                <option value="six">6</option>
                                <option value="seven">7</option>
                                <option value="eight">8</option>
                            </select>
                        </div>
                        <div className='attendenceV2-details-input-getList'>
                           <div onClick={()=>this.handleSubmit()}> Get student list</div>
                        </div>
                    </div>
                    <div className='attendenceV2-class-details'>
                        <span className='attendenceV2-class-details-heading'>Class Details:-</span><br/>
                        <ul>
                            <li>Total number of class you have taken :- {this.state.totalClasses} </li>
                            <li>Total number of students in class :- {this.state.studentData.length}</li>
                        </ul>
                    </div>
                    <div>
                        <table className='attendenceV2-list-display'>
                            <tr>
                                <th>Roll No.</th>
                                <th>Name</th>
                                <th>Action</th>
                                <th>Attendence</th>
                            </tr>
                            {
                                this.state.studentData.map((data) => {
                                    return (
                                        <tr>
                                            <td>{data.rollNo}</td>
                                            <td>{data.name}</td>
                                            <td className="attendenceV2-list-display-action">
                                                <div id={`${data.id}present`}
                                                    onClick={() => this.handleAttendence(data.id,1)}>Present</div>
                                                <div id={`${data.id}absent`}
                                                    onClick={() => this.handleAttendence(data.id,0)}>Absent</div>
                                            </td>
                                            <td style={data.attendence < 50?{backgroundColor: "red"}:{backgroundColor: "green"}}>{data.attendence}</td>
                                        </tr>
                                    )
                                })
                            }
                            
                        </table>
                    </div>
                    <div className='attendenceV2-button-collection'>
                        <div className='attendenceV2-upload-button'
                             onClick={()=>this.handleUploadAttendence()}>Upload Attendence</div>
                    </div>
                </div>
            )
        }
        console.log(this.state.attendenceDetail) ;
        //this is section for student 
        
        let overallAttendence = 0 , tc = 0 , ca = 0 , teachers = [] ;
        if(!this.state.attendenceLoading){
            let attendence = this.state.attendenceDetail ; 
            overallAttendence = (attendence.tc / attendence.ca) * 100 ; 
            tc = attendence.tc ; ca = attendence.ca ; 
            teachers = attendence.teachersArray ;
        }
        return (
            <div className='attendenceV2-student'>
                <div className='attendencev2-student-wrapper'>
                    <div className='attendenceV2-student-wrapper-heading'>
                        Attendence Report
                    </div>
                    <div className='attendenceV2-student-wrapper-data'>
                        <div>
                            1. Overall attendence - &nbsp; 
                                  <span className='attendenceV2-student-wrapper-data-figures'>
                                      {this.state.attendenceLoading && <div>loading</div>}
                                      {!this.state.attendenceLoading && <div>{overallAttendence}</div>}
                                  </span>
                        </div>
                        <div>
                            2. Total classes conducted this sem - <span className='attendenceV2-student-wrapper-data-figures'>{tc}</span>&nbsp;
                            Total classes attended this sem - <span className='attendenceV2-student-wrapper-data-figures'>{ca}</span>
                        </div>
                        <div>
                            3. Attendence in the month of &nbsp;&nbsp;
                            <select onChange = {(e) => this.handleMonthChange(e.target.value)}>
                                <option>Select Month</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select> 
                            &nbsp; is <span className='attendenceV2-student-wrapper-data-figures'>{this.state.attendenceInMonth}%</span>
                        </div>
                        <div>
                            4. Attendence percentage in 
                            <select onChange = {(e) => this.handleTeacherChange(e.target.value)}>
                                <option>Select Teacher</option>
                                {teachers.map((teacher , idx) => {
                                    return (
                                        <option value={idx}>{teacher.name}</option>
                                    )
                                })}
            
                            </select>  
                                &nbsp; class is - <span className='attendenceV2-student-wrapper-data-figures'>{this.state.attendenceInTeacher}</span>
                        </div>
                    </div>
                    
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


//<i class="fa-solid fa-spinner"></i>

{/* <div className='attendenceV2-student-wrapper-calender'>
                        <div className='attendenceV2-student-wrapper-calender-date'>
                            {
                                this.state.month.map((data , idx) => {
                                    return (
                                        <div className='attendenceV2-student-wrapper-calender-dates'
                                             onClick = {() => this.dateSelected(idx)}>
                                            {data}
                                        </div>
                                    )
                                })
                            }            
                        </div>
                        <div className='attendenceV2-student-wrapper-calender-details'>
                            {this.state.dateIsSelected && <div>{this.state.selectedDate}</div>}
                             {!this.state.dateIsSelected && 
                              <div>Select a date</div>}
                        </div>
                        
                    </div> */}