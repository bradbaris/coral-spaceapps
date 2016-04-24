import ready from 'domready'
require('mapbox.js')
require('mapbox.js/theme/style.css')
require('initcss/lib/init.css')
require('./style.css')
import { MAPBOX_ACCESS_TOKEN } from './config.js'
import papaparse from 'papaparse';
import _ from 'lodash';
import data from '../data/coral_bleaching.csv'
L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN

const MIN = -4745;


ready(() => {

  var cache = {}
  var today = new Date(new Date() - 1728e5)
  var day = new Date(today.getTime())
  var dayParameter = function() {
    return day.toISOString().split("T")[0]
  };

  const map_container = document.querySelector('#map')
  const map = L.mapbox.map(map_container, 'mapbox.streets-satellite')
  map.setView([7, -123.5], 6)
  var markMap = L.mapbox.tileLayer('mapbox.streets-satellite').addTo(map);

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
  markMap.on('load', () => {
    papaparse.parse(data, { complete: completed });
  })
  const completed = (results, file) => {
    console.log('file', file);
    console.log('results', results);
    results.data.shift();
    results.data.pop();
    var geoJSON = [];
    _.forEach(results.data, (result) => {
      var colorSchema = '#2f2000'; // default
      var bleachPer = parseInt(result[17]);
      // csonsole.log('results[17]',bleachPer);
      if (bleachPer < 25 && bleachPer > 10) {
        colorSchema = '#6D4B08';
      } else if(bleachPer < 50 && bleachPer >= 25){
          colorSchema = '#AA8439';
      } else if (bleachPer < 75 && bleachPer >= 50) {
        colorSchema = '#E7C889';
      } else if (bleachPer <= 100 && bleachPer >= 75){
        colorSchema = '#FFF3DA';
      }
      if (result[13] !== undefined && result[14] !== undefined) {
        // console.log('result[13], result[14', result[13], result[14]);
        // const leafMarker = L.marker(new L.latLng([result[13], result[14]]), {
        //   icon: L.mapbox.marker.icon({
        //     'marker-size': 'large',
        //     'marker-symbol': 'bus',
        //     'marker-color': colorSchema,
        //   }),
        //   properties: {
        //     'liveCoral': result[15],
        //     'paleCoral': result[16],
        //     'bleachedCoral': result[17],
        //     'paleBleachSum': result[18]
        //   },
        // });
        // console.log('leafMarker', leafMarker);
        // leafMarker.addTo(map);
        var temp = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [result[13],result[14]],
          },
          "properties": {
            "title": "Hawaii Island Point",
            "description": result[13] + ' ' + result[14],
            "marker-color": colorSchema,
            "marker-size": "large",
            "marker-symbol": "rocket",
          }
        }
        geoJSON.push(temp);
      }
    });
    console.log('geoJSON',geoJSON);
    //var markerLayer =  L.mapbox.featureLayer().addTo(map)
    var layer = L.mapbox.featureLayer().addTo(map);
    console.log('markerLayer',layer, map);
    layer.setGeoJSON(geoJSON)
  };

  var baseLayers =
    {
      'Marker': markMap,
      'Sea Surface Temperature': seaSurfaceLayer,
      'Geography/Ocean Depth': geoBathyLayer
    };

  var controlLayers = L.control.layers(baseLayers).addTo(map);

  // Slider values are in "days from present".
  const slider = $("#day-slider").slider({
      value: 0,
      min: MIN,
      max: 0,
      step: 30, // month increment
      slide: function(event, ui) {
        // Add the slider value (effectively subracting) to today's
        // date.
        var newDay = new Date(today.getTime());
        newDay.setUTCDate(today.getUTCDate() + ui.value);
        day = newDay;
        update();
      }
  });

  var update = function() {
      // Using the day as the cache key, see if the layer is already
      // in the cache.
      var key = dayParameter();
      var layer = cache[key];

      // If not, create a new layer and add it to the cache.
      if ( !layer ) {
          layer = createLayer();
          cache[key] = layer;
      }

      // There is only one layer in this example, but remove them all
      // anyway
      clearLayers();

      // Add the new layer for the selected time
      map.addLayer(layer);

      // Update the day label
      $("#day-label").html(dayParameter());
  };

  var clearLayers = function() {
      map.eachLayer(function(layer) {
          map.removeLayer(layer);
      });
  };

    var mapIcon = L.divIcon({className: 'mapmarker'});
    map.on('click', function(e){
        var marker = new L.marker(e.latlng, {icon: mapIcon}).addTo(map);
        var popLocation= e.latlng;
        var popup = L.popup()
        .setLatLng(popLocation)
        .setContent('<p class="popup">Enter<br>Coral<br>Bleaching<br>Data<p>')
        .openOn(map);
    });

  var mapGroup;
  var createLayer = function() {

        var layer = L.tileLayer("http://map1{s}.vis.earthdata.nasa.gov/wmts-geo/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.png", {
            layer: "GHRSST_L4_MUR_Sea_Surface_Temperature",
            tileMatrixSet: "EPSG4326_1km",
            time: dayParameter(),
            tileSize: 512,
            subdomains: "abc",
            noWrap: false, // <-- hmm, make map wrap around? (hard to center on hawaii at edge)
            continuousWorld: true,
            // Prevent Leaflet from retrieving non-existent tiles on the
            // borders.
            bounds: [
                [-89.9999, -179.9999],
                [89.9999, 179.9999]
            ],
            attribution:
              "<a href='https://wiki.earthdata.nasa.gov/display/GIBS'>" +
              "NASA EOSDIS GIBS</a>&nbsp;&nbsp;&nbsp;" +
              "<a href='https://github.com/nasa-gibs/web-examples/blob/release/examples/leaflet/time.js'>" +
              "View Source" +
              "</a>"
        });
        return layer;
        update();

    let slider_animation = MIN;
    let DELAY = 50;
    let foo = 0;

    function step(timestamp) {
      if(slider_animation < 0) {
        if(foo++ % DELAY == 0) {
          var newDay = new Date(today.getTime());
          newDay.setUTCDate(today.getUTCDate() + slider_animation);
          day = newDay;
          console.log(day)
          $('#day-slider').slider('value', slider_animation += 14);
          update()
        }
        window.requestAnimationFrame(step);
      }
    }
  }
})
