/* global L*/
import ready from 'domready';
require('mapbox.js');
require('mapbox.js/theme/style.css');
require('initcss/lib/init.css');
import data from '../data/coral_bleaching.csv';
import papaparse from 'papaparse';
import { MAPBOX_ACCESS_TOKEN } from './config.js';

L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;

ready(() => {
  const map_container = document.querySelector('#map');
  const map = L.mapbox.map(map_container, 'mapbox.streets');
  map.setView([20.396123272467616, -158.35693359375], 7);
});

const genMarker = (lat, long, map) => {
  const marker = L.marker([lat, long], {
    icon: L.mapbox.marker.icon({
      'marker-size': 'large',
      'marker-symbol': 'bus',
      'marker-color': '#fa0',
    }),
  });
  marker.addTo(map);
};

const completed = (results, file) => {
  console.log('file', file);
  console.log('results', results);
};

papaparse.parse(data, { complete: completed });
