import api from './api';
import moment from 'moment';
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

export function getStats(filters) {
    var params = [];
    if (filters) {
        const { users, dateFrom, dateTo, tags, bbox } = filters;
        if (users) {
            params.push(`users=${users}`);
        }
        if (moment.isMoment(dateFrom)) {
            params.push(`from=${dateFrom.utc().format()}`);
        }
        if (moment.isMoment(dateTo)) {
            params.push(`to=${dateTo.utc().format()}`);
        }
        if (tags) {
            params.push(`tags=${tags}`);
        }
        if (bbox) {
            params.push(`bbox=${bbox}`);
        }
    }
    return dispatch => {
        dispatch(requestStats())
        return api.get(`/stats?${ params.length > 0 ? params.join('&') : '' }`)
            .then(d => {
                if (d.problem) {
                    return dispatch(networkError(d.problem));
                }
                dispatch(receiveStats(d))
            });
            
    };
}
