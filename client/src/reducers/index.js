import { combineReducers } from "redux";
import auth from './auth' ;
import post from './post' ;


const appReducer =  combineReducers({
    auth, 
    post 
 
}) ;

export default appReducer ;