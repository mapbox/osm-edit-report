import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './css/assembly.css';
import './css/App.css';

// Dev tools
import './dev/reactotron';

import App from './App';
import store from './store';

console.log(process.env);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
