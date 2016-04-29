import ready from 'domready'
import data from '../data/coral_bleaching.csv'
require('./style.css')
// require('initcss/lib/init.css')

ready(() => {

  const map_container = document.querySelector('#data-map')
  const map = L.map(map_container)

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.setView([20.622502259344817, -157.6153564453125], 8)

  const first = createLayer('1')
  const second = createLayer('2')
  const third = createLayer('3')

  const layers = L.layerGroup([first, second, third]).addTo(map)

  const all_layers = [first, second, third]

  function createLayer(Data_Source) {
    const markers =
      data
        .filter(result => result.Data_Source === Data_Source)
        .map(genMarker)

    return L.featureGroup(markers)
  }

  function genMarker(result) {
    var colorSchema = 'darkest'; // default
    const {
      Mean_Total_Live_Coral,
      CentroidLat,
      CentroidLon,
      Data_Source,
      Mean_Bleached
    } = result;

    var bleachPer = parseInt(result.Mean_Bleached);
    var markerSet; // will be set using jquery;
    markerSet = $('.dataSet').val();

    if (bleachPer < 25) {
      colorSchema = 'darkest';
    } else if(bleachPer < 50){
      colorSchema = 'dark';
    } else if (bleachPer < 75) {
      colorSchema = 'medium';
    } else {
      colorSchema = 'white';
    }

    const size = parseInt(Mean_Total_Live_Coral)

    if (CentroidLat !== undefined && CentroidLon !== undefined) {
      var iconSize, markSize;
      if (size > 66) {
        iconSize = 20
        markSize = 'large'
      } else if (size <= 66 && size > 33) {
        iconSize = 15
        markSize = 'medium'
      } else {
        iconSize = 10
        markSize = 'small'
      }
      const icon = L.divIcon({
        className: `marker size--${markSize} color--${colorSchema}`,
        iconSize
      });

      var leafMarker = L.marker([parseFloat(CentroidLat), parseFloat(CentroidLon)], {
        icon,
        properties: {
          'liveCoral': result.Mean_Total_Live_Coral,
          'paleCoral': result.Mean_Pale,
          'bleachedCoral': result.Mean_Bleached,
          'paleBleachSum': result.Pale_Bleached_Sum
        }
      })
      leafMarker.bindPopup(`Coverage: ${Mean_Total_Live_Coral}% <br/> Bleached: <b> ${Mean_Bleached} %</b>`);
      leafMarker.on('mouseover', function(e) {
        this.openPopup();
      });
      leafMarker.on('mouseout', function(e) {
        this.closePopup();
      });
      return leafMarker
    }
  }

  document.querySelector('.dataSet').addEventListener('change', function() {
    layers.clearLayers()
    all_layers.forEach((layer, i) => {
      if(this.value === 'all') {
        layers.addLayer(layer)
        return
      }
      if(i != parseInt(this.value) - 1) {
        layers.removeLayer(layer)
      } else {
        layers.addLayer(layer)
      }
    })
  })
}); // end ready
