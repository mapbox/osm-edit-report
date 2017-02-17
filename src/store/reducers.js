import {combineReducers} from 'redux';

function stats(state = [], action) {
    switch (action.type) {
    case 'RECEIVE_STATS': {
        return action.data.data;
    }
    case 'REQUEST_STATS':
    case 'NETWORK_ERROR':
    default:
        return state;
    }
}

export default combineReducers({stats});
