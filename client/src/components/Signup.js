import React from 'react' ;
import '../css/signup.css' ;
import { Redirect } from 'react-router-dom' ;


class Signup extends React.Component{

    constructor(){
        super() ;
        this.state = {
            name : null , 
            branch : "CSE" ,
            gender : null , 
            profession : null , 
            designation : null , 
            email : null , 
            password : null , 
            confirmPassword : null , 
            semester : null ,
            button : false ,
            process : false , 
            success : false ,
            rollno : null 
        }
    }

   handleChange =   (field , value) => {
       console.log(field , value) ;
       this.setState({
           [field] : value 
       }) ;
    
   }
   onFormSubmit =  () => {
       if(this.state.process === true)return ;
       this.setState({
           process : true 
       })
       let {
        name , 
        branch ,
        gender  , 
        profession  , 
        email  , 
        password  , 
        confirmPassword  , 
        semester  ,
        rollno 
       } = this.state ; 
       if(semester === null)semester= "null" ;
       if(!name || !branch || !gender || !profession || !semester 
           || !email || !password || !confirmPassword){
            console.log("Something Missing") ;
            this.setState({
                process : false 
            });
            return ;
       }
       //Please Match Password and confirm Password
       if(password !== confirmPassword){
           alert("Password & Confirm Password are not the same") ;
           this.setState({
             process : false 
           });
           return ;
       }
       if(profession === "stu" && rollno === null){
           alert("Enter roll number") ;
           this.setState({
            process : false 
            });
           return ;
       }
       const formBody = {
        name , 
        branch ,
        gender  , 
        profession  , 
        email  , 
        password  , 
        semester  , 
        rollno
       }
       let url = "http://localhost:8000/user/signup" ;
       let options = {
           method : "POST" , 
           headers : {
            'Content-Type' : 'application/json'
           } ,
           body : JSON.stringify(formBody) 
       }
       fetch(url , options).then((res) => res.json()).then(async (data) => {
        console.log(data) ;   
        if(data.data.success){
              this.setState({
                process : false ,
                success : true 
              });
           }
       }) ;



   }
    render(){
        if(this.state.success === true){
            return <Redirect to='/login'/>
        }
        return (
            <div className="container">
                   <div className="container-left">
                        <div className ="container-left-name">
                             <span className="details">Full Name : </span>
                             <input 
                                 type ="text" 
                                 placeholder="Name"  
                                 autoComplete="off"
                                 onChange={(e) => this.handleChange("name" ,e.target.value)}/>
                        </div>
                        <div className="container-left-branch">
                            <span className="details">Branch : </span>
                            <select  onChange={(e) => this.handleChange("branch" ,e.target.value)} >
                                <option value="CSE" >CSE</option>
                                <option value="Mech">Mech</option>
                                <option value="Mining">Mining</option>
                                <option value="Civil">Civil</option>
                                <option value="IT">IT</option>
                                <option value="ET&T">ET&T</option>
                                <option value="Electrical">Electrical</option>
                            </select>
                        </div>
                        <div className="container-left-gender">
                                 <span className="gender-title">Gender :</span>
                                 <label for="male">
                                     <input type="radio" 
                                            value="male" 
                                            id="male" 
                                            name='Gender'
                                            required
                                            onChange={(e) => this.handleChange('gender' , e.target.value)}/>
                                     <span className="gender">Male</span>
                                 </label>
                                 <label for="female">
                                     <input type="radio" 
                                            value="female" 
                                            id  ="female" 
                                            name='Gender'
                                            required
                                            onChange={(e) => this.handleChange('gender' , e.target.value)}/>
                                     <span className="gender">Female</span>
                                 </label>
                             
                        </div>
                        <div className="container-left-designation">
                                 <span className="select-title">Select Your Profession : </span>
                                 <label for="teacher">
                                     <input type="radio" 
                                            value="fac" 
                                            id="teacher" 
                                            name="profession" 
                                            required
                                            onChange={(e) => this.handleChange('profession' , e.target.value)}/>
                                     <span className="option">Faculty</span>
                                 </label>
                                 <label for="student">
                                     <input type="radio" 
                                            value="stu" 
                                            id="student" 
                                            name="profession"
                                            required
                                            onChange={(e) => this.handleChange('profession' , e.target.value)}/>
                                     <span className="option">Student</span>
                                 </label>
                        </div> 
                        { this.state.profession === "stu" && 
                         <div className="container-left-semester">
                                <span className="details">Semester : </span>
                                <select  onChange={(e) => this.handleChange("semester" ,e.target.value)} >
                                    <option >Semester</option>
                                    <option value="one" >1</option>
                                    <option value="two">2</option>
                                    <option value="three">3</option>
                                    <option value="four">4</option>
                                    <option value="five">5</option>
                                    <option value="six">6</option>
                                    <option value="seven">7</option>
                                    <option value="eight">8</option>
                                </select>                    
                         </div>
                        }
                        { this.state.profession === "stu" && 
                         <div className ="container-left-rollno">  
                             <span className="details">Roll No. </span>
                             <input 
                                 type ="text" 
                                 placeholder="Roll No."  
                                 autoComplete="off"
                                 onChange={(e) => this.handleChange("rollno" ,e.target.value)}/>        
                         </div>
                        }
                      
                   </div>
                   <div className="container-right">
                        <div className="container-right-email">
                            <span className="details">Email : </span>
                            <input type ="email" 
                                   placeholder="Email-id"
                                   autoComplete="off" 
                                   required
                                   onChange={(e) => this.handleChange("email" ,e.target.value)}/>
                       </div>
                       <div className="container-right-password">
                             <span >Password : </span>
                             <input type ="password" 
                                    placeholder="Password"
                                    autoComplete="off"
                                    required 
                                    onChange={(e) => this.handleChange("password" ,e.target.value)}/>
                        </div>
                        <div className="container-right-confirmPassword">
                                 <span className="details">Confirm Password : </span>
                                 <input type ="password" 
                                        placeholder="Confirm Password"
                                        autoComplete="off" 
                                        required
                                        onChange={(e) => this.handleChange("confirmPassword" ,e.target.value)}/>
                        </div>
                        <div className="container-right-button">
                             <div 
                                onClick = {() => this.onFormSubmit()}
                                style={this.state.process ? {"cursor":"not-allowed"} : {"cursor":"pointer"}}>Sign Up</div>                       
                       </div>
                   </div>
           </div>
        )
    }
}

export default Signup ; 