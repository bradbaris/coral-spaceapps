import ready from 'domready'
import data from '../data/coral_bleaching.csv'
require('./style.css')

ready(() => {

  const map_container = document.querySelector('#data-map')
  const map = L.map(map_container)

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.setView([20.622502259344817, -157.6153564453125], 8)

  data.forEach(result => {
    var colorSchema = '#2f2000'; // default
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

    if (bleachPer < 25 && bleachPer > 10) {
      colorSchema = 'darkest';
    } else if(bleachPer < 50 && bleachPer >= 25){
      colorSchema = 'dark';
    } else if (bleachPer < 75 && bleachPer >= 50) {
      colorSchema = 'medium';
    } else if (bleachPer <= 100 && bleachPer >= 75){
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
      // if (Data_Source === markerSet || markerSet === 'all') {
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
        leafMarker.addTo(map)
      }
    // }
  })
}); // end ready
