import queryString from 'query-string';
import moment from 'moment';

export function getUrlParam(n) {
    var parsed = queryString.parse(window.location.search);
    return parsed[n];
}
export function setUrlParams(obj) {
    if (obj.dateFrom && moment.isMoment(obj.dateFrom)) {
        setUrlParam('dateFrom', obj.dateFrom.toISOString());
    } else {
        setUrlParam('dateFrom', '');
    }

    if (obj.dateTo && moment.isMoment(obj.dateTo)) {
        setUrlParam('dateTo', obj.dateTo.toISOString());
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
    var parsed = queryString.parse(window.location.search);
    if (!valueArg || valueArg === '') {
        delete parsed[keyArg];
    } else {
        parsed[keyArg] = valueArg;
    }
    var newurl = queryString.stringify(parsed);
    window.history.pushState({ path: newurl }, '', `?${newurl}`);
    window.location.hash = hash;
}

export function abbreviateNumber(value) {
    if (!value) return 0;
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "K", "M", "B", "t"];
        var suffixNum = Math.floor(("" + value).length / 3);
        var shortValue = '';
        for (var precision = 4; precision >= 2; precision--) {
            shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0) shortValue.toFixed(2);
        newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
}