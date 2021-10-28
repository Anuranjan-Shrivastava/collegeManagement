import React from "react";
import axios from "axios";
import {Link } from 'react-router-dom' ;
import { connect } from 'react-redux' ;
import { logoutUser } from '../actions/auth' ;

class Home extends React.Component{
    constructor(){
        super() ;
        this.state = {
            notice_message : ""  ,
            posts:[]
        }
    }
    getBlogPost= () =>{
        const token = localStorage.getItem('token') ;
        console.log(this.props.auth.user.email);
       axios.get(`http://localhost:8000/user/addnotice?user=${this.props.auth.user.email}`,{
        headers:{
        Authorization : `Bearer ${token}`
       }
    })
        .then((response)=>{  
           const data = response.data;
           console.log(data);
           this.setState({posts:data});
           console.log('Data has been received!!');
        })
        .catch(()=>{
            alert('Error receivieng data!!!');
        }
        );
           

    }
    handleChange = (field , value) => {
        this.setState({
            [field] : value 
        })
    }

    logout = () => {
       console.log("LogOut pressed") ;
        localStorage.removeItem('token') ;
        this.props.dispatch(logoutUser()) ;
        
    }
     handleNoticeSubmit =(e)=>{
        e.preventDefault()
        const url = "http://localhost:8000/user/addnotice" ;
        const token = localStorage.getItem('token') ;

        const options = {
            method : "POST" ,
            headers : {
                'Content-Type' : 'application/json' ,
                Authorization : `Bearer ${token}`
            } ,
            body: JSON.stringify({
                user: this.props.auth.user.email,
                text: this.state.notice_message
            })
        }

        fetch(url , options).then(res => res.json()).then((data) => {
            console.log('success notice addition') ;  
        }).then(()=>{
            this.getBlogPost()
        })
        .catch(e=> console.error(e))
    }
   
    render(){

         console.log(this.state.posts) ;
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
                     <div>
                         {/* {showNotice} */}
                     </div>
                     <br/><br/><br/>
                     <form onSubmit={this.handleNoticeSubmit}>
                    <label>
                        NOTICE:<input type="text" name ="notice" 
                        value={this.state.notice_message}
                        onChange={(e)=>{
                            this.setState({ notice_message: e.target.value})
                        }}/>
                    </label>
                    <input type="submit" value ="ADD"/>
                </form>
                <ul>
                {this.state.posts.data &&
                   this.state.posts.data.map(post=>(<li>{post.user}</li>))
                }
                </ul>
                <ul>
                {this.state.posts.data &&
                   this.state.posts.data.map(post=>(<li>{post.text}</li>))
                }
                </ul>
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