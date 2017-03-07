import moment from 'moment';
import network from '../data/network'
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

export function openErrorModal(error) {
    return {
        type: 'OPEN_ERROR_MODAL',
        error,
    };
}

export function closeErrorModal(error) {
    return {
        type: 'CLOSE_ERROR_MODAL',
    };
}

export function getStats(filters) {
    var params = [];
   
    return dispatch => {
        dispatch(closeErrorModal());
        dispatch(requestStats())
        return network.get(filters)
            .then(d => {
                dispatch(receiveStats(d))
            })
            .catch(e => {
                dispatch(openErrorModal(e));
                return dispatch(networkError(e));
            })
    };
}
