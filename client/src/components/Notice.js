import React, { Component } from 'react';
import '../css/notice.css' ;
import { connect } from 'react-redux' ;
import { getBlogPost } from '../actions/post';
import { NoticeBoard } from './index' ;
import nonotice from '../css/nonotice.png' ; 

class Notice extends Component {
    constructor(){
        super() ;
        this.state = {
            pdf : null , 
            img : null , 
        }
    }

    
    componentWillMount() {
        this.props.dispatch(getBlogPost(this.props.auth.user.email)) ; 
       
    }
    handleNoticeSubmit =()=>{
       console.log("handle Notice Submit") ;
        const url = "http://localhost:8000/user/addnotice" ;
        const token = localStorage.getItem('token') ;
        const notice = document.getElementsByClassName('noticeBlock-mainBody-wrapper-editor')[0].textContent ; 
 
        if(notice === "" && this.state.img === null && this.state.pdf  === null)return ;
        const formData = new FormData() ;
        formData.append('pdf' , this.state.pdf) ;
        formData.append('img',this.state.img) ;
        formData.append('user',this.props.auth.user.email) ;
        formData.append('text' , notice) ;
        formData.append('userDesignation' , this.props.auth.user.designation) ;
        const options = {
            method : "POST" ,
            headers : {
                Authorization : `Bearer ${token}`
            } ,
            body: formData
        }

        fetch(url , options)
           .then(res => res.json())
           .then((data) => {
            console.log('success notice addition') ;  
            this.setState({
                pdf : null , 
                img : null 
            }) 
        }).then(()=>{
            this.props.dispatch(getBlogPost(this.props.auth.user.email)) ;
        })
        .catch(e=> console.error(e)) 

        document.getElementsByClassName('noticeBlock')[0].style.transform = "scale(0,0)" ;
        document.getElementsByClassName('overlayMaterial')[0].style.transform = "scale(0,0)" ;


    }
    handlePreNoticeClick = () => {
        console.log("pre Notice Click") ;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        var notice = document.getElementById("notice_component") ;
        notice.style.height = "100vh"
        notice.style.overflow = "hidden" ;
        document.getElementsByClassName('noticeBlock')[0].style.transform = "scale(1,1)" ;
        document.getElementsByClassName('overlayMaterial')[0].style.transform = "scale(1,1)" ;
        document.getElementsByClassName('noticeBlock-mainBody-wrapper-editor')[0].textContent = "" ;
    }
    cancelNoticeBlock = () => {
        console.log("Cancel Notice Req") ;
        var notice = document.getElementById("notice_component") ;
        notice.style.height = "auto"
        notice.style.overflowX = "hidden" ;
        document.getElementsByClassName('noticeBlock')[0].style.transform = "scale(0,0)" ;
        document.getElementsByClassName('overlayMaterial')[0].style.transform = "scale(0,0)" ;
        this.setState({
            pdf : null , 
            img : null 
        })
    }
    handleClickToOpenOption = (cnt) => {

        console.log("Option Open Clicked" , cnt) ;

        // var notice = document.getElementById("notice_component") ;
        // notice.style.height = "auto"
        // notice.style.overflow = "scroll" ;

        document.getElementsByClassName('noticeBlock')[0].style.transform = "scale(0,0)" ;
        document.getElementsByClassName('overlayMaterial')[0].style.transform = "scale(0,0)" ;
        this.setState({
            pdf : null , 
            img : null 
        })
        var optionsMenu = document.getElementsByClassName("single-notice-container-options-menu");
        if(optionsMenu === undefined)return ;
        for(let i = 0 ; i < this.props.post.posts.length ; i++){
            if(cnt === i)continue ;
            optionsMenu[i].style.display = "none" ;
        }

        if(optionsMenu[cnt].style.display === "none"){
            optionsMenu[cnt].style.display = "block" ;
        }else{
            optionsMenu[cnt].style.display = "none"
        }
    }
    handleDeletePost = (postId , num) => {
        console.log("Delete Post Clicked" , postId) ;
        var optionsMenu = document.getElementsByClassName("single-notice-container-options-menu")[num];
        optionsMenu.style.display = "none"
        const url = "http://localhost:8000/user/deleteNotice" ;
        const token = localStorage.getItem('token') ;
        const options = {
            method : "POST" ,
            headers : {
                'Content-Type' : 'application/json' ,
                Authorization : `Bearer ${token}`
            } ,
            body: JSON.stringify({
                postId
            })
        }
        fetch(url , options)
          .then(response => response.json())
          .then((data) => {
            this.props.dispatch(getBlogPost(this.props.auth.user.email)) ;
            
          })

    }
    handleChange = (e , field) => {
        console.log(e.target.files) ;
        this.setState({
            [field] : e.target.files[0] ,
        })
    }
  
