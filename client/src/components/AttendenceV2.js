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
                studentList : null
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
                                      {!this.state.attendenceLoading && <div>78%</div>}
                                  </span>
                        </div>
                        <div>
                            2. Total classes conducted this sem - <span className='attendenceV2-student-wrapper-data-figures'>100</span>&nbsp;
                            Total classes attended this sem - <span className='attendenceV2-student-wrapper-data-figures'>30</span>
                        </div>
                        <div>
                            3. Attendence in the month of &nbsp;&nbsp;
                            <select>
                                <option>January</option>
                                <option>February</option>
                                <option>March</option>
                                <option>April</option>
                                <option>May</option>
                                <option>June</option>
                                <option>July</option>
                                <option>August</option>
                                <option>September</option>
                                <option>October</option>
                                <option>November</option>
                                <option>December</option>
                            </select> 
                            &nbsp; is <span className='attendenceV2-student-wrapper-data-figures'>30%</span>
                        </div>
                        <div>
                            4. Attendence percentage in 
                            <select>
                                <option>Sanchita Chouravar's</option>
                                <option>Sonia Wadhva's</option>
                                <option>Aastha Tiwari's</option>
                                <option>Vishnu Prasad Verma's</option>
                                <option>Savita Sahu's</option>
                                <option>Sourabh Yadav's</option>
                                <option>Prince Sahu's</option>
                            </select>  
                                &nbsp; class is - <span className='attendenceV2-student-wrapper-data-figures'>200</span>
                        </div>
                    </div>
                    <div className='attendenceV2-student-wrapper-calender'>
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