import React, { Component } from 'react';
import { connect } from 'react-redux' ;
import { Link  } from 'react-router-dom' ;
import {fetchUserProfile}  from '../actions/profile' ;

class NoticeBoard extends Component {
    constructor(props){
        super() ;
        this.state = {
            pdf : null , 
            openProfile : false 
        }
        if(props.post.pdf !== null){
            this.makePdf(props.post.pdf) ;
        }
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
    makePdf = (pdf) => {
        console.log("In Make Pdf") ;
        const blob = this.base64toBlob(pdf) ;
        const url = URL.createObjectURL(blob);
        console.log(url) ;
        this.setState({
             pdf : url 
        }) ;
    }

    handleProfileClick = (userId) => {
        console.log("Clicked HandleProfile CLicked")
        localStorage.setItem("profile" , userId) ;
        this.props.dispatch(fetchUserProfile(userId)) ;
    }
    render() {
        
        console.log("From Notice Board Component : " , this.props) ;
        let content = this.props.post.text ;
        let name =this.props.post.name ; 
        let posterId = this.props.post.posterId ;
        let date = this.props.post.date.substring(0,10) ;
        let url = null ; 
        if(this.props.post.pdf !== null){
            const blob = this.base64toBlob(this.props.post.pdf) ;
            url = URL.createObjectURL(blob);
        }
        let img = this.props.post.img ; 
        let designation = this.props.post.designation ; 
        let pdfName = this.props.post.pdfname.length > 17 ? this.props.post.pdfname.substring(0,17).concat("..") : this.props.post.pdfname ; 
        return (
            <div className="single-notice-container">
               {this.props.post.useremail === this.props.auth.user.email && <div className="single-notice-container-options"
                     onClick={() => this.props.openOption(this.props.num)}>
                    <i class="fas fa-ellipsis-h"></i>
                </div>}
                <div className="single-notice-container-options-menu">
                     <div onClick={() => this.props.deletePost(this.props.post.id , this.props.num)}>Delete</div><hr/>
                </div>
               
                <div className="single-notice-container-name"
                     onClick={() => this.handleProfileClick(posterId)}>
                     <Link to="/profile"
                           style={{ textDecoration: 'none' , color : 'wheat'}}>{name}</Link>
                    {designation === "fac" && <span className="admin-card">Faculty</span>}
                </div>
                <div className="single-notice-container-date">
                    <i>posted on</i> {date}
                </div>
                <div className="single-notice-container-content">
                    {content}
                </div>
                {url !== null && <div className="single-notice-container-pdf">
                <a
                           href={url}
                           target="_blank"
                           rel="noreferrer"><i class="fas fa-file-pdf"></i>&nbsp;{pdfName}</a>
                </div>}
                {img !== null && <div className="single-notice-container-img">
                     <img src={img} alt={name}/>
                </div>}
            </div>
        );
    }
}

function mapStateToProps({auth}){
    return {
        auth 
    }
}
export default connect(mapStateToProps)(NoticeBoard);