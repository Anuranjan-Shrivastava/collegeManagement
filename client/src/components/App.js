import React from "react";
import '../css/app.css' ;
import { Home , Login , Signup , Attendence , Notice ,Extra ,  
         Profile , Assignment , AttendenceV2 , PasswordChange ,
        Newpassword , Notes } from './index' ;
import {BrowserRouter as Router ,Route} from 'react-router-dom' ;
import { authenticateUser} from '../actions/auth' ;
import { fetchUserProfile } from "../actions/profile";
import jwt_decode from 'jwt-decode' ; 
import { connect } from 'react-redux' ;






class App extends React.Component{


  constructor(props){
    super() ;
    const token = localStorage.getItem('token') ;
    const profile = localStorage.getItem('profile') ;
    if(token){
      let user = jwt_decode(token) ;
      props.dispatch(authenticateUser(user)) ;
      if(profile)props.dispatch(fetchUserProfile(profile)) ;
    }
  }

  handleClick = () => {
    console.log("Anuranjan is Clicked") ;
    fetch("http://localhost:8000/", {
      method : "GET" , 
      headers : {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => response.json())
    .then((data) => {
      console.log(data) ;
    })
  }
  
  render(){
    return (
      <Router>
      <div className="app">
           
           <Route exact={true} path="/" component={Home} />
           <Route exact={true} path="/login" component={Login} />
           <Route exact={true} path="/signup" component={Signup} />
           <Route exact={true} path="/attendence" component={AttendenceV2}/>
           <Route exact={true} path="/notice" component={Notice}/>
           <Route exact={true} path="/profile" component={Profile}/>
           <Route exact={true} path="/assignment" component={Assignment}/>
           <Route exact={true} path="/password-recovery" component={PasswordChange} />
           <Route exact={true} path="/newpassword" component={Newpassword} />
           <Route exact={true} path="/notes" component={Notes} />
           
      </div>
      </Router>
    )
  }
}

function mapStateToProps({auth}){
  return {
    auth 
  }
}

export default  connect(mapStateToProps)(App) ;  ;
