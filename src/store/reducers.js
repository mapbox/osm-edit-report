import {combineReducers} from 'redux';


function stats(state = {}, action) {
    switch (action.type) {
    case 'SET_USER_FILTER': {
        return filterUsers(state, action.filter);
    }
    case 'SET_TAG_FILTER': {
        return filterTags(state, action.filter);
    }
    case 'SET_TIME_FILTER': {
        return filterTime(state, action.filter);
    }
    case 'SET_BBOX_FILTER': {
        return filterBbox(state, action.filter);
    }
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

function filterUsers(state, filter) {

    return {
        ...state
    }
}

function filterTags(state, filter) {
    return {
        ...state
    }
}


function filterTime(state, filter) {
    return {
        ...state
    }
}

function filterBbox(state, filter) {
    return {
        ...state
    }
}
export default combineReducers({stats});
