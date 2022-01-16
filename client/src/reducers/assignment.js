import {
    FETCH_ASSIGNMENT_SUCCESS , 
    FETCH_ASSIGNMENT_FAILURE 
} from '../actions/actionType' ; 


const initialAssignmentState = {
    error : null , 
    assigment : []
}

 export default function assignment(state = initialAssignmentState , action){
    switch(action.type){
        case FETCH_ASSIGNMENT_FAILURE : {
            return {
                error : action.err , 
                assigment : []
            }
        }
        case FETCH_ASSIGNMENT_SUCCESS : {
            return {
               error : null , 
               assigment : action.assignment
            }
        }
        default : {
            return state 
        }
    }
}