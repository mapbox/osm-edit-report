import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { registerServiceWorker } from './serviceworker';

import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';
import './css/App.css';
// Dev tools
// import './dev/reactotron';
// import Perf from 'react-addons-perf'
// window.Perf = Perf;
import App from './App';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();