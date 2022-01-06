import {
    FETCH_NOTICE_FAILURE , 
    FETCH_NOTICE_SUCCESS
} from './actionType';


export function getBlogPost(email){
    console.log("getBlogPost CLicked") ;
    return (dispatch) => {
        const token = localStorage.getItem('token') ;
        const url = `http://localhost:8000/user/getNotice?user=${email}` ;
        const options = {
            method : "GET" ,
            headers:{
                Authorization : `Bearer ${token}`
                }
        }
        fetch(url , options)
           .then(response => response.json())
           .then((data) => {
            
              if(data.data.success){
                  dispatch(fetchSuccess(data.data.data)) ; 
                  return ;
              }
              dispatch(fetchFailure(data.err)) ;

           })
    }
      
}

export function fetchSuccess(posts){
    
    return {
        type : FETCH_NOTICE_SUCCESS , 
        posts
    }
}

export function fetchFailure(err){
    return {
        type : FETCH_NOTICE_FAILURE , 
        error : err 
    }
}

