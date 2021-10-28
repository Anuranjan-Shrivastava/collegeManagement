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
    inProgress : false 
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
               dp : action.dp
           }
        }
        case LOGIN_FAILED :{
            return {
                ...state ,
                inProgress : false ,
                error : action.err
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

