import {combineReducers} from 'redux';
import filter from './filter';

function stats(state = {}, action) {
    switch (action.type) {
    case 'RECEIVE_STATS': {
        return {
            ...state,
            data: action.data.data
        }
    }
    case 'NETWORK_ERROR':
        return {
            ...state,
            data: []
        }
    case 'REQUEST_STATS':
    default:
        return state;
    }

}

export default combineReducers({stats});
