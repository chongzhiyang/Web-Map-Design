// 1. Create a map object.
var mymap = L.map('map', {
    center: [53.7146836,-111.5927674],
    zoom: 4,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true});

// 2. Add a base map.
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// 3. Add cell towers GeoJSON Data
// Null variable that will hold cell tower data
var airPorts = null;
// Get GeoJSON and put on it on the map when it loads
airPorts= L.geoJson.ajax("assets/airports.geojson",{
    attribution: 'All Airports in the U.S. | Base Map &copy; CartoDB | Made By Chongzhi Yang'
});
// Add the cellTowers to the map.
airPorts.addTo(mymap);
