// set view, I set it to California since I'm from there and we get earthquakes.
var map = L.map('map').setView([37.819286, -122.268805], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
// fetch and map geojson
d3.json(url)
    .then(data=>{
        // set color based on depth scale
        function getcolor(depth) {
            if (depth <= 10){return '#00FF00'}
            else if (depth <= 30){return '#7FFF00'}
            else if (depth <= 50){return '#FFFF00'}
            else if (depth <= 70){return '#FFBF00'}
            else if (depth <= 90){return '#FF7F00'}
            else {return '#FF0000'}
        }
        // create legend
        var legend = L.control({ position: 'bottomright' });

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            let colors=['#00FF00','#7FFF00','#FFFF00','#FFBF00','#FF7F00','#FF0000']
            let grades=[0,10,30,50,70,90]
            // Looping through our intervals to generate a label with a colored square for each interval.
            for (let i = 0; i < grades.length; i++) {
                div.innerHTML += 
                    "<i style='background: " + colors[i] + "'></i> " +
                    grades[i] + 
                    (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
            return div;
        };

        legend.addTo(map);

        L.geoJSON(data, {
            // add markers to map
            pointToLayer: function (feature,coord){
                var circleSize = feature.properties.mag;
                var depth = feature.geometry.coordinates[2];

                var circleMarker = L.circleMarker(coord, {
                    radius: circleSize*2,
                    fillColor: getcolor(depth),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
                // pop up that displays info when user clicks a marker
                circleMarker.bindPopup('Magnitude: ' + circleSize + ', Depth: ' + depth + ', Location: ' + feature.properties.place);
                return circleMarker;
                    }

        }
            ).addTo(map)
    }).catch(error=>{
        console.error(error);
    })
