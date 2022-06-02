import React, { Component } from 'react';
import '../css/notes.css' ;
import { connect } from 'react-redux' ;
import { NotesStudent , NotesTeacher } from './index' ;

class Notes extends Component {
    constructor(){
        super() ;
        this.state = {
            subName : null , 
            branch : null , 
            semester : null , 
            date : null , 
            notesName : null , 
            createClicked : false ,
            notespdf : null , 
            notes : [] 
            
        }
    }

    UNSAFE_componentWillMount(){
       this.fetchNotes() ;
    }

    fetchNotes = () => {
        const url = "http://localhost:8000/V2/notes/fetchNotes" ; 
        const token = localStorage.getItem('token') ;
        fetch(url , {
            method : "GET" , 
            headers : {
                Authorization : `Bearer ${token}`
            } ,
        })
        .then((res) => res.json())
        .then((data) => {
           
              this.setState({
                  notes : data.data.notes 
              })
        })
    }

    handleChange  = (field , value) => {
        console.log(field , value) ;
        this.setState({
            [field] : value 
        })
    }
    handleFileInput = (e , field) => {
        this.setState({
            [field] : e.target.files[0] 
        })
    }
    handleButtonChanger = () => {
        if(this.state.createClicked === true){
            let creater = document.getElementsByClassName('notes-container-creater-details')[0] ;
            creater.style.height = "0px" ;
            this.setState({
                subName : null , 
                branch : null , 
                semester : null , 
                date : null , 
                notesName : null , 
                createClicked : false ,
                notespdf : null , 
                notesPicture : null , 
            }) ; 
            return ;
        }
        let creater = document.getElementsByClassName('notes-container-creater-details')[0] ;
        creater.style.height = "200px" ;
        this.setState({
            createClicked : true 
        })
        
    }
    uploadNotes = () => {
        
        console.log("From Upload Notes " , this.state) ;
        const {subName , branch , semester , date , notesName , notespdf } = this.state ; 
        if(!subName || !branch || !semester || !date || !notesName )return ;
        let creater = document.getElementsByClassName('notes-container-creater-details')[0] ;
                creater.style.height = "0px" ;
                this.setState({
                    createClicked : false 
                })
        const formdata = new FormData() ;
        formdata.append("subName" , subName) ;
        formdata.append("branch" , branch)
        formdata.append("semester" , semester)
        formdata.append("date" , date)
        formdata.append('notesName', notesName) ;
        if(!notespdf){
            alert("Attach pdf or picture") ; return ;
        }
        if(notespdf)formdata.append('notesPdf' , this.state.notespdf) ;
        console.log("Sending Data") ;
        const url = `http://localhost:8000/V2/notes/upload` ;
        const token = localStorage.getItem('token') ;
        const options = {
            method : "Post" ,
            headers : {
                Authorization : `Bearer ${token}`
            } ,
            body : formdata
        }
        fetch(url , options)
          .then(res => res.json())
          .then(data => {
               this.fetchNotes() ;
          })
    }
    base64toBlob = (data:String) => {
        // Cut the prefix `data:application/pdf;base64` from the raw base 64
        const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);
    
        const bytes = atob(base64WithoutPrefix);
        let length = bytes.length;
        let out = new Uint8Array(length);
    
        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }
    
        return new Blob([out], { type: 'application/pdf' });
    };
    render(){    
        let notes =  this.state.notes;
        if(this.props.auth.user.designation === "stu"){
            return (
                <div className='notes'>
                    <div className='notes-container'>
                        <div className='notes-container-heading'>
                            {notes.length > 0 && <span>Your Notes</span>}
                            {notes.length == 0 && <span>No Notes</span>}
                             <i class="fas fa-book"></i>
                        </div>
                        <div className='notes-container-box'>
                            {notes.map((notes) => {
                                return (
                                    <NotesStudent 
                                            notes={notes}
                                            />
                                )
                            })} 
                        </div>
                    </div>
                </div>
                   
            )
        }
        return (
            <div className='notes'>
                 <div className="notes-container">
                     { <div className="notes-container-creater">
                        
                         <div className="notes-container-creater-details">
                            <div className="notes-creater-canceller"  
                                  onClick={() => this.handleButtonChanger()}>
                                <i class="fas fa-cut"></i>
                             </div>
                              <div className="notes-container-creater-details-name">
                                    <input type="text" 
                                        placeholder='Subject name'
                                        className="subjectName"
                                        onChange={(e) => this.handleChange("subName",e.target.value)}/><br/>
                                    <input type="text" 
                                        placeholder='Notes name'
                                        className="subjectName"
                                        onChange={(e) => this.handleChange("notesName",e.target.value)}/><br/>
                              </div>
                              <div className="notes-container-creater-details-select">
                                        <input type="date" placeholder='last date'
                                                className = "subjectName"
                                                onChange={(e) => this.handleChange("date",e.target.value)}/><br/>
                                        <select  
                                            className ="subjectName"
                                            onChange={(e) => this.handleChange("branch" ,e.target.value)} >
                                            <option  >Branch</option>
                                            <option value="CSE" >CSE</option>
                                            <option value="Mech">Mech</option>
                                            <option value="Mining">Mining</option>
                                            <option value="Civil">Civil</option>
                                            <option value="IT">IT</option>
                                            <option value="ET&T">ET&T</option>
                                            <option value="Electrical">Electrical</option>
                                        </select>
                                        <select  
                                            className ="subjectName"
                                            onChange={(e) => this.handleChange("semester" ,e.target.value)} >
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
                              <div className="notes-container-creater-details-content">
                                    <label className="fileInput">
                                        <input type="file" 
                                            accept="application/pdf" 
                                            onChange = {(e) => this.handleFileInput(e,"notespdf")}/> 
                                        Add PDF &nbsp; <i class="fas fa-file-pdf"></i>
                                    </label>
                              </div>
                         </div>
                         {!this.state.createClicked && 
                            <div className="notes-container-creater-button"
                                 onClick={() => this.handleButtonChanger()}>
                                Create Notes
                            </div>}
                         {this.state.createClicked  && 
                            <div className="notes-container-creater-button"
                                onClick={() => this.uploadNotes()}>
                                Upload Notes
                            </div>}

                     </div>}
                    { <div className="notes-container-display">
                         <div className="notes-container-display-wrap">
                             {notes.map((notes , idx) => {
                                 return (
                                     <NotesTeacher 
                                        notes={notes}
                                        index = {idx}/>
                                 )
                             })}
                         </div>
                     </div>}
                     </div>
            </div>
        )

                            }
                        } 
                    
function mapStateToProps({auth}){
    return {
        auth , 
    }
}
export default connect(mapStateToProps)(Notes);


// class Notes extends Component {
//     render() {
//         return (
//             <div className='notes'>
//                 This is notes Page 
//             </div>
//         );
//     }
// }