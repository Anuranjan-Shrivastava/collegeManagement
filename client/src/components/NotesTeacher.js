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
    render() {
        console.log(this.props) ;
        let branch = this.props.notes.branch ; 
        let semester = this.intify(this.props.notes.semester) ;
        let subName = this.props.notes.subject ; 
        let notesName = this.props.notes.nameNotes ;
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
                    
                    
                </div>
        );
    }
}

export default NotesTeacher;