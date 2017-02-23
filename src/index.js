import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';
import './css/App.css';

// Dev tools
import './dev/reactotron';

import App from './App';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
