import { create } from 'apisauce';
// import cache from 'lscache';
import R from 'ramda';
import moment from 'moment';
const cache = new Map();

const api = create({
    baseURL: 'https://osm-comments-api.mapbox.com/api/v1',
    headers: { 'Accept': 'application/json' }
});
const filterByKey = (fn) => R.compose(R.fromPairs, R.filter(R.apply(fn)), R.toPairs);
const mapValues = R.curry((fn, obj) =>
    R.fromPairs(R.map(R.adjust(fn, 1), R.toPairs(obj))));
class Network {
    
    get(filters) {
        return this.apiGet(filters)
            .then(d => {
                if (filters.users) {
                    d = this.filterByUsers(d, filters)
                }
                if (filters.tags) {
                    d = this.filterByTags(d, filters);
                }
                return d;
            });
    }
    getQueryStr(filters) {
        var params = [];
        if (filters) {
            const { dateFrom, dateTo, bbox } = filters;
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

    filterByTags(data, filters) {
        // filter by tags
        const filterTags = (v) => filters.tags.indexOf(v) > -1;
        const filterEditByTag = (k, v) => {
            const tagsInEdits = R.keys(v.tags_created).concat(R.keys(v.tags_deleted), R.keys(v.tags_modified));
            const tagsFilter = filters.tags.split(',');
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
        return R.map(R.compose(R.map(removeOtherTags), filterByKey(filterEditByTag)), data);
    }
    filterByUsers(data, filters) {
        const filterFunc = (v) => filters.users.indexOf(v) > -1;
        return mapValues(filterByKey(filterFunc), data);
    }
    fillEmptyHours(data) {
        const hours = Object.keys(data).sort((a,b) => moment(a).diff(moment(b)));
        let hour = hours[0];
        const last = moment(hours[hours.length - 1]);
        while (!moment(hour).isAfter(last)) {
            const nextHour = moment(hour).add(1, 'hour').toISOString();
            if (!data[nextHour]) {
                data[nextHour] = {};
            }
            hour = nextHour;
        }
    }
    getCacheQueryStr(filters) {
        let dateFrom = filters.dateFrom.toISOString();
        let dateTo = filters.dateTo.toISOString();
        return `${dateFrom}&${dateTo}&${filters.bbox ? filters.bbox: ''}`;
    }
    apiGet(filters) {
        // avoids caching of bbox queries
        this.filters = filters;
        var cached = cache.get(this.getQueryStr(filters));
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
                    cache.set(this.getQueryStr(filters), d.data);
                    return res(d.data);
                });
        })
      
    }
}
const network = new Network();
export default network;