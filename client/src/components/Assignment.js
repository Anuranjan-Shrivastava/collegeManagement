import React, { Component } from 'react';
import '../css/assignment.css' ;
import { connect } from 'react-redux' ;
import { fetchAssignment } from '../actions/assignment' ;
import { AssignmentStudent , AssignmentTeacher } from './index' ;

class Assignment extends Component {
    constructor(){
        super() ;
        this.state = {
            subName : null , 
            branch : null , 
            semester : null , 
            date : null , 
            assignmentName : null , 
            createClicked : false ,
            assignpdf : null , 
            assignPicture : null , 
            singleAssignmentMode : false , 
            singleAssignmentObject : null ,
        }
    }
    UNSAFE_componentWillMount(){
        this.props.dispatch(fetchAssignment()) ;
    }

    handleChange  = (field , value) => {
        console.log(field , value) ;
        this.setState({
            [field] : value 
        })
    }
    handleFileInput = (e , field) => {
        this.setState({
            [field] : e.target.files[0] 
        })
    }
    handleButtonChanger = () => {
        if(this.state.createClicked === true){
            let creater = document.getElementsByClassName('assignment-container-creater-details')[0] ;
            creater.style.height = "0px" ;
            this.setState({
                subName : null , 
                branch : null , 
                semester : null , 
                date : null , 
                assignmentName : null , 
                createClicked : false ,
                assignpdf : null , 
                assignPicture : null , 
            }) ; 
            return ;
        }
        let creater = document.getElementsByClassName('assignment-container-creater-details')[0] ;
        creater.style.height = "200px" ;
        this.setState({
            createClicked : true 
        })
        
    }
    handleSingleOpen = (index) => {
        
         if(this.state.singleAssignmentMode === false){
             this.setState({
                 singleAssignmentMode : true , 
                 singleAssignmentObject : this.props.assignment.assigment[index]
             })
         }else {
             this.setState({
                 singleAssignmentMode : false , 
                 singleAssignmentObject : null 
             })
         }
    }

    uploadAssignment = () => {
        
        console.log("From Upload Assignment " , this.state) ;
        const {subName , branch , semester , date , assignmentName , assignpdf , assignPicture } = this.state ; 
        if(!subName || !branch || !semester || !date)return ;
        let creater = document.getElementsByClassName('assignment-container-creater-details')[0] ;
                creater.style.height = "0px" ;
                this.setState({
                    createClicked : false 
                })
        const formdata = new FormData() ;
        formdata.append("subName" , subName) ;
        formdata.append("branch" , branch)
        formdata.append("semester" , semester)
        formdata.append("date" , date)
        formdata.append('assignmentName', assignmentName) ;
        if(!assignpdf && !assignPicture)alert("Attach pdf or picture") ;
        if(assignpdf)formdata.append('assignPdf' , this.state.assignpdf) ;
        if(assignPicture)formdata.append('assignPicture' , this.state.assignPicture) ;
        console.log("Sending Data") ;
        const url = `http://localhost:8000/assignment/d` ;
        const token = localStorage.getItem('token') ;
        const options = {
            method : "Post" ,
            headers : {
                Authorization : `Bearer ${token}`
            } ,
            body : formdata
        }
        fetch(url , options)
          .then(res => res.json())
          .then(data => {
                this.props.dispatch(fetchAssignment()) ;
          })
    }

    fetchAfterSubmission = () => {
        console.log("Fetching Again After Submitting") ;
        this.props.dispatch(fetchAssignment()) ;
    }
    base64toBlob = (data:String) => {
        // Cut the prefix `data:application/pdf;base64` from the raw base 64
        const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);
    
