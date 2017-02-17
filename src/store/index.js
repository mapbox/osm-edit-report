import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers';
import thunkMiddleware from 'redux-thunk';

const middleware = applyMiddleware(thunkMiddleware);
const store = process.env.REACT_APP_LOGGER === 'tron' ?
    console.tron.createStore(reducers, middleware):
    createStore(reducers, middleware);

export default store;
