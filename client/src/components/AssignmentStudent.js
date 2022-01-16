import React, { Component } from 'react';

class AssignmentStudent extends Component {

    constructor(){
        super() ;
        this.state = {
            assignmentAns : null 
        }
    }

    handleUploadSubmit = (e) => {
        this.setState({
            assignmentAns : e.target.files[0]
        })
    }

    handleSubmitAns = () => {
        if(this.state.assignmentAns === null){
            alert('Select pdf first') ;
            return ;
        } 
        const formdata = new FormData() ;
        formdata.append("assignmentAns" , this.state.assignmentAns) ;
        formdata.append("assignmentId" , this.props.assignment._id) ;
        console.log("Sending Ans") ;
        const url = `http://localhost:8000/assignment/submit` ;
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
                console.log(data) ;
                this.props.fetchAssing() ;
          })
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
        //console.log("Assignment Student : " , this.props.assignment) ;
        let teacherName = this.props.assignment.nameTeacher ; 
        let subject = this.props.assignment.subject ; 
        let assignmentName = this.props.assignment.nameAssignment ; 
        let lastDate = this.props.assignment.lastdate.substring(0,10) ; 
        let pdf = this.props.assignment.pdf ; 
        let pdfurl = null ; 
        if(pdf !== undefined){
            const blob = this.base64toBlob(pdf) ;
            pdfurl = URL.createObjectURL(blob);
        }
        let img = this.props.assignment.img ; 
        let submittedStatus = this.props.assignment.submitted ; 
        // let submittedStatus = true ;
        return (
            <div className='assignment-container-box-element'>
                <div className='assignment-container-box-element-teacherName'>
                   <i style={{"font-size" : ".8rem", "color" : "yellow"}}>given by</i> {teacherName}
                </div>
                <div className='assignment-container-box-element-subName'>
                <i style={{"font-size" : ".8rem" , "color" : "yellow"}}>subject</i> {subject}
                </div>
                <div className='assignment-container-box-element-assignmentName'>
                <i style={{"font-size" : ".8rem","color" : "yellow"}}>assignment name </i>        {assignmentName }
                </div>
                <div className='assignment-container-box-element-lastDate'>
                <i style={{"font-size" : ".8rem","color" : "yellow"}}>last date </i>   {lastDate}
                </div>
                <div className='assignment-container-box-element-content'>
                     {img !== undefined && <div className='assignment-container-box-element-content-img'>
                         <div className='assignment-img-container'>
                             <img alt="assignment pic" src={img} />
                         </div>
                         <div className='assignment-img-name-container'>Assignment.jpg</div>
                     </div>}
                     {pdfurl !== null && <div className='assignment-container-box-element-content-pdf'>
                         <div className="assignment-pdf-container">
                             <a href={pdfurl}
                                target="_blank"
                                rel="noreferrer">
                             Assignment.pdf </a>
                         </div>
                     </div>}
                </div>
                <div className='assignment-container-box-element-submitButton'>
                    {!submittedStatus && <label className="submitButton">
                        <input type="file" 
                            accept="application/pdf" 
                            onChange = {(e) => this.handleUploadSubmit(e)}/>
                            Upload 
                    </label>}
                    {!submittedStatus && <div className='submitButton'
                         onClick={() => this.handleSubmitAns()}>
                         Submit 
                    </div>}
                    {submittedStatus && <div className='submitButton submittedButton'>
                         Submitted
                    </div>}

                </div>
            </div>
        );
    }
}

export default AssignmentStudent;