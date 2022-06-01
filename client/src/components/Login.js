import React from 'react' ;
import  '../css/login.css';
import { loginUser } from '../actions/auth' ;
import { connect } from 'react-redux' ;
import { Redirect } from 'react-router-dom' ;

class Login extends React.Component{
    constructor(){
        super() ;
        this.state = {
            email : null , 
            password : null , 
        }
    }

    handleChange = (field , value) => {
        this.setState({
            [field] : value 
        })
    }

    handleSubmit = () => {
        // this.setState({
        //     credential : false 
        // })
        console.log("Login Pressed") ;
        const {email , password} = this.state ;
        if(!email && !password)return ;
        this.props.dispatch(loginUser(email , password)) ;
    }

    handlepassword = () => {
        this.setState({
            forgetPwd : true 
        })
    }


    render(){
        const { isLoggedIn , wrongCredentials } = this.props.auth ;
        
        if(isLoggedIn){
            return <Redirect to="/" />
        }
        if(this.state.forgetPwd){
            return <Redirect to="/password-recovery" />
        }
        return (
            <div className="primary">
                <div className="preprimary">
                    {wrongCredentials && <h2>wrong userid/password</h2>}
                    <div className="preprimary-email-input">
                        <input 
                                type="email" 
                                placeholder="Enter Email-Id"
                                onChange={(e) => this.handleChange("email" ,e.target.value)}>
                        </input>
                    </div> 
                    <div className="preprimary-pwd-input">
                        <input 
                            type="password" 
                            placeholder="Enter Password"
                            onChange={(e) => this.handleChange("password" ,e.target.value)}></input>
                    </div> 
                    <div className="login_button">
                                <button onClick={this.handleSubmit}>Login</button>
                    </div>
                    {wrongCredentials && <div className="login_button falsepwd">
                                <button onClick={this.handlepassword}>Forget Password</button>
                    </div>}
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
export default connect(mapStateToProps)(Login);



















// import React from 'react' ;
// import '../css/login.css' ;
// import { loginUser } from '../actions/auth' ;
// import { connect } from 'react-redux' ;
// import { Redirect } from 'react-router-dom' ;

// class Login extends React.Component{
//     constructor(){
//         super() ;
//         this.state = {
//             email : null , 
//             password : null
//         }
//     }

//     handleChange = (field , value) => {
//         this.setState({
//             [field] : value 
//         })
//     }

//     handleSubmit = () => {
//         console.log("Login Pressed") ;
//         const {email , password} = this.state ;
//         if(!email && !password)return ;
//         this.props.dispatch(loginUser(email , password)) ;
//     }


//     render(){
//         const { isLoggedIn } = this.props.auth ;
//         if(isLoggedIn){
//             return <Redirect to="/" />
//         }
//         return (
//             <div>
//                    <input 
//                         type="email" 
//                         placeholder="Enter Email-Id"
//                         onChange={(e) => this.handleChange("email" ,e.target.value)}></input>
//                    <br/><br/><br/>
//                    <input 
//                        type="password" 
//                        placeholder="Enter Password"
//                        onChange={(e) => this.handleChange("password" ,e.target.value)}></input>
//                     <button onClick={this.handleSubmit}>Login</button>
//             </div>
//         )
//     }
// }


// function mapStateToProps({auth}){
//     return {
//         auth 
//     }
// }
// export default connect(mapStateToProps)(Login);
