import {
    FETCH_ASSIGNMENT_FAILURE  , 
    FETCH_ASSIGNMENT_SUCCESS
}from './actionType' ;


export function fetchAssignment(){
    return (dispatch) => {
        const url = `http://localhost:8000/assignment/fetch` ;
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
                   return dispatch(fetchAssingmentSuccess(data.data.assignment)) ;
               }
               return dispatch(fetchAssignmentFailure(data.data.error)) ;
          })
    }
}

function fetchAssingmentSuccess(assignment){
    return {
        type : FETCH_ASSIGNMENT_SUCCESS , 
        assignment 
    }
}

function fetchAssignmentFailure(err){
    return {
        type : FETCH_ASSIGNMENT_FAILURE , 
        err
    }
}