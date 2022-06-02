import React, { Component } from 'react';

class NotesTeacher extends Component {

    intify = (sem) => {
        if(sem === "one")return 1 ; 
        if(sem === "two")return 2 ; 
        if(sem === "three")return 3 ; 
        if(sem === "four")return 4 ; 
        if(sem === "five")return 5 ; 
        if(sem === "six")return 6 ; 
        if(sem === "seven")return 7 ; 
        if(sem === "eight")return 8 ; 

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
        console.log(this.props) ;
        let branch = this.props.notes.branch ; 
        let semester = this.intify(this.props.notes.semester) ;
        let subName = this.props.notes.subject ; 
        let notesName = this.props.notes.nameNotes ;
        const blob = this.base64toBlob(this.props.notes.pdf) ;
        let pdfurl = URL.createObjectURL(blob);
        return (
                <div className="notes-container-display-wrap-element">
                    <div className='notes-container-display-wrap-element-branchSem'>
                        <i style={{"font-size" : ".8rem","color":"yellow"}}>sem & branch</i> {semester}  & {branch}
                    </div>
                    <div className='notes-container-display-wrap-element-subName'>
                        <i style={{"font-size" : ".8rem","color":"yellow"}}>subject</i>  {subName} 
                    </div>
                    <div className='notes-container-display-wrap-element-notesName'>
                        <i style={{"font-size" : ".8rem","color":"yellow"}}> notes name </i>   {notesName} 
                    </div>
                    <div className='notes-container-display-wrap-element-notesContent'>
                         <a href={pdfurl}
                            target="_blank"
                            rel="noreferrer"
                            id="linky"
                            >Content</a>
                    </div>
                    
                    
                </div>
        );
    }
}

export default NotesTeacher;