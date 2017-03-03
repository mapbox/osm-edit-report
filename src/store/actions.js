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
    if (filters) {
        const { users, dateFrom, dateTo, tags, bbox } = filters;
        if (users) {
            params.push(`users=${users}`);
        }
        if (moment.isMoment(dateFrom)) {
            params.push(`from=${dateFrom.startOf('day').toISOString()}`);
        }
        if (moment.isMoment(dateTo)) {
            params.push(`to=${dateTo.add(1, 'hour').startOf('hour').toISOString()}`);
        }
        if (tags) {
            params.push(`tags=${tags}`);
        }
        if (bbox) {
            params.push(`bbox=${bbox}`);
        }
    }
    return dispatch => {
        dispatch(closeErrorModal());
        dispatch(requestStats())
        return network.get(params)
            .then(d => {
                dispatch(receiveStats(d))
            })
            .catch(e => {
                dispatch(openErrorModal(e));
                return dispatch(networkError(e));
            })
    };
}