        const bytes = atob(base64WithoutPrefix);
        let length = bytes.length;
        let out = new Uint8Array(length);
    
        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }
    
        return new Blob([out], { type: 'application/pdf' });
    };
    render() {
        console.log(this.state.singleAssignmentObject) ;
        let assignmentQuestionUrl = null ; 
        let studentSubmission = [] ;
        if(this.state.singleAssignmentObject!==null && this.state.singleAssignmentObject.pdf !== undefined){
            const blob = this.base64toBlob(this.state.singleAssignmentObject.pdf) ;
            assignmentQuestionUrl = URL.createObjectURL(blob);
        }
        if(this.state.singleAssignmentObject !==null && this.state.singleAssignmentObject.submission.length > 0){
            let submissions = this.state.singleAssignmentObject.submission ; 
            for(let i = 0 ; i < submissions.length ; i++){
                let blobs = this.base64toBlob(submissions[i].content) ;
                let url = URL.createObjectURL(blobs) ;
                let nextObj = {} ;
                nextObj.name = submissions[i].name ; 
                nextObj.url = url ; 
                studentSubmission.push(nextObj) ;
            }
        }
        let assignments = this.props.assignment.assigment ; 
        console.log(assignments) ;
        if(this.props.auth.user.designation === "stu"){
            return (
                <div className='assignment'>
                    <div className='assignment-container'>
                        <div className='assignment-container-heading'>
                            {assignments.length > 0 && <span>Your Assignments</span>}
                            {assignments.length == 0 && <span>No Assignments</span>}
                             <i class="fas fa-book"></i>
                        </div>
                        <div className='assignment-container-box'>
                            {assignments.map((assignment) => {
                                return (
                                    <AssignmentStudent 
                                            assignment={assignment}
                                            fetchAssing={this.fetchAfterSubmission}/>
                                )
                            })} 
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className='assignment'>
                 <div className="assignment-container">
                     {!this.state.singleAssignmentMode && <div className="assignment-container-creater">
                        
                         <div className="assignment-container-creater-details">
                            <div className="assignment-creater-canceller"  
                                  onClick={() => this.handleButtonChanger()}>
                                <i class="fas fa-cut"></i>
                             </div>
                              <div className="assignment-container-creater-details-name">
                                    <input type="text" 
                                        placeholder='Subject name'
                                        className="subjectName"
                                        onChange={(e) => this.handleChange("subName",e.target.value)}/><br/>
                                    <input type="text" 
                                        placeholder='Assignment name'
                                        className="subjectName"
                                        onChange={(e) => this.handleChange("assignmentName",e.target.value)}/><br/>
                              </div>
                              <div className="assignment-container-creater-details-select">
                                        <input type="date" placeholder='last date'
                                                className = "subjectName"
                                                onChange={(e) => this.handleChange("date",e.target.value)}/><br/>
                                        <select  
                                            className ="subjectName"
                                            onChange={(e) => this.handleChange("branch" ,e.target.value)} >
                                            <option  >Branch</option>
                                            <option value="CSE" >CSE</option>
                                            <option value="Mech">Mech</option>
                                            <option value="Mining">Mining</option>
                                            <option value="Civil">Civil</option>
                                            <option value="IT">IT</option>
                                            <option value="ET&T">ET&T</option>
                                            <option value="Electrical">Electrical</option>
                                        </select>
                                        <select  
                                            className ="subjectName"
                                            onChange={(e) => this.handleChange("semester" ,e.target.value)} >
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
                              <div className="assignment-container-creater-details-content">
                                    <label className="fileInput">
                                        <input type="file" 
                                            accept="image/png, image/jpeg,image/jpg"
                                            onChange = {(e) => this.handleFileInput(e,"assignPicture")}/> 
                                        Add Picture &nbsp; <i class="fas fa-images"></i>
                                    </label>
                                    <br/><br/>
                                    <label className="fileInput">
                                        <input type="file" 
                                            accept="application/pdf" 
                                            onChange = {(e) => this.handleFileInput(e,"assignpdf")}/> 
                                        Add PDF &nbsp; <i class="fas fa-file-pdf"></i>
                                    </label>
                              </div>
                         </div>
                         {!this.state.createClicked && 
                            <div className="assignment-container-creater-button"
                                 onClick={() => this.handleButtonChanger()}>
                                Create Assignment
                            </div>}
                         {this.state.createClicked  && 
                            <div className="assignment-container-creater-button"
                                onClick={() => this.uploadAssignment()}>
                                Upload Assignment
                            </div>}

                     </div>}
                    {!this.state.singleAssignmentMode&&  <div className="assignment-container-display">
                         <div className="assignment-container-display-wrap">
                             {assignments.map((assignment , idx) => {
                                 return (
                                     <AssignmentTeacher 
                                        assignment={assignment}
                                        index = {idx}
                                        handleSingleOpen={this.handleSingleOpen}/>
                                 )
                             })}
                         </div>
                     </div>}
                     {this.state.singleAssignmentMode && <div className="assignment-container-single-content">
                        <div className="assignment-container-single-content-first">
                            <div className="goBackButton"
                                 onClick={() => this.handleSingleOpen()}> 
                                <i class="fas fa-hand-point-left"></i> Go Back
                            </div>
                            <div className="assignment-container-single-content-first-heading">
                                Assignment Details
                            </div>
                            <div className="assignment-container-single-content-first-actualcontent">
                                {this.state.singleAssignmentObject.pdf && <div>
                                    <a href={assignmentQuestionUrl}
                                       target="_blacnk"
                                       rel = "noreferrer">
                                        PDF
                                    </a>

                                </div>}
                                {this.state.singleAssignmentObject.img && <div>
                                    <img alt="Assignment.Jpg" src={this.state.singleAssignmentObject.img} />
                                </div> }      
                            </div>
                        </div>
                        <div className="assignment-container-single-content-second">
                            <div className="assignment-container-single-content-second-heading">
                                Students Who Submitted Assignment
                            </div>
                            <div className="assignment-container-single-content-second-actualcontent">
                                {studentSubmission.map((submit) => {
                                    return (
                                        <div>
                                            <a href={submit.url}>
                                              {submit.name}
                                            </a></div>
                                    )
                                })}
                                
                                   
                            </div>
                        </div>
                        <div className="assignment-container-single-content-third">
                            <div className="assignment-container-single-content-third-heading">
                                Students Whose Assignment Is Yet Not Submitted
                            </div>
                            <div className="assignment-container-single-content-third-actualcontent">
                                {this.state.singleAssignmentObject.nosubmission.map((nosubmit) => {
                                    return (
                                        <div>{nosubmit.name}</div>
                                    )
                                })}    
                            </div>
                        </div>
                     </div>}
                 </div>
            </div>
        )
    }
}


function mapStateToProps({auth , assignment}){
    return {
        auth , 
        assignment
    }
}
export default connect(mapStateToProps)(Assignment);




