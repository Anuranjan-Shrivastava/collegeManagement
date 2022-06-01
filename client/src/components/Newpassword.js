import React, { Component } from 'react';
import '../css/newpassword.css' ;
import { Redirect } from 'react-router-dom' ;


class Newpassword extends Component {
    constructor(){
        super() ;
        this.state = {
            emailId : null , 
            password : null , 
            taskDone : false ,
        }
    }
    handleChange = (field , value) => {
        console.log(field , value)
        this.setState({
            [field] : value
        })
    }
    handleUpdateFunction = () => {
        
        let {emailId , password } = this.state ;
        if(!emailId){
            alert("Enter emailId") ; return ;
        }
        if(!password){
            alert("Enter Password") ; return ;
        }

        let formBody = {
            emailId , password
        }
        const url = 'http://localhost:8000/V2/user/passwordupdate' ;;
        fetch(url , {
            method : "post" , 
            headers : {
                'Content-Type' : 'application/json' ,
            } ,
            body : JSON.stringify(formBody)
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.data.success){
               this.setState({
                   taskDone : true 
               }) 
            }
        })
    }
    render() {

        if(this.state.taskDone){
            return <Redirect to = "/" />
        }
        return (
            <div className='resetpassword'>
                    <input placeholder='Enter email address'
                           onChange = {(e) => this.handleChange("emailId" , e.target.value)} /> <br/>
                    <input placeholder='Enter password'
                           onChange = {(e) => this.handleChange("password" , e.target.value)}/> <br/>
                    <div className='resetpassword-update'
                         onClick = {() => this.handleUpdateFunction()}>Update</div>
            </div>
        );
    }
}

export default Newpassword;