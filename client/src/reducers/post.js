import {
    FETCH_NOTICE_FAILURE , 
    FETCH_NOTICE_SUCCESS 
} from '../actions/actionType' ;

const initialPostState = {
    posts : [] ,
    error : null 
}

export default function post(state = initialPostState , action){

    console.log(action) ;

    switch(action.type){
        case FETCH_NOTICE_SUCCESS : {
            return {
                posts : action.posts , 
                error : null 
            }
        }
        case FETCH_NOTICE_FAILURE : {
            return {
                posts : [] , 
                error : action.error 
            }
        }
        default : {
            return state 
        }
    }
}