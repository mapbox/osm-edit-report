import React from 'react';

export default class MapSelect extends React.Component {
    comonentDidMount() {
        if (mapboxgl) {
            mapboxgl.accessToken = 'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ';
            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/light-v9',
                center: [-122.4237, 37.7682],
                zoom: 11,
                hash: true
            });
        }
    }
    render() {
        return (
            <div className="map" id="map"> This is a map</div>
        )
    }
}