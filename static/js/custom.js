var markers = [];
var coordinates = [];
var radii = [];
var jsonData = [];

$(function () {

    function initMap() {

        //the center of the map (currently Georgia Tech!) 
        var location = new google.maps.LatLng(33.7756, -84.3963);

        var mapCanvas = document.getElementById('wideMap');
        var mapOptions = {
            center: location,
            zoom: 12,
            //panControl: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(mapCanvas, mapOptions);

        // var markerImage = '../img/png/marker.png';
        // var markerImage = 'marker.png';


        // For showing some info on markers
        // Maybe I will use it in the future ;)
        var contentString = '<div class="info-window">' +
                '<h3>Info Window Content</h3>' +
                '<div class="info-content">' +
                '<p> some information! </p>' +
                '</div>' +
                '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 400
        });

        // marker.addListener('click', function () {
        //     infowindow.open(map, marker);
        // });


        //Listener on click (to pick a point)
        google.maps.event.addListener(map, 'click', function(event) {
            placeMarker(event.latLng);
            var latitude = event.latLng.lat();
            var longitude = event.latLng.lng();
            coordinates.push([latitude,longitude]);
            
            console.log( latitude + ', ' + longitude );

            radius = new google.maps.Circle({map: map,
                radius: 1000,
                center: event.latLng,
                fillColor: '#777',
                fillOpacity: 0.6,
                strokeColor: '#AA0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                draggable: false,   // Dragable
                editable: true      // Resizable
            });
            radii.push(radius);          

            // Center of map
            map.panTo(new google.maps.LatLng(latitude,longitude));
        });

        function placeMarker(location) {
            var marker = new google.maps.Marker({
                position: location, 
                map: map   
                // ,icon: markerImage
            });
            
            // Remove the previous marker
            if (markers.length>0){
                tmp=markers.pop();
                tmp.setMap(null);
                tmp=radii.pop();
                tmp.setMap(null);
                tmp=coordinates.pop();
            }
            markers.push(marker);
        }

        // var styles = [{"featureType": "landscape", "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]}, {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]}, {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]}, {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}];
        // map.set('styles', styles);
    }

    google.maps.event.addDomListener(window, 'load', initMap);

    // AJAX Commnications
    $('#button1').click(function(){
        var beds  = $('#no_beds').val();
        var baths = $('#no_baths').val();
        var area  = $('#area').val();
        var resv  = $('#param').val();

        console.log("READ: beds= "+beds+" | baths= "+baths+" | area= "+area);
        console.log("coordinates"+coordinates[0]);
        console.log("radii= "+radii[0].radius);
        console.log("clicked");
        
        //DATA SENT TO SERVER
        jsonData = {"beds": beds,
                    "baths": baths,
                    "area": area,
                    "resv": param,
                    "point": coordinates[0],
                    "radius": radii[0].radius
                    };

        $.ajax({
            url: '/testFrontend',
            contentType: 'application/json',
            data: jsonData,
            type: 'POST',
            
            success: function(response){
                console.log("successfully received response from server");
                $('#outputs').append('<p id="res"> successfully communicated</p>');
                
            },
            error: function(error){
                console.log("No response from server/No connection :(");
                $('#outputs').html(error);
            }

        });

    });

});


function addMarker(location){
    var marker = new google.maps.Marker({
    position: location,
    map: map
    });
    markers.push(marker);
}

