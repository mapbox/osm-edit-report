import { create } from 'apisauce';
import cache from 'lscache';
import R from 'ramda';
import moment from 'moment';
const api = create({
    baseURL: 'https://osm-comments-api.mapbox.com/api/v1',
    headers: { 'Accept': 'application/json' }
});

class Network {
    constructor() {

    }
    get(filters) {
        return this.apiGet(filters);
    }
    getQueryStr(filters) {
        var params = [];
        if (filters) {
            const { users, dateFrom, dateTo, tags, bbox } = filters;
            // if (users) {
            //     params.push(`users=${users}`);
            // }
            if (moment.isMoment(dateFrom)) {
                params.push(`from=${dateFrom.toISOString()}`);
            }
            if (moment.isMoment(dateTo)) {
                params.push(`to=${dateTo.toISOString()}`);
            }
            // if (tags) {
            //     params.push(`tags=${tags}`);
            // }
            if (bbox) {
                params.push(`bbox=${bbox}`);
            }
        }
        return params.length > 0 ? params.join('&') : '';
    }
    setCache(data, filters) {
        cache.set(this.getCacheQueryStr(filters), data, 30);
    }
    getCache() {
        let data = cache.get(this.getCacheQueryStr(this.filters));
        if (!data) return ;
        const filterByKey = (fn) => R.compose(R.fromPairs, R.filter(R.apply(fn)), R.toPairs);
        const mapValues = R.curry((fn, obj) =>
            R.fromPairs(R.map(R.adjust(fn, 1), R.toPairs(obj))));

        if (this.filters.users) {
            const filterFunc = (v) => this.filters.users.indexOf(v) > -1;
            data = mapValues(filterByKey(filterFunc), data);
        }
        if (this.filters.tags) {
            // filter by tags
            const filterTags = (v) => this.filters.tags.indexOf(v) > -1;
            const filterEditByTag = (k, v) => {
                const tagsInEdits = R.keys(v.tags_created).concat(R.keys(v.tags_deleted), R.keys(v.tags_modified));
                const tagsFilter = this.filters.tags.split(',');
                for (let i = 0; i < tagsFilter.length; i++) {
                    const tag = tagsFilter[i];
                    if (tagsInEdits.indexOf(tag) > -1) {
                        return true;
                    }
                }
                return false;
            }
            const removeOtherTags = (v) => {
                return {
                    ...v,
                    'tags_created': filterByKey(filterTags)(v.tags_created),
                    'tags_deleted': filterByKey(filterTags)(v.tags_deleted),
                    'tags_modified': filterByKey(filterTags)(v.tags_modified),
                }
            };
            data = R.map(R.compose(R.map(removeOtherTags) ,filterByKey(filterEditByTag)), data);
        }
        return data;
    }
    fillEmptyHours(data) {
        const hours = Object.keys(data);
        let hour = Object.keys(data)[0];
        const last = Object.keys(data)[hours.length - 1];
        while (hour !== last) {
            const nextHour = moment(hour).add(1, 'hour').toISOString();
            if (!data[nextHour]) {
                data[nextHour] = {};
            }
            hour = nextHour;
        }
    }
    filterByUserNames(users) {

    }
    filterByTags(tags) {

    }
    getCacheQueryStr(filters) {
        let dateFrom = filters.dateFrom.toISOString();
        let dateTo = filters.dateTo.toISOString();
        return `${dateFrom}&${dateTo}&${filters.bbox ? filters.bbox: ''}`;
    }
    apiGet(filters) {
        // avoids caching of bbox queries
        this.filters = filters;
        const cached = this.getCache();
        if (cached) {
            return Promise.resolve(cached);
        }
        return new Promise((res, rej) => {
            api.get(`/stats?${this.getQueryStr(filters)}`)
                .then(d => {
                    if (d.problem) {
                        return rej(d.problem);
                    }
                    this.fillEmptyHours(d.data); // mutates data
                    this.setCache(d.data, filters);
                    return res(this.getCache());
                });
        })
      
    }
}
const network = new Network();
export default network;