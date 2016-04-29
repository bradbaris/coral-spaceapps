function setupmap1() {
    var resolutions = [ 0.5625 ];
    for(var i = 0; i < 15; ++i) {
        resolutions.push(resolutions[resolutions.length-1]*0.5);
    }

    var EPSG4326 = new L.Proj.CRS(
        "EPSG:4326",
        "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", {
            origin: [-180, 90],
            resolutions: resolutions,
            // Values are x and y here instead of lat and long elsewhere.
            bounds: [
               [-180, -90],
               [180, 90]
            ]
        }
    );

    // Seven day slider based off today, remember what today is
    var startday = new Date(2015,0,1);
    var ndays = 365;
    var pday = 0;
    var day = startday;

    var map = L.map("sstmap", {
        center: [21, -120],
        zoom: 3,
        maxZoom: 13,
        crs: EPSG4326,

        maxBounds: [
            [-120, -300],
            [120, 300]
        ]
    });

    map.scrollWheelZoom.disable()

    var autoplay = true;
    var clickspot = [0,0];
    map.on('mousedown', function(e){
        clickspot = [e.originalEvent.x, e.originalEvent.y];
    });

    map.on('mouseup', function(e){
        var dx = clickspot[0] - e.originalEvent.x;
        var dy = clickspot[1] - e.originalEvent.y;
        var d = dx*dx+dy*dy;
        var thresh = 15;
        if(d < thresh*thresh)
            autoplay = !autoplay;
    });


    var curweek;
    var layers = [];
    var z = 0;

    var template =
        "http://map1{s}.vis.earthdata.nasa.gov/wmts-geo/" +
        "{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.png";

    var createLayer = function(timestep,z) {
        var layer = L.tileLayer(template, {
            layer: "GHRSST_L4_MUR_Sea_Surface_Temperature",
            tileMatrixSet: "EPSG4326_1km",
            time: timestep,
            tileSize: 512,
            maxNativeZoom:6,
            subdomains: "abc",
            noWrap: false, // <-- hmm, make map wrap around? (hard to center on hawaii at edge)
            zIndex: 1,
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
    };


    function updateDay() {
        // Using the day as the cache key, see if the layer is already
        // in the cache.
        pday = pday % ndays;
        // console.log("pday=", pday);

        day = new Date(startday.valueOf() + 24 * 60 * 60 * 1000 * pday);//ui.value = (ui.value+1)%365;

        var timestep = day.toISOString().split("T")[0];
        $("#day-label").html(timestep);
        //$("#day-slider").slider('value', pday);
        var week = Math.floor(day.valueOf() / (1000 * 60 * 60 * 24 * 7));
        if(week == curweek)
            return;
        curweek = week;
        // console.log("week=",week)

        z = z+1;
        var layer = createLayer(timestep, z);
        layers.push(layer);//createLayer(timestep, z));
        map.addLayer(layer);
        while (layers.length > 5) {
            map.removeLayer(layers[0]);
            layers.shift();
        }
    };


    // Slider values are in "days from present".
    var sliderdiv = $("#day-slider");
    /*
    $("#day-slider").slider({
        value: 0,
        min: 0, // 13 * 365 = 13 years back
        max: 365,
        step: 7, // month increment
        slide: function(event, ui) {
            // Add the slider value (effectively subracting) to today's
            // updateDay.
            pday = ui.value;
            updateDay();
        }
    });
*/


    function autostep() {
        if (autoplay){
            pday = pday + 1;
            updateDay();
        }
        setTimeout(autostep, 200);
    }

    var landLayer = L.tileLayer('http://map1{s}.vis.earthdata.nasa.gov/wmts-geo/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.png', {
        layer: "Coastlines",
        tileMatrixSet: "EPSG4326_250m",
        time: '2015-01-01',
        tileSize: 512,
        subdomains: "abc",
        zIndex: 100000,
        maxNativeZoom: 8,
        opacity: 1.0,
        noWrap: false, // shouldnt this make it wrap-around?
        continuousWorld: true,
        bounds: [
            [-89.9999, -179.9999],
            [89.9999, 179.9999]
        ],
      attribution: '<a href=https://wiki.earthdata.nasa.gov/display/GIBS">NASA EOSDIS GIBS</a>&nbsp;&nbsp;&nbsp;<a href="https://github.com/nasa-gibs/web-examples/blob/release/examples/leaflet/time.js">View Source</a>'
    }).addTo(map);

  autostep();

}

$(setupmap1)
