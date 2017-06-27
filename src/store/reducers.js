import moment from 'moment';
import {combineReducers} from 'redux';

import { getUrlParam, setUrlParams } from '../helper';
import StatsData from '../data';

function stats(state = {}, action) {
    switch (action.type) {
    case 'RECEIVE_STATS': {
        return {
            ...state,
            data: new StatsData(action.data),
            loading: false,
            timeOfReceive: moment()
        }
    }
    case 'NETWORK_ERROR':
        return {
            ...state,
            data: undefined,
            loading: false
        }
    case 'REQUEST_STATS':
        return {
            ...state,
            data: undefined,
            loading: true
        }
    default:
        return state;
    }

}

const filterState = {
    users: getUrlParam('users') || undefined,
    tags: getUrlParam('tags') || undefined,
    dateFrom: getUrlParam('dateFrom') && moment(getUrlParam('dateFrom')),
    dateTo: getUrlParam('dateTo') && moment(getUrlParam('dateTo')),
    bbox: getUrlParam('bbox') || undefined,
}

if (!filterState.dateFrom) {
    const now = moment();
    filterState.dateFrom = now.clone().subtract(7, 'd').startOf('day');
    filterState.dateTo = now.clone();
}

function filters(state = filterState, action) {
    switch (action.type) {
    case 'SET_FILTER': {
        setUrlParams(action.filter);
        return {
            ...action.filter
        };
    }
    default:
        return state;
    }
}

const modalsState = {
    showErrorModal: false,
    errorMessage: null,
};

function modals(state = modalsState, action) {
    switch(action.type) {
    case 'OPEN_ERROR_MODAL': {
        return {
            showErrorModal: true,
            errorMessage: action.error,
        };
    }
    case 'CLOSE_ERROR_MODAL': {
        return {
            showErrorModal: false,
            errorMessage: null,
        };
    }
    default:
        return state;
    }
}

export default combineReducers({ stats, filters, modals });
