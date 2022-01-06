import { FETCH_USER_PROFILE_SUCCESS , FETCH_USER_PROFILE_FAILURE } from "./actionType";

export function fetchUserProfile(usedId){
    return (dispatch) => {
        let url = `http://localhost:8000/user/getProfile?user=${usedId}` ;
        let token = localStorage.getItem('token') ;
        let options = {
            method : "Get" , 
            headers  : {
                Authorization : `Bearer ${token}`
            }
        } ;
        //fetch call
        fetch(url , options)
          .then(res => res.json())
          .then(data => {
              console.log(data)  ;
              if(data.data.success){
                return dispatch(fetchUserSuccess(data.data.user)) ;
              }
              dispatch(fetchUserFailure(data.data.error))
          })
    }
}



export function updateUserProfile(field , data){
    return (dispatch) => {
        let url = `http://localhost:8000/user/updateProfile?user=${field}` ;
        let token = localStorage.getItem('token') ;
        let options = {
            method : "POST" , 
            headers  : {
                'Content-Type' : 'application/json' ,
                Authorization : `Bearer ${token}`
            } , 
            body : JSON.stringify({
                data 
            })
        } ;
        //fetch call
        fetch(url , options)
          .then(res => res.json())
          .then(data => {
              console.log(data)  ;
              return dispatch(fetchUserSuccess(data.data.user)) ;
          })
    }
}

function fetchUserSuccess(data){
    return {
        type : FETCH_USER_PROFILE_SUCCESS , 
        data : data 
    }
}
function fetchUserFailure(error){
    return {
        type : FETCH_USER_PROFILE_FAILURE , 
        error 
    }
}