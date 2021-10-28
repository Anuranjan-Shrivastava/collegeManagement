import {
    LOGIN_FAILED , 
    LOGIN_START  , 
    LOGIN_SUCCESS , 
    AUTHENTICATE_USER , 
    LOGOUT
} from './actionType' ;

//Starting Login

export function StartLogin(){
    return {
        type : LOGIN_START
    }
} 


function getFormBody(params){
    let formbody = [] ;
    for(let property in params){
        let encodedkey = encodeURIComponent(property) ;
        let encodedValue = encodeURIComponent(params[property]) ;
        formbody.push(encodedkey + '=' + encodedValue) ;
    }
  
    return formbody.join('&') ;
}

export function loginUser(email , password){

    console.log(email , password) ;
    return (dispatch) => {
        const url = 'http://localhost:8000/user/login' ;
        fetch(url , {
            method : "POST" ,
            credentials: 'same-origin',
            headers : {
               'Content-Type': 'application/x-www-form-urlencoded' ,            
            },
            body: getFormBody({
                email,
                password
            })
        })
         .then((response) => response.json())
         .then((data) => {
             console.log(data) ;
             if(data.data.success){
                 
                 localStorage.setItem('token' , data.data.token) ;
                 dispatch(loginsuccess(data.data.user) );
                 return ;
             }
             dispatch(loginfailed(data.data.message)) ;

         })
    }
}

export function loginsuccess(user){
    return {
        type : LOGIN_SUCCESS ,
        user        
    }
}

export function loginfailed(error){
    return {
        type : LOGIN_FAILED ,
        error
    }
}

//action for logout

export function logoutUser(){
    return {
        type : LOGOUT
    }
}


export function authenticateUser(user){
    return {
        type : AUTHENTICATE_USER ,
        user
    }
}
