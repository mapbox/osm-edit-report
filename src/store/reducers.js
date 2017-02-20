import {combineReducers} from 'redux';


function stats(state = {}, action) {
    switch (action.type) {
    case 'RECEIVE_STATS': {
        return {
            ...state,
            rawData: action.data.data
        }
    }
    case 'REQUEST_STATS':
    case 'NETWORK_ERROR':
    default:
        return {
            ...state,
            rawData: []
        };
    }
}

export default combineReducers({stats});
