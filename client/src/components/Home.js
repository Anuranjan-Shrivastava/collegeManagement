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
      console.log("Profile Open Clicked") ;
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
                            <h3 className="homelabel">Welcome to GEC Bilaspur </h3> 
                          
                            <div className="homebutton2">
                               
                               <div>
                                    <Link to="/attendence"  id="linky">
                                        Attendence
                                    </Link>
                               </div>
                               
                               <div onClick={() => this.handleMyProfileClick()}>
                                    <Link to="/profile"  id="linky">
                                    My Profile
                                    </Link>
                               </div>
                              
                               <div>
                                    <Link to="/notice" id="linky">
                                     Notice Board
                                     </Link>
                               </div>
                               <div>
                                    <Link to="/assignment" id="linky">
                                     Assignment
                                     </Link>
                               </div>
                               <div onClick={this.logout} id="logoutButton">
                                     Logout
                               </div>
                             
                                   
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
                            <button id="login">Login</button>
                        </Link>
                        <br/><br/>
                        <Link to="/signup">
                            <button id="signup">SignUp</button>
                        </Link>
                        <br/><br/>
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




// <button
// onClick={this.logout}>Logout
// </button>

// <br/>
// <br/>
// <Link to="/attendence">
// <button>Attendence</button>
// </Link>
// <br/>
// <br/>
// <Link to="/notice">
// <button>Notice</button>
// </Link>
// <br/>
// <br/>
// <Link to="/profile">
// <button onClick={() => this.handleMyProfileClick()}>My Profile</button>
// </Link>





