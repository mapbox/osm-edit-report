import {combineReducers} from 'redux';
// import filter from './filter.action';
import { reducer as formReducer } from 'redux-form'
import { getUrlParam, setUrlParams } from '../helper';
import moment from 'moment';

function stats(state = {}, action) {
    switch (action.type) {
    case 'RECEIVE_STATS': {
        return {
            ...state,
            data: action.data.data
        }
    }
    case 'NETWORK_ERROR':
        return {
            ...state,
            data: []
        }
    case 'REQUEST_STATS':
    default:
        return state;
    }

}
const filterState = {
    users: getUrlParam('users') || undefined,
    tags: getUrlParam('tags') || undefined,
    dateFrom: getUrlParam('dateFrom') && moment(getUrlParam('dateFrom')),
    dateTo: getUrlParam('dateTo') && moment(getUrlParam('dateTo'))
}

function filters(state = filterState, action) {
    switch (action.type) {
    case 'SET_FILTERS': {
        setUrlParams(action.filters);
        return {
            ...action.filters
        };
    }
    default:
        return state;
    }
}

export default combineReducers({ stats, filters, form: formReducer});
