import React, { Component } from 'react';

class StudentList extends Component {

    constructor(){
        super() ;
        this.state = {
            presentClick : false , 
            absentClick : false , 
            neutral : true 
        }
    }
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

    handleClick2 = (dec) => {
         if(dec === "present"){
            this.props.markAttendence('present' , this.props.student._id) ;
            this.setState({
                presentClick : true , 
                absentClick : false 
            })
         }else {
            this.props.markAttendence('absent' , this.props.student._id)
            this.setState({
                presentClick : false , 
                absentClick : true 
            })
         }

    }
    render() {
        let name = this.props.student.name.length > 17 ? this.props.student.name.substring(0,15) + ".." : this.props.student.name ;
        return (
            <div className="student-list-displayer">
                <div className="student-list-displayer-name">
                    {name}
               </div>
               <div className="student-list-displayer-present"
                    id={this.state.presentClick === true ? "presentClicked" : "neutal"}
                    onClick={() => this.handleClick2("present")}>
                     Present
               </div>
               <div className="student-list-displayer-absent"
                    id={this.state.absentClick === true ? "absentClicked" : "neutal"}
                    onClick={() => this.handleClick2("absent")}>
                     Absent
               </div>
                   
            </div>
        );
    }
}

export default StudentList;