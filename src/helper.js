import queryString from 'query-string';
import moment from 'moment';

export function getUrlParam(n) {
    var parsed = queryString.parse(location.search);
    return parsed[n];
}
export function setUrlParams(obj) {
    if (obj.dateFrom && moment.isMoment(obj.dateFrom)) {
        setUrlParam('dateFrom', obj.dateFrom.utc().format());
    } else {
        setUrlParam('dateFrom', '');
    }

    if (obj.dateTo && moment.isMoment(obj.dateTo)) {
        setUrlParam('dateTo', obj.dateTo.utc().format());
    } else {
        setUrlParam('dateTo', '');
    }

    if (obj.tags) {
        setUrlParam('tags', obj.tags);
    } else {
        setUrlParam('tags', '');
    }

    if (obj.users) {
        setUrlParam('users', obj.users);
    } else {
        setUrlParam('users', '');
    }

    if (obj.bbox) {
        setUrlParam('bbox', obj.bbox);
    } else {
        setUrlParam('bbox', '');
    }

    
}
export function setUrlParam(keyArg, valueArg) {
    var hash = window.location.hash;
    var parsed = queryString.parse(location.search);
    if (!valueArg || valueArg === '') {
        delete parsed[keyArg];
    } else {
        parsed[keyArg] = valueArg;
    }
    var newurl = queryString.stringify(parsed);
    window.history.pushState({ path: newurl }, '', `?${newurl}`);
    window.location.hash = hash;
}
