import React, { Component } from 'react';

class StudentList extends Component {

    handleClick = (id) => {
        if(this.props.attendence.length === 0){
            this.props.attendence.push(id) ;
            console.log(this.props.attendence) ;
            return ;
        }
        let index = this.props.attendence.indexOf(id) ;
        if(index !== -1){
            this.props.attendence.push(id) ;
        }
        else{
            this.props.attendence.splice(index,1) ;
        }
        console.log(this.props.attendence) ;
    }
    render() {
        return (
            <div>
               {this.props.student.name}
               &nbsp;&nbsp;
               <button
                 onClick={() => this.props.markAttendence('present' , this.props.student._id)}>
                     Present
               </button>
               &nbsp;&nbsp;
               <button
                 onClick={() => this.props.markAttendence('absent' , this.props.student._id)}>
                     Absent
               </button>
                   
            </div>
        );
    }
}

export default StudentList;