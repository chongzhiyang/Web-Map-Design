// 1. Create a map object.
var mymap = L.map('map', {
    center: [38.8795608,-97.8296865],
    zoom: 5,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true});

// 2. Add a base map.
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// 3. Add cell towers GeoJSON Data
// Null variable that will hold cell tower data
var airPorts = null;


// 4. build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale('Set1').mode('lch').colors(9);

// 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 9; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

// Get GeoJSON and put on it on the map when it loads
airPorts= L.geoJson.ajax("assets/airports.geojson", {
    // assign a function to the onEachFeature parameter of the cellTowers object.
    // Then each (point) feature will bind a popup window.
    // The content of the popup window is the value of `feature.properties.company`
    onEachFeature: function (feature, layer) {
        layer.bindPopup('<h3>'+feature.properties.AIRPT_NAME+'</h3><p>State: '+feature.properties.STATE+'<br>County: '+feature.properties.COUNTY+'<br>City: '+feature.properties.CITY+'<br>Activation Date: '+feature.properties.ACT_DATE+'</p>');
    },
    pointToLayer: function (feature, latlng) {
        var id = 0;
        if (feature.properties.CNTL_TWR == "Y") { id = 0; }
        else { id = 1; } // N
        return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane  marker-color-' + (id + 1).toString() })});
    },
    attribution: 'Airports Data &copy; DATA.GOV | US states &copy; Mike Bostock of D3 | Base Map &copy; CartoDB | Made By Chongzhi Yang'
}).addTo(mymap);


// 6. Set function for color ramp
colors = chroma.scale('Oranges').colors(7); //colors = chroma.scale('RdPu').colors(5);

function setColor(density) {
    var id = 0;
    if (density > 30) { id = 6; }
    else if (density > 20 && density <= 30) { id = 5; }
    else if (density > 15 && density <= 20) { id = 4; }
    else if (density > 10 && density <= 15) { id = 3; }
    else if (density > 5 && density <= 10) { id = 2; }
    else  { id = 1; }
    return colors[id];
}


// 7. Set style function that sets fill color.md property equal to cell tower density
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

// 8. Add county polygons
// create counties variable, and assign null to it.
var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
    style: style
}).addTo(mymap);


// 9. Create Leaflet Control Object for Legend
var legend = L.control({position: 'topright'});

// 10. Function that runs when legend is added to map
legend.onAdd = function () {

    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b># of Airports</b><br />';
    div.innerHTML += '<i style="background: ' + colors[6] + '; opacity: 0.5"></i><p>31+</p>';
    div.innerHTML += '<i style="background: ' + colors[5] + '; opacity: 0.5"></i><p>21-30</p>';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>16-20</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>11-15</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 6-10</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 0- 5</p>';
    div.innerHTML += '<hr><b>Air Traffic Control Tower<b><br />';
    div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p> Yes</p>';
    div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> No</p>';
    // Return the Legend div containing the HTML content
    return div;
};

// 11. Add a legend to map
legend.addTo(mymap);

// 12. Add a scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);
