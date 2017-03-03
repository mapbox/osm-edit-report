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
    get(params) {
        return this.apiGet(params);
    }
    cacheData(data, str) {
        cache.set(str, data, 1);
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
    apiGet(params) {
        const paramStr = params.length > 0 ? params.join('&') : '';
        // avoids caching of bbox queries
        const cached = cache.get(paramStr);
        if (cached) {
            return Promise.resolve(cached);
        }
        return new Promise((res, rej) => {
            api.get(`/stats?${paramStr}`)
                .then(d => {
                    if (d.problem) {
                        return rej(d.problem);
                    }
                    this.fillEmptyHours(d.data); // mutates data
                    this.cacheData(d.data, paramStr);
                    return res(d.data);
                });
        })
      
    }
}
const network = new Network();
export default network;