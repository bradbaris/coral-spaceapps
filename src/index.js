/* eslint console: 0*/
// import ready from 'domready';

// ready(() => document.querySelector('body').innerHTML = '<h1>Hello, World</h1>');
import papaparse from 'papaparse';

const completed = (results, file) => {
  console.log('file', file);
  console.log('results', results);
};

papaparse.parse('../data/coral_bleaching.csv', { complete: completed });

import ready from 'domready'
require('mapbox.js')
require('mapbox.js/theme/style.css')
require('initcss/lib/init.css')
import { MAPBOX_ACCESS_TOKEN } from './config.js'

L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN

ready(() => {
  const map_container = document.querySelector('#map')
  const map = L.mapbox.map(map_container, 'mapbox.streets')
  map.setView([20.396123272467616, -158.35693359375], 7)
})
