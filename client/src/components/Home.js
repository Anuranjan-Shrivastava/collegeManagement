import React from "react";
import {Link } from 'react-router-dom' ;
import { connect } from 'react-redux' ;
import { logoutUser } from '../actions/auth' ;

class Home extends React.Component{

    logout = () => {
       console.log("LogOut pressed") ;
        localStorage.removeItem('token') ;
        this.props.dispatch(logoutUser()) ;
        
    }
   
    render(){
        if(this.props.auth.isLoggedIn){
            return (
                <div>
                    Hey U r logged In 
                    <br/>
                    <button
                        onClick={this.logout}>Logout</button>
                    <br/><br/>
                    <Link to="/attendence">
                     <button>Attendence</button>
                     </Link>
                     <br/><br/>
                     <Link to="/notice">
                     <button>Notice</button>
                     </Link>
                     <br/><br/><br/>
                </div>
            )
        }
        return (
        
            <div>
                <h3>This is Home</h3>
                <Link to="/login">
                <button>Login</button></Link>
                <br/><br/>
                <Link to="/signup">
                <button>SignUp</button></Link>
                
              
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



// {/* <form onSubmit={this.handleNoticeSubmit}>
//                     <label>
//                         NOTICE:
//                         <input type="text" name ="notice" 
//                         value={this.state.notice_message}
//                         onChange={(e)=>{
//                             this.setState({ notice_message: e.target.value})
//                         }}/>
//                     </label>
//                     <input type="submit" value ="ADD"/>
//                 </form> */}

                // <ul>
                // {this.state.posts.data &&
                //    this.state.posts.data.map(post=>(<li>{post.user}</li>))
                // }
                // </ul>
                // <ul>
                // {this.state.posts.data &&
                //    this.state.posts.data.map(post=>(<li>{post.text}</li>))
                // }
                // </ul>