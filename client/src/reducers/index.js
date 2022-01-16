import { combineReducers } from "redux";
import auth from './auth' ;
import post from './post' ;
import profile from './profile' ;
import assignment from './assignment' ;


const appReducer =  combineReducers({
    auth, 
    post ,
    profile , 
    assignment
 
}) ;

export default appReducer ;