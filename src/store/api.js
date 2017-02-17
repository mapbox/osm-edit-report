import {create} from 'apisauce';


const  api = create({
    baseURL: 'https://osm-comments-api.mapbox.com/api/v1',
    headers: {'Accept': 'application/json'}
});

export default api;
