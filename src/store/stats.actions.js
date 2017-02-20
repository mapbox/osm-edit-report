import api from './api';

function requestStats() {
    return {
        type: 'REQUEST_STATS'
    };
}

function receiveStats(data) {
    return {
        type: 'RECEIVE_STATS',
        data,
    };
}

function networkError(error) {
    return {
        type: 'NETWORK_ERROR',
        error,
    };
}

export function setFilter(filter) {
    return {
        type: 'SET_FILTER',
        filter
    };
}

export function getStats(users, time, tags, bbox) {
    var params = [];
    if (users && Array.isArray(users)) {
        params.push(`users=${users.join(',')}`);
    }
    if (time && time.from && time.to) {
        params.push(`from=${time.from}`);
        params.push(`to=${time.to}`);
    }
    if (tags && Array.isArray(tags)) {
        params.push(`tags=${tags.join(',')}`);
    }
    if (bbox && Array.isArray(bbox)) {
        params.push(`bbox=${bbox.join(',')}`);
    }
    return dispatch => {
        dispatch(requestStats())
        return api.get(`/stats?${ params.length > 0 ? params.join('&') : '' }`)
            .then(d => dispatch(receiveStats(d)))
            .catch(e => networkError(e));
    };
}
