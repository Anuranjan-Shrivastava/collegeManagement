import React, { Component } from 'react';
import '../css/password.css' ;
import { Redirect } from 'react-router-dom' ;

class PasswordChange extends Component {

    constructor() { 
        super() ;
        this.state = {
            origial_code : 1234 , 
            users_code : null , 
            phase1 : true  , 
            phase2 : false , 
            emailId : null  , 
            codeMatched : false , 
        }
    }

    handleInputChange = (field , value) => {
       console.log(field , value) ;
        this.setState({
            [field] : value 
        })
    }

    getOTP = () => { 
        if(this.state.emailId === null)return ;
        this.setState({
            phase1 : false , 
            phase2 : true
        })
        const url = 'http://localhost:8000/V2/user/passwordreset' ;
        let formBody = {email : this.state.emailId}

        fetch(url , {
            method : "POST" ,
            headers : {
                'Content-Type' : 'application/json' ,
            } ,
            body : JSON.stringify(formBody)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data) ;
             this.setState({
                 origial_code : data.data.code , 
             }) 
        })
    }

    verifyOTP = () => {
        if(this.state.origial_code == this.state.users_code){
             this.setState({
                codeMatched : true 
            })
        }
        else{
            alert("Wrong Code") ; 
        }
    } 
    render() {
        const { phase1 , phase2 } = this.state ;
        if(this.state.codeMatched){
            return <Redirect to="/newpassword" />
        }
        return (
            <div className='password-recovery'>
                 <div className='password-recovery-box'>
                     {phase1 && <div className='input-email'>
                          <input placeholder='Enter email address'
                                 onChange = {(e) => this.handleInputChange("emailId" , e.target.value)}/>
                      </div>}
                      {phase1 && <div>
                          <div className='button'
                               onClick = {() => this.getOTP()}>
                             Click to get OTP
                          </div>
                      </div>}
                     {phase2 && <div className='input-email'>
                          <input placeholder='Enter OTP'
                          onChange = {(e) => this.handleInputChange("users_code" , e.target.value)}/>
                      </div>}
                     {phase2 && <div >
                          <div className='button'
                               onClick = {() => this.verifyOTP()}>
                             Verify OTP
                          </div>
                      </div>}
                 </div>
            </div>
        );
    }
}

export default PasswordChange;