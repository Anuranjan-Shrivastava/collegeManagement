import React, { Component } from 'react';
import { connect } from 'react-redux' ;
import '../css/profile.css' ;
import dp from '../config/defaultDP.jpg' ;
import cover from '../css/coverPic.jpg' ;
import { updateUserProfile } from '../actions/profile' ;

class Profile extends Component {

    constructor(){
        super() ;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.state = {
            editAbout : false , 
            newAbout : "" , 
            editSkills : false , 
            newSkill : "" , 
            editLinks : false , 
            newLink : "" , 
            newPlatform : "" ,
            pdf : null , 
            cover : null , 
            dp : null , 
            coverPicOptions : false , 
            dpPicOptions : false , 
            deleteSkill : null , 
            deleteLink : null  
           
        }
    }
    handleEditing =  (field) => {
        if(field === "editAbout"){
            this.setState({
                [field] : true 
            })

            //responsible div
            let res_div = document.getElementsByClassName('profilePage-container-about-content')[0] ;
            console.log(res_div) ;
            res_div.setAttribute("contenteditable", true);
            setTimeout(function() {
                res_div.focus();
            }, 0);

        }

        if(field === "editSkills"){
            this.setState({
                [field] : true 
            })
        }
        if(field === "editLinks"){
            this.setState({
                [field] : true 
            })
        }
    }

    handleEditingDone = async (field) => {
        if(field === "editAbout"){
            this.setState({
                [field] : false 
            })

            let res_div = document.getElementsByClassName('profilePage-container-about-content')[0] ;
            res_div.setAttribute("contenteditable", false);   
            this.props.dispatch(updateUserProfile("about" ,res_div.textContent )) ;

        }
        if(field === "editSkills"){
            this.setState({
                [field] : false 
            })    
            if(this.state.newSkill === ""){
                alert("Enter Valid Skill") ;
                this.setState({
                    newSkill : "" ,
                    editSkills: false
                })
                 return ;
            }
            this.props.dispatch(updateUserProfile("skills" ,this.state.newSkill )) ;
        }
        if(field === "editLinks"){
            this.setState({
                [field] : false 
            }) 
            if(this.state.newLink === "" || this.state.newPlatform === ""){
                alert("Enter Valid Platform & Link") ; 
                this.setState({
                    newLink : "",
                    newPlatform : "" , 
                    editLinks: false
                })
                return ;
            }
            let newLinkObj = {
                platform : this.state.newPlatform  , 
                link : this.state.newLink
            }
            this.props.dispatch(updateUserProfile("socialLinks" , newLinkObj)) ;
        }
        if(field === "editResume"){
            console.log("On currect If")
            const formData = new FormData() ;
            formData.append('pdf' , this.state.pdf) ;
            if(this.state.pdf === null)return ;
            const url = "http://localhost:8000/user/uploadResume" ;
            const token = localStorage.getItem('token') ;
            const options = {
                method : "POST" ,
                headers : {
                    Authorization : `Bearer ${token}`
                } ,
                body: formData
            }
            fetch(url , options)
              .then(res => res.json())
              .then(data => {
                  if(data.data.success){
                      this.props.dispatch(updateUserProfile("pdf", "null")) ;
                  }
              })
        }
    }

    handleCoverPicUpload = (field) => {
       if(field === "cancel"){
           console.log("Cncek") ;
           this.setState({
               cover : null , 
               coverPicOptions : false 
           })
       }else{
           console.log("done") ;
           const formData = new FormData() ;
           formData.append('cover' , this.state.cover) ;
           if(this.state.cover === null){
               alert("No cover pic selected") ;
               return ;
           }
           const url = "http://localhost:8000/user/uploadCover" ;
           const token = localStorage.getItem('token') ;
           const options = {
               method : "POST" ,
               headers : {
                   Authorization : `Bearer ${token}`
               } ,
               body: formData
           }
           fetch(url , options)
             .then(res => res.json())
             .then(data => {
                 if(data.data.success){
                    this.setState({
                        cover : null , 
                        coverPicOptions : false 
                    })
                     this.props.dispatch(updateUserProfile("cover", "null")) ;
                 }else{
                     alert("Error uploading Cover pic")
                 }
             })
           return ;
       }
    }

    handledpPicUpload = (field) => {
        console.log(field) ;
        if(field === "cancel"){
            this.setState({
                dp : null , 
                dpPicOptions : false 
            })
        }else{
            const formData = new FormData() ;
            formData.append('dp' , this.state.dp) ;
            if(this.state.dp === null){
                alert("No picture  selected") ;
                return ;
            }
            const url = "http://localhost:8000/user/uploadDp" ;
            const token = localStorage.getItem('token') ;
            const options = {
                method : "POST" ,
                headers : {
                    Authorization : `Bearer ${token}`
                } ,
                body: formData
            }
            fetch(url , options)
              .then(res => res.json())
              .then(data => {
                  if(data.data.success){
                     this.setState({
                         dp : null , 
                         dpPicOptions : false 
                     })
                      this.props.dispatch(updateUserProfile("dp", "null")) ;
                  }else{
                      alert("Error uploading Cover pic")
                  }
              })
            return ;
        }
    }

    handleInputChange = (field , value) => {
        this.setState({
            [field] : value 
        }) ;

    }

    convertSem = (sem) => {
       if(sem === "one")return 1 ; 
       if(sem === "two")return 2 ; 
       if(sem === "three")return 3 ; 
       if(sem === "four")return 4 ; 
       if(sem === "five")return 5 ; 
       if(sem === "six")return 6 ; 
       if(sem === "seven")return 7 ; 
       if(sem === "eight")return 8 ; 
    }

    handlePdfUpload = (e , field) => {
        if(field === "dp"){
            this.setState({
                [field] : e.target.files[0] ,
                dpPicOptions : true 
            })
            return ;
        }
        if(field === "cover"){
            this.setState({
                [field] : e.target.files[0] ,
                coverPicOptions : true 
            })
            return ;
        }
        console.log(e.target.files) ;
        this.setState({
            [field] : e.target.files[0] ,
        })
    }
    base64toBlob = (data:String) => {
        // Cut the prefix `data:application/pdf;base64` from the raw base 64
        console.log("AT btb64 : " , typeof(data)) ;
        const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);
    
        const bytes = atob(base64WithoutPrefix);
        let length = bytes.length;
        let out = new Uint8Array(length);
    
        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }
    
        return new Blob([out], { type: 'application/pdf' });
    };

    handleDeleteShow = (id , property) => {
        console.log("Mouse on : " , id)
        if(property === "skill"){
            let element = document.getElementById(id) ;
            let childId = element.children[0].id ;
            let child = document.getElementById(childId) ;
            child.style.display = "block" ;
            this.setState({
                deleteSkill : element.textContent
            })
        }
        if(property === "link"){
            let element = document.getElementById(id) ;
            console.log(element.children) ;
            let childId = element.children[1].id ;
            let child = document.getElementById(childId) ;
            child.style.display = "block" ;
            this.setState({
                deleteLink : element.textContent
            })
        }
        
    }
    handleDeleteUnShow = (id , property) => {
        console.log("Mouse off : " , id)
        if(property === "skill"){
            let element = document.getElementById(id) ;
            let childId = element.children[0].id ;
            let child = document.getElementById(childId) ;
            child.style.display = "none" ;
            this.setState({
                deleteSkill : null
            })
        }
        if(property === "link"){
            let element = document.getElementById(id) ;
            console.log(element.children) ;
            let childId = element.children[1].id ;
            let child = document.getElementById(childId) ;
            child.style.display = "none" ;
            this.setState({
                deleteLink : null
            })
        }
    }

    deleteDetail = (property) => {
    
        let value ; 
        if(property === "skill" )  value = this.state.deleteSkill ; 
        if(property === "link") value = this.state.deleteLink
        if(value === null)return ;

        const url = `http://localhost:8000/user/deleteProperty/?propertyname=${property}` ;
        const token = localStorage.getItem('token') ;
        const options = {
            method : "POST" ,
            headers : {
                'Content-Type' : 'application/json' ,
                Authorization : `Bearer ${token}`
            } ,
            body : JSON.stringify({
                value
            })
        }
        fetch(url , options)
          .then(res => res.json())
          .then(data => {
              if(data.data.success){
                  return this.props.dispatch(updateUserProfile("update", "null")) ;
              }
              else{
                  alert(`Can not delete ${property}`) ;
              }
          })
        
    }

    handleDeleteResume = () => {
        const url = `http://localhost:8000/user/deleteResume` ;
        const token = localStorage.getItem('token') ;
        const options = {
            method : "GET" ,
            headers : {
                Authorization : `Bearer ${token}`
            } ,
        }
        fetch(url , options)
          .then(res => res.json())
          .then(data => {
              if(data.data.success){
                  return this.props.dispatch(updateUserProfile("update", "null")) ;
              }
              else{
                  alert(`Can Not Delete Resume`) ;
              }
          })
    }

    render() {
        
        let name = this.props.profile.user.name ; 
        let branch = this.props.profile.user.branch ;
        let sem = this.props.profile.user.semester ;
        let profileId = this.props.profile.user._id ; 
        let authId = this.props.auth.user._id ; 
        let about = this.props.profile.user.about ; 
        let desig = this.props.profile.user.designation ; 
        let skills = this.props.profile.user.skills === undefined ? [] :this.props.profile.user.skills  ;
        let links = this.props.profile.user.socialLinks === undefined ? [] :this.props.profile.user.socialLinks  ;  
        let attendencePercentage = (this.props.profile.user.classesAttended/this.props.profile.user.totalClasses)*100 ; ; 
        if(this.props.profile.user.classesAttended === 0){
             attendencePercentage = 0 ;
        }
        if(sem !== "null") sem = this.convertSem(sem) ;
        let url = null ; 
        if(this.props.profile.user.resume !== null && this.props.profile.user.resume !== undefined){
            const blob = this.base64toBlob(this.props.profile.user.resume) ;
            url = URL.createObjectURL(blob);
        }
        let coverPic = this.props.profile.user.cover ; 
        let dpPic = this.props.profile.user.dp ; 
        return (
            <div className="profilePage">
                <div className="profilePage-container">
                    <div className="profilePage-container-details">
                         <div className="profilePage-container-details-cover">
                             <label className="profilePage-container-details-cover-change">
                                    <input  type="file" 
                                            accept="image/png, image/jpeg,image/jpg"
                                            onChange = {(e) => this.handlePdfUpload(e,"cover")}/>
                                    <i class="fas fa-image"></i>
                             </label>
                             {this.state.coverPicOptions === true && <div className="profilePage-container-details-cover-options">
                                  &nbsp;<i class="fas fa-times"
                                          onClick = {() => this.handleCoverPicUpload("cancel")}></i><br/><br/>
                                  <i class="fas fa-check-circle"
                                       onClick = {() => this.handleCoverPicUpload("done")}></i>
                             </div>}
                             <img alt="coverpiv" 
                                  src={coverPic === null ? cover : coverPic}/>
                         </div>
                         <div className="profilePage-container-details-profile-detail">
                             <div className="profilePage-container-details-profile-detail-profile">
                                <label className="profilePage-container-details-profile-detail-profile-change">
                                        <input  type="file" 
                                            accept="image/png, image/jpeg,image/jpg"
                                            onChange = {(e) => this.handlePdfUpload(e,"dp")}/>
                                        <i class="fas fa-image"></i>
                                </label>
                                {this.state.dpPicOptions === true && <div className="profilePage-container-details-dp-options">
                                  &nbsp;<i class="fas fa-times"
                                          onClick = {() => this.handledpPicUpload("cancel")}></i>&nbsp;&nbsp;&nbsp;
                                  <i class="fas fa-check-circle"
                                       onClick = {() => this.handledpPicUpload("done")}></i>
                             </div>}
                                <img alt="profile pic"
                                     src={dpPic === null ? dp : dpPic}/>
                             </div>
                             <div className="profilePage-container-details-profile-detail-detail">
                                      <span className="profilePage-container-details-profile-detail-detail-name">{name}</span><br/>
                                      <span className="profilePage-container-details-profile-detail-detail-branch">{branch}</span><br/>
                                      {sem === "1" && <span className="profilePage-container-details-profile-detail-detail-sem">{sem}<sup>st</sup> Semester </span>}
                                      {sem === "2" && <span className="profilePage-container-details-profile-detail-detail-sem">{sem}<sup>nd</sup> Semester </span>}
                                      {sem === "3" && <span className="profilePage-container-details-profile-detail-detail-sem">{sem}<sup>rd</sup> Semester </span>}
                                      {sem !== "null" && sem !== "1" && sem !== "2" && sem !== "3" && <span className="profilePage-container-details-profile-detail-detail-sem">{sem}<sup>th</sup> Semester </span>}
                                      {sem === "null" && <span className="profilePage-container-details-profile-detail-detail-sem"> Faculty </span>}
                             </div>
                         </div>
                    </div>
                    <div className="profilePage-container-about">
                        <div className='profilePage-container-about-heading'>
                            About
                           {profileId === authId && <span onClick={() => this.handleEditing("editAbout")}>
                                <i class="far fa-edit"></i>
                            </span>}
                        </div>
                        <div className='profilePage-container-about-content' 
                             contentEditable="false">
                             {about}
                        </div>
                       {this.state.editAbout  && 
                                <div 
                                   className="profilePage-container-about-done"
                                   onClick={() => this.handleEditingDone("editAbout")}>
                                    Done
                                </div>}
                    </div>
                    {desig === "stu" && <div className="profilePage-container-skills">
                        <div className='profilePage-container-skills-heading'>
                            Skills
                            {profileId === authId && <span onClick={() => this.handleEditing("editSkills")}>
                                <i class="fas fa-plus"></i>
                            </span>}
                            { this.state.editSkills && <span>
                                <input type="text" 
                                       placeholder='Add new skill..'
                                       onChange={(e) => this.handleInputChange("newSkill",e.target.value)}/>
                                <span 
                                   className="profilePage-container-skills-heading-add"
                                   onClick={() => this.handleEditingDone("editSkills")}>
                                       Add
                                </span>
                            </span>}

                        </div>
                        <div className='profilePage-container-skills-content'>
                              {skills.map((skill , idx) => {
                                  return (
                                      <div className="profilePage-container-skills-content-skill"
                                           id={`${idx}dx`}
                                           onMouseEnter={() => this.handleDeleteShow(`${idx}dx` , "skill")}
                                           onMouseLeave={() => this.handleDeleteUnShow(`${idx}dx` , "skill")} >
                                          {skill}
                                          <div className="skill-Canceller" 
                                               id={`${idx}dy`}
                                               onClick={()  => this.deleteDetail("skill")}>
                                              <i class="fas fa-cut"></i>
                                          </div>
                                       </div>
                                  )
                              })}
                        </div>
                    </div>}
                    <div className="profilePage-container-links">
                        <div className='profilePage-container-links-heading'>
                            Social profile 
                            {profileId === authId && <span onClick={() => this.handleEditing("editLinks")}>
                                <i class="fas fa-plus"></i>
                            </span> }       
                            { this.state.editLinks && <span>
                                <input type="text" 
                                       className="profilePage-container-links-heading-input-platformname"
                                       placeholder='Add Platform..'
                                       onChange={(e) => this.handleInputChange("newPlatform",e.target.value)}/>
                                 <input type="text" 
                                       className='profilePage-container-links-heading-input-platformlink'
                                       placeholder='Add link to platform..'
                                       onChange={(e) => this.handleInputChange("newLink",e.target.value)}/>
                                <span 
                                   className="profilePage-container-links-heading-add"
                                   onClick={() => this.handleEditingDone("editLinks")}>
                                       Add
                                </span>
                            </span>}                 
                        </div>
                        <div className='profilePage-container-links-content'>
                              {links.map((prof , idx) => {
                                  return (
                                      <div className="profilePage-container-links-content-skill"
                                            id={`${idx}dlp`} 
                                            onMouseEnter={() => this.handleDeleteShow(`${idx}dlp` , "link")}
                                            onMouseLeave={() => this.handleDeleteUnShow(`${idx}dlp`, "link")}>
                                          <a href={prof.data.link} 
                                             target="_blank" 
                                             rel = "noreferrer">
                                          {prof.data.platform}</a>
                                          <div className="link-Canceller"
                                               id={`${idx}dlpc`}
                                               onClick={()  => this.deleteDetail("link")}>
                                              <i class="fas fa-cut"></i>
                                          </div>
                                      </div>
                                  )
                              })}
                        </div>     
                    </div>
                    <div className="profilePage-container-info">
                        <div className='profilePage-container-info-heading'>
                            Other information
                        </div>
                        <div className="profilePage-container-info-content">
                            {desig === "stu" && <div className="profilePage-container-info-content-info">
                                 <div className="profilePage-container-info-content-info-name">Attendence</div>
                                 <div className="profilePage-container-info-content-info-value">{attendencePercentage}%</div>
                            </div>}
                            <div className="profilePage-container-info-content-info">
                                 <div className="profilePage-container-info-content-info-name">Email</div>
                                 <div className="profilePage-container-info-content-info-value">{this.props.profile.user.email}</div>
                            </div>
                            {desig === "stu" && <div className="profilePage-container-info-content-info">
                                 <div className="profilePage-container-info-content-info-name">Resume</div>
                                 {url === null && <div className="profilePage-container-info-content-info-value">
                                     No resume added
                                 </div>}
                                 {url !== null && <div className="profilePage-container-info-content-info-value" id="ppciciv">
                                     <a href={url} target="_blank" rel="noreferrer">Resume <i class="fas fa-file-pdf"/></a>
                                 </div>}
                                 {profileId === authId && <div className="profilePage-container-info-content-info-upload">
                                    <label className="profilePage-container-info-content-info-upload-label">
                                            <input type="file" 
                                                accept="application/pdf" 
                                                onChange = {(e) => this.handlePdfUpload(e,"pdf")}/> 
                                            Select Resume
                                    </label>
                                 </div>}
                                 {profileId === authId && url !== null && <div className="profilePage-container-info-content-info-upload">
                                    <label className="profilePage-container-info-content-info-upload-label"
                                            onClick = {() => this.handleDeleteResume()}>
                                            Delete Resume
                                    </label>
                                 </div>}
                                 
                            </div>}
                            {profileId === authId && desig === "stu" && <div 
                                id="profilePage-container-info-content-info-add"
                                className="profilePage-container-info-content-info"
                                onClick={() => this.handleEditingDone("editResume")}>
                                          click to upload new resume
                            </div>    }               
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}


function mapStateToProps({auth , profile}){
    return {
        auth , 
        profile 
    }
}
export default connect(mapStateToProps)(Profile);


/* <img alt="coverpiv"  */
                                //   src="https://i.pinimg.com/564x/1f/51/e3/1f51e39b343e0075469b72a3c45f6dc1.jpg"/>