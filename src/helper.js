import queryString from 'query-string';
import moment from 'moment';

export function getUrlParam(n) {
    var parsed = queryString.parse(location.search);
    return parsed[n];
}
export function setUrlParams(obj) {
    Object.keys(obj).forEach(k => {
        if (moment.isMoment(obj[k])) {
            return setUrlParam(k, obj[k].utc().format());
        }
        setUrlParam(k, obj[k]);
    });
}
export function setUrlParam(keyArg, valueArg) {
    var hash = window.location.hash;
    var parsed = queryString.parse(location.search);
    if (!valueArg) {
        delete parsed[keyArg];
    } else {
        parsed[keyArg] = valueArg;
    }
    var newurl = queryString.stringify(parsed);
    window.history.pushState({ path: newurl }, '', `?${newurl}`);
    window.location.hash = hash;
}
