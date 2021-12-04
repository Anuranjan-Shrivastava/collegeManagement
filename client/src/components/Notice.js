import React, { Component } from 'react';
import { connect } from 'react-redux' ;
import { getBlogPost } from '../actions/post';
import { NoticeBoard } from './index' ;

import '../css/notice.css' ;

class Notice extends Component {

    
    componentWillMount() {
        this.props.dispatch(getBlogPost(this.props.auth.user.email)) ;
    }


  

    handleNoticeSubmit =()=>{
       console.log("handle Notice Submit") ;
        const url = "http://localhost:8000/user/addnotice" ;
        const token = localStorage.getItem('token') ;
        const notice = document.getElementsByClassName('noticeBlock-mainBody-wrapper-editor')[0].textContent ; 
 

        const options = {
            method : "POST" ,
            headers : {
                'Content-Type' : 'application/json' ,
                Authorization : `Bearer ${token}`
            } ,
            body: JSON.stringify({
                user: this.props.auth.user.email,
                text: notice
            })
        }

        fetch(url , options).then(res => res.json()).then((data) => {
            console.log('success notice addition') ;  
        }).then(()=>{
            this.props.dispatch(getBlogPost(this.props.auth.user.email)) ;
        })
        .catch(e=> console.error(e)) 

        document.getElementsByClassName('noticeBlock')[0].style.transform = "scale(0,0)" ;
        document.getElementsByClassName('overlayMaterial')[0].style.transform = "scale(0,0)" ;


    }

    handlePreNoticeClick = () => {
        console.log("pre Notice Click") ;
        document.getElementsByClassName('noticeBlock')[0].style.transform = "scale(1,1)" ;
        document.getElementsByClassName('overlayMaterial')[0].style.transform = "scale(1,1)" ;
        document.getElementsByClassName('noticeBlock-mainBody-wrapper-editor')[0].textContent = "" ;
    }
    cancelNoticeBlock = () => {
        console.log("Cancel Notice Req") ;
        document.getElementsByClassName('noticeBlock')[0].style.transform = "scale(0,0)" ;
        document.getElementsByClassName('overlayMaterial')[0].style.transform = "scale(0,0)" ;
    }
  
    render() {
        const posts = this.props.post.posts
        return (
            <div id="notice_component">
                <div className="overlayMaterial"></div>
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
                                 data-placeholder="What's on your mind ?"
                                >

                            </div>
                        </div>
                         
                    </div>
                    <div className="noticeBlock-postButton">
                        <div className="noticeBlock-postButton-post"
                             onClick={this.handleNoticeSubmit}>Post</div>

                    </div>
                </div>
                This is Notice Page for Teacher.....
                <br/>  <br/>  <br/>
                <div class="preNotice"
                      onClick={this.handlePreNoticeClick}>
                          Click to add a notice
                </div>
                <div>
                   {
                       posts.map((post) => {
                           return (
                               <NoticeBoard post={post}/>
                           )
                       })
                   }
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



// { <form onSubmit={this.handleNoticeSubmit}>
//                     <label>
//                         NOTICE:
//                         <input type="text" name ="notice" 
//                         value={this.state.notice_message}
//                         onChange={(e)=>{
//                             this.setState({ notice_message: e.target.value})
//                         }}/>
//                     </label>
//                     <input type="submit" value ="ADD"/>
//                 </form>}

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

                // contenteditable="true" 
                // data-placeholder="What's on your mind ?"
                // onClick={this.click}