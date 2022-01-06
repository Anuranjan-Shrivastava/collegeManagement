import { combineReducers } from "redux";
import auth from './auth' ;
import post from './post' ;
import profile from './profile' ;


const appReducer =  combineReducers({
    auth, 
    post ,
    profile 
 
}) ;

export default appReducer ;