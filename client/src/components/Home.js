import React from "react";
import {Link } from 'react-router-dom' ;
import { connect } from 'react-redux' ;
import { logoutUser } from '../actions/auth' ;
import { fetchUserProfile } from "../actions/profile";
import  '../css/home.css';
class Home extends React.Component{

    logout = () => {
       console.log("LogOut pressed") ;
        localStorage.removeItem('token') ;
        localStorage.removeItem('profile') ;
        this.props.dispatch(logoutUser()) ;
        
    }
   

    handleMyProfileClick = () => {
      localStorage.setItem('profile' , this.props.auth.user._id) ;
      this.props.dispatch(fetchUserProfile(this.props.auth.user._id)) ;
    }
    render(){
        if(this.props.auth.isLoggedIn){
            return (
                <div className="home"> 
                   This is auth logged In
                   <div class="subhome">
                        <br/>
                            <h3 className="homelabel">Welcome to Government Engineering College , Bilaspur </h3> 
                            <br/>
                            <div className="homebutton2">
                               
                                    <button
                                        onClick={this.logout}>Logout
                                    </button>
                                    
                                    <br/>
                                    <br/>
                                    <Link to="/attendence">
                                        <button>Attendence</button>
                                    </Link>
                                    <br/>
                                    <br/>
                                    <Link to="/notice">
                                        <button>Notice</button>
                                    </Link>
                                    <br/>
                                    <br/>
                                     <Link to="/profile">
                                        <button onClick={() => this.handleMyProfileClick()}>My Profile</button>
                                    </Link>
                                  
                                   
                            </div>
                    </div> 
                </div>
            )
        }
        return (
        
            <div className="home">
                    <div className="subhome">
                   
                   <h3 className="homelabel">
                       Government Engineering College , Bilaspur
                   </h3>
                   <div className="homebutton1">
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
                        <br/><br/>
                        <Link to="/signup">
                            <button>SignUp</button>
                        </Link>
                   </div>
           </div> 
            </div> 
        )
    }
}


function mapStateToProps({auth}){
    return {
        auth 
    }
}
export default connect(mapStateToProps)(Home) ;




///////////////////////////////////////////////////
/* <div className="subhome">
                   
                        <h3 className="homelabel">
                            Government Engineering College , Bilaspur
                        </h3>
                        <div className="homebutton1">
                             <Link to="/login">
                                 <button>Login</button>
                             </Link>
                             <br/><br/>
                             <Link to="/signup">
                                 <button>SignUp</button>
                             </Link>
                        </div>
                </div> */
//////////////////////////////////////////////////










 /* <div class="subhome">
                        <br/>
                            <h3 className="homelabel">Welcome to Government Engineering College , Bilaspur </h3> 
                            <br/>
                            <div className="homebutton2">
                               
                                    <button
                                        onClick={this.logout}>Logout
                                    </button>
                                    
                                    <br/>
                                    <br/>
                                    <Link to="/attendence">
                                        <button>Attendence</button>
                                    </Link>
                                    <br/>
                                    <br/>
                                    <Link to="/notice">
                                        <button>Notice</button>
                                    </Link>
                                    <br/>
                                    <br/>
                                     <Link to="/profile">
                                        <button>Profile</button>
                                    </Link>
                                  
                                   
                            </div>
                    </div> */