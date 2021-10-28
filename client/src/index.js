import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux' ;
import { configStore } from './store/index' ;

const Store = configStore() ;

ReactDOM.render(
  <React.StrictMode>
   <Provider store={Store} >
         <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
