import {combineReducers} from 'redux';
import filter from './filter';

function stats(state = {}, action) {
    switch (action.type) {
    case 'SET_FILTER': {
        return {
            ...state,
            filterData: filter(state.rawData, action.filter)
        }
    }
    case 'NETWORK_ERROR':
        return {
            ...state,
            rawData: []
        }
    case 'REQUEST_STATS':
    default:
        return state;
    }

}

export default combineReducers({stats});
