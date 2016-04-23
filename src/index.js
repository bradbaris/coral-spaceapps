import ready from 'domready'
require('mapbox.js')
require('mapbox.js/theme/style.css')
require('initcss/lib/init.css')
import { MAPBOX_ACCESS_TOKEN } from './config.js'

L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN

    var today = new Date(new Date() - 1728e5);
    var day = new Date(today.getTime());
    var dayParameter = function() {
        return day.toISOString().split("T")[0];
    };

ready(() => {
  const map_container = document.querySelector('#map')
  const map = L.mapbox.map(map_container, geoBathyLayer)
  map.setView([7, -123.5], 6)

  var seaSurfaceLayer = L.tileLayer('http://map1{s}.vis.earthdata.nasa.gov/wmts-geo/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.png', {
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

  var landLayer = L.tileLayer('http://map1{s}.vis.earthdata.nasa.gov/wmts-geo/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.png', {
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

  var geoBathyLayer = L.tileLayer('http://map1{s}.vis.earthdata.nasa.gov/wmts-geo/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpeg', {
    layer: "BlueMarble_ShadedRelief_Bathymetry",
    tileMatrixSet: "EPSG4326_500m",
    time: dayParameter(),
    tileSize: 512,
    subdomains: "abc",
    zIndex: 3,
    opacity: 1,
    noWrap: false, // shouldnt this make it wrap-around?
    continuousWorld: true,
    bounds: [
        [-89.9999, -179.9999],
        [89.9999, 179.9999]
    ],
    attribution: '<a href=https://wiki.earthdata.nasa.gov/display/GIBS">NASA EOSDIS GIBS</a>&nbsp;&nbsp;&nbsp;<a href="https://github.com/nasa-gibs/web-examples/blob/release/examples/leaflet/time.js">View Source</a>'
}).addTo(map);

  L.control.layers(
    {
      'Sea Surface Temperature': seaSurfaceLayer,
      'Geography/Ocean Depth': geoBathyLayer
    }, 
    {}
  ).addTo(map);

  // L.control.layers(layer s).addTo(map);
  L.control.scale().addTo(map);
})