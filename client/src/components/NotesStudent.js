import React, { Component } from 'react';

class NotesStudent extends Component {

   
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
        let teacherName = this.props.notes.nameTeacher ; 
        let subject = this.props.notes.subject ; 
        let notesName = this.props.notes.nameNotes ;  
        let pdf = this.props.notes.pdf ; 
        let pdfurl = null ; 
        if(pdf !== undefined){
            const blob = this.base64toBlob(pdf) ;
            pdfurl = URL.createObjectURL(blob);
        }
        let img = this.props.notes.img ; 
        // let submittedStatus = true ;
        return (
            <div className='notes-container-box-element'>
                <div className='notes-container-box-element-teacherName'>
                   <i style={{"font-size" : ".8rem", "color" : "yellow"}}>given by</i> {teacherName}
                </div>
                <div className='notes-container-box-element-subName'>
                <i style={{"font-size" : ".8rem" , "color" : "yellow"}}>subject</i> {subject}
                </div>
                <div className='notes-container-box-element-assignmentName'>
                <i style={{"font-size" : ".8rem","color" : "yellow"}}>notes name </i>        {notesName }
                </div>
                
                <div className='notes-container-box-element-content'>
                     {img !== undefined && <div className='notes-container-box-element-content-img'>
                         <div className='notes-img-container'>
                             <img alt="notes pic" src={img} />
                         </div>
                         <div className='notes-img-name-container'>Notes.jpg</div>
                     </div>}
                     {pdfurl !== null && <div className='notes-container-box-element-content-pdf'>
                         <div className="notes-pdf-container">
                             <a href={pdfurl}
                                target="_blank"
                                rel="noreferrer">
                             Notes.pdf </a>
                         </div>
                     </div>}
                </div>
                
                    
            </div>
        );
    }
}

export default NotesStudent;