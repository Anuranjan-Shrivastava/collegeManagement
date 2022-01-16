import React, { Component } from 'react';

class AssignmentTeacher extends Component {

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
        let branch = this.props.assignment.branch ; 
        let semester = this.intify(this.props.assignment.semester) ;
        let subName = this.props.assignment.subject ; 
        let assignmentName = this.props.assignment.nameAssignment ;
        let lastDate = this.props.assignment.lastdate.substring(0,10) ;
        return (
                <div className="assignment-container-display-wrap-element">
                    <div className='assignment-container-display-wrap-element-branchSem'>
                        <i style={{"font-size" : ".8rem","color":"yellow"}}>sem & branch</i> {semester}  & {branch}
                    </div>
                    <div className='assignment-container-display-wrap-element-subName'>
                        <i style={{"font-size" : ".8rem","color":"yellow"}}>subject</i>  {subName} 
                    </div>
                    <div className='assignment-container-display-wrap-element-assignmentName'>
                        <i style={{"font-size" : ".8rem","color":"yellow"}}> assignment name </i>   {assignmentName} 
                    </div>
                    <div className='assignment-container-display-wrap-element-lastDate'>
                        <i style={{"font-size" : ".8rem","color":"yellow"}}>last date </i>    {lastDate}
                    </div>
                    <div className='assignment-container-box-element-submitButton'
                         onClick = {() => this.props.handleSingleOpen(this.props.index)}>
                        <div className='openButton'>
                        Click to see submission
                        </div>
                    </div>
                </div>
        );
    }
}

export default AssignmentTeacher;