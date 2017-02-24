import {combineReducers} from 'redux';
import moment from 'moment';
// import filter from './filter.action';
import { reducer as formReducer } from 'redux-form'
import { getUrlParam, setUrlParams } from '../helper';
import StatsData from '../data';


function stats(state = {}, action) {
    switch (action.type) {
    case 'RECEIVE_STATS': {
        return {
            ...state,
            data: new StatsData(action.data.data)
        }
    }
    case 'NETWORK_ERROR':
        return {
            ...state,
            data: undefined
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

if (!filterState.dateFrom) { 
    filterState.dateFrom = moment().subtract(7, 'd');
    filterState.dateTo = moment()
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

export default combineReducers({ stats, filters, form: formReducer, modals });