    render() {
        const posts = this.props.post.posts ; 
        return (
            <div id="notice_component">
               <div className="overlayMaterial"></div>
               <div className="main-notice-component-container">
                    <div>
                        <div className="noticeBlock">
                            <div class="noticeBlock-heading">
                                Create a post here
                                &emsp; &emsp;  &emsp; &emsp; &emsp;  &emsp; 
                                <span 
                                    className="noticeBlock-cancelButton"
                                    onClick={this.cancelNoticeBlock}><strong>X</strong></span>
                            </div>
                            <div className="noticeBlock-mainBody">
                                <div className="noticeBlock-mainBody-wrapper">
                                    <div className="noticeBlock-mainBody-wrapper-editor"
                                        contenteditable="true" 
                                        data-placeholder="What's on your mind ?">
                                    </div>
                                </div>                       
                            </div>
                            <div className="noticeBlock-postButton">
                                
                                <div className="noticeBlock-postButton-post"
                                    onClick={this.handleNoticeSubmit}>Post</div>
                                <div className="noticeBlock-postButton-attachment">
                                <label>
                                        <input type="file" 
                                            accept="image/png, image/jpeg,image/jpg"
                                            onChange = {(e) => this.handleChange(e,"img")}/> 
                                        <i class="fas fa-images"></i>
                                    </label>
                                
                                </div>
                                <div className="noticeBlock-postButton-attachment">
                                <label>
                                        <input type="file" 
                                            accept="application/pdf" 
                                            onChange = {(e) => this.handleChange(e,"pdf")}/> 
                                    <i class="fas fa-file-pdf"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="preNotice">
                            <div className="preNotice-heading">
                                Government Engineering College , Bilaspur
                                <br/>
                                Notice Board
                            </div>
                            <div className="preNotice-edit-notice">
                                <div onClick={this.handlePreNoticeClick}>
                                    Click to add a notice 
                                </div>
                            </div>
                        </div>
                        <div className="notices-full-container">
                        { posts.length > 0 &&  
                            posts.map((post , index) => {
                                
                                return (
                                    <NoticeBoard 
                                            post={post}
                                            num={index}
                                            openOption={this.handleClickToOpenOption}
                                            deletePost={this.handleDeletePost}/>
                                )
                            })
                        }
                        {
                            posts.length === 0 && 
                            <div className="notices-full-container">
                                <div className="notice-full-container-nonotice">
                                    <img src={nonotice} alt="No Notice Found" />
                                    <div>No Notice Found...</div>
                                </div>
                            </div>
                        }
                        </div>
                    </div>
               </div>
              
            </div>
        );
    }
}

function mapStateToProps({auth , post }){
    return {
        auth , 
        post 
    }
}
export default connect(mapStateToProps)(Notice) ;



 /*             <div className="overlayMaterial"></div>
                <div className="noticeBlock">
                    <div class="noticeBlock-heading">
                          Create a post here
                          &emsp; &emsp;  &emsp; &emsp; &emsp;  &emsp; 
                          <span 
                              className="noticeBlock-cancelButton"
                              onClick={this.cancelNoticeBlock}><strong>X</strong></span>
                    </div>
                    <div className="noticeBlock-mainBody">
                        <div className="noticeBlock-mainBody-wrapper">
                            <div className="noticeBlock-mainBody-wrapper-editor"
                                 contenteditable="true" 
                                 data-placeholder="What's on your mind ?">
                            </div>
                        </div>                       
                    </div>
                    <div className="noticeBlock-postButton">
                        
                        <div className="noticeBlock-postButton-post"
                             onClick={this.handleNoticeSubmit}>Post</div>
                        <div className="noticeBlock-postButton-attachment">
                        <label>
                                <input type="file" 
                                    accept="image/png, image/jpeg,image/jpg"
                                    onChange = {(e) => this.handleChange(e,"img")}/> 
                                <i class="fas fa-images"></i>
                            </label>
                           
                        </div>
                        <div className="noticeBlock-postButton-attachment">
                        <label>
                                <input type="file" 
                                    accept="application/pdf" 
                                    onChange = {(e) => this.handleChange(e,"pdf")}/> 
                               <i class="fas fa-file-pdf"></i>
                            </label>
                        </div>
                    </div>
                </div>
                <br/>  <br/>  <br/>
                <div class="preNotice"
                      onClick={this.handlePreNoticeClick}>
                          Click to add a notice
                </div>
                <div className="notices-full-container">
                   {  
                       posts.map((post , index) => {
                           
                           return (
                               <NoticeBoard 
                                    post={post}
                                    num={index}
                                    openOption={this.handleClickToOpenOption}
                                    deletePost={this.handleDeletePost}/>
                           )
                       })
                   }
                </div> */

                
