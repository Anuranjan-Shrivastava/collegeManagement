import {
    FETCH_USER_PROFILE_FAILURE , 
    FETCH_USER_PROFILE_SUCCESS
} from '../actions/actionType' ;

const initialProfileState = {
    user : {} , 
    error : null 
} ;

export default function profile(state = initialProfileState , action){
    switch(action.type){
        case FETCH_USER_PROFILE_SUCCESS : {
            return {
                ...state , 
                user : action.data , 
                error : null 
            }
        }
        case FETCH_USER_PROFILE_FAILURE : {
            return {
                ...state , 
                user : {} , 
                error : action.error 
            }
        }
        default : 
           return state ;
    }
}

