import {
    LOGIN_START,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    AUTHENTICATE_USER, 
    LOGOUT , 
} from '../actions/actionType' ;

const initialAuthState = {
    user : {} ,
    error : null , 
    isLoggedIn : false , 
    inProgress : false  , 
    wrongCredentials : false , 
}

export default function auth(state = initialAuthState , action){
   
    switch(action.type){
        case LOGIN_START : {
          return {
              ...state , 
              inProgress : true 
          }
        }
        case LOGIN_SUCCESS : {
           return {
               ...state , 
               user : action.user ,
               isLoggedIn : true ,
               inProgress : false ,
               error : null  , 
               dp : action.dp , 
               wrongCredentials : false , 
           }
        }
        case LOGIN_FAILED :{
            if(action.error === "id/pwd"){
                return {
                    ...state ,
                    inProgress : false ,
                    error : action.error , 
                    wrongCredentials : true 
                }
            }
            return {
                ...state ,
                inProgress : false ,
                error : action.err , 
                wrongCredentials : false , 
            }
        }
        case LOGOUT : {
            return {
                ...state ,
                user : {} ,
                inProgress : false ,
                isLoggedIn : false , 
                error : null
            }
        }
        case AUTHENTICATE_USER : {
            return {
                ...state , 
                isLoggedIn : true ,
                user : action.user ,
                error : null , 
                inProgress : false
            }
        }
        default : 
           return state ;
    }
}

