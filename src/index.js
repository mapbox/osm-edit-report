import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './css/assembly.css';
import './css/App.css';

import App from './App';
import store from './store';


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
