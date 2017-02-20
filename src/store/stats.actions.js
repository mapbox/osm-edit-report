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

export function getStats() {
    return dispatch => {
        dispatch(requestStats());
        return api.get('/stats')
            .then(d => dispatch(receiveStats(d)))
            .catch(e => networkError(e));
    };
}
