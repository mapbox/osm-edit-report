import React from 'react';
import debounce from 'lodash.debounce';

export default class MapSelect extends React.Component {
    componentDidMount() {
        if (window.mapboxgl) {
            window.mapboxgl.accessToken = 'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ';
            let parent = document.querySelector('.filters-bar')
            let width = (parent && parent.clientWidth - 20);
            
            document.querySelector('#map').style.width = width + 'px';
            
            this.map = new window.mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/light-v9',
                center: [-122.4237, 37.7682],
                zoom: 4
            });
          
            this.map.on('load', () => {
                if (this.props.filterValues && this.props.filterValues.bbox) {
                    const bbox = this.props.filterValues.bbox.split(',');
                    this.map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
                }
            });
            // this.map.on('dragend', this.mapLock);
            // this.map.on('zoomend', this.mapLock);
        }
    }
    getSWNE = () => {
        let bounds = this.map.getBounds(); // ne, sw / lat, lng
        let s = bounds.getSouth();
        let w = bounds.getWest();
        let n = bounds.getNorth();
        let e = bounds.getEast();
        return [w, s, e, n].join(',');
    }
    mapLock = () => {
        if (this.props.filterValues.bbox) { return this.clearBbox() };
        let filterValues = this.props.filterValues;
        filterValues.bbox = this.getSWNE();
        this.props.onChange(filterValues);
    }
    clearBbox = () => {
        let filterValues = this.props.filterValues;
        filterValues.bbox = undefined;
        this.props.onChange(filterValues);
    }
    render() {
        const bboxLocked = this.props.filterValues.bbox;
        const styleLock = bboxLocked ? 'bg-orange-faint color-orange-dark ' : 'bg-purple-light color-purple-dark';
        return (
            <div className="map-select">
                <div onClick={this.mapLock} className={`pointer map-clear z5 ${styleLock}  inline-block px6 py3 txt-xs txt-bold round-full fr`}>
                    {bboxLocked ? 'Clear' : 'Apply'}
                </div>
                <div id="map" style={{height: 300 }}>
                </div>
            </div>
        )
    }
}