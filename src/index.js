/* global L, $ */
import data from '../data/coral_bleaching.csv';
import papaparse from 'papaparse';
import ready from 'domready';
import _ from 'lodash';
require('mapbox.js');
require('mapbox.js/theme/style.css');
require('initcss/lib/init.css');
require('./time.css');
import { MAPBOX_ACCESS_TOKEN } from './config.js';

L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;

const today = new Date(new Date() - 1728e5);
let day = new Date(today.getTime());
const dayParameter = () => {
  return day.toISOString().split('T')[0];
};

// ready(() => {
//   const map_container = document.querySelector('#map');
//   const map = L.mapbox.map(map_container, 'mapbox.streets');
//   map.setView([20.396123272467616, -158.35693359375], 7);
// });


const map_container = document.querySelector('#map')
const map = L.mapbox.map(map_container, geoBathyLayer)
map.setView([7, -123.5], 6);

// const genMarker = (lat, long) => {
//   const marker =
//   return marker;
//   // marker.addTo(mapEle);
// };

const completed = (results, file) => {
  console.log('file', file);
  console.log('results', results);
  results.data.shift();
  results.data.pop();
  _.forEach(results.data, (result) => {
    if (result[13] !== null && result[14] !== null) {
      // console.log('result[13], result[14', result[13], result[14]);
      const leafMarker = L.marker(new L.latLng([result[13], result[14]]), {
        icon: L.mapbox.marker.icon({
          'marker-size': 'large',
          'marker-symbol': 'bus',
          'marker-color': '#fa0',
        }),
      });
      console.log('leafMarker', leafMarker);
      leafMarker.addTo(map);
    }
  });
};

papaparse.parse(data, { complete: completed });

const seaSurfaceLayer = L.tileLayer('http://map1{s}.vis.earthdata.nasa.gov/wmts-geo/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.png', {
  layer: "GHRSST_L4_MUR_Sea_Surface_Temperature",
  tileMatrixSet: "EPSG4326_1km",
  time: dayParameter(),
  tileSize: 512,
  subdomains: "abc",
  zIndex: 1,
  opacity: 1,
  noWrap: false, // shouldnt this make it wrap-around?
  continuousWorld: true,
  bounds: [
      [-89.9999, -179.9999],
      [89.9999, 179.9999]
  ],
  attribution: '<a href=https://wiki.earthdata.nasa.gov/display/GIBS">NASA EOSDIS GIBS</a>&nbsp;&nbsp;&nbsp;<a href="https://github.com/nasa-gibs/web-examples/blob/release/examples/leaflet/time.js">View Source</a>'
}).addTo(map);

const landLayer = L.tileLayer('http://map1{s}.vis.earthdata.nasa.gov/wmts-geo/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.png', {
  layer: "OSM_Land_Mask",
  tileMatrixSet: "EPSG4326_250m",
  time: dayParameter(),
  tileSize: 512,
  subdomains: "abc",
  zIndex: 2,
  opacity: 1.0,
  noWrap: false, // shouldnt this make it wrap-around?
  continuousWorld: true,
  bounds: [
      [-89.9999, -179.9999],
      [89.9999, 179.9999]
  ],
  attribution: '<a href=https://wiki.earthdata.nasa.gov/display/GIBS">NASA EOSDIS GIBS</a>&nbsp;&nbsp;&nbsp;<a href="https://github.com/nasa-gibs/web-examples/blob/release/examples/leaflet/time.js">View Source</a>'
}).addTo(map);

const geoBathyLayer = L.tileLayer('http://map1{s}.vis.earthdata.nasa.gov/wmts-geo/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpeg', {
  layer: "BlueMarble_ShadedRelief_Bathymetry",
  tileMatrixSet: "EPSG4326_500m",
  time: dayParameter(),
  tileSize: 512,
  subdomains: 'abc',
  zIndex: 3,
  opacity: 1,
  noWrap: false, // shouldnt this make it wrap-around?
  continuousWorld: true,
  bounds: [
    [-89.9999, -179.9999],
    [89.9999, 179.9999],
  ],
  attribution: '<a href=https://wiki.earthdata.nasa.gov/display/GIBS">NASA EOSDIS GIBS</a>&nbsp;&nbsp;&nbsp;<a href="https://github.com/nasa-gibs/web-examples/blob/release/examples/leaflet/time.js">View Source</a>',
}).addTo(map);

L.control.layers({
  'Sea Surface Temperature': seaSurfaceLayer,
  'Geography/Ocean Depth': geoBathyLayer,
},
{}
).addTo(map);

// L.control.layers(layer s).addTo(map);
L.control.scale().addTo(map);


// Slider values are in "days from present".
$("#day-slider").slider({
  value: 0,
  min: -4745, // 13 * 365 = 13 years back
  max: 0,
  step: 30, // month increment
  slide: (event, ui) => {
    // Add the slider value (effectively subracting) to today's
    // date.
    const newDay = new Date(today.getTime());
    newDay.setUTCDate(today.getUTCDate() + ui.value);
    day = newDay;
    console.log(day);
    // update();
  },
});
