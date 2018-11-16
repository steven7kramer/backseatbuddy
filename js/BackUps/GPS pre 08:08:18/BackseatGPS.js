/*
    Title:      Backseat Buddy GPS
    Descr:      This file is responsible for handling all
                functionality that has something to do with
                a users location
    Author:     Cas Wognum
    Version:    0.1

-------------------------------------------------------------------

    NOTES:
    (1) For this to work on mobile devices and Chrome, you need to have an SSL (https://)

-------------------------------------------------------------------

*/

var map;
var geocoder;

// CONSTANTS
var MAXIMUM_DISTANCE = 600; //km
var POS_UPDATE_DELAY = 10; // ms
var POS_UPDATE_NUMDELTAS = 100; // ms

// For the users current position
var userLocation;
var userMarkerLocation;
var userMarker;
var canAnimateToNext = true;
var animationIteration;

// Timing
var currentTime = 0;
var previousTime = 0;
var delta = 600000;

// For opening and closing info window
var contentWindowOpenIndex = -1;
var contentWindowOpened = true;

var loadLocationArray;


// Function to initialize everything we need
function initialize() {
    initializeGoogleMapsAPI();
    getPOIFromDatabase();
}


// Function to create the objects we need for the Google Maps API
function initializeGoogleMapsAPI() {

    geocoder = new google.maps.Geocoder;

    var defaultPos = new google.maps.LatLng(52.126031, 4.664602); // Alphen aan den Rijn
    var defaultZoom = 7;

    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultPos,
        zoom: defaultZoom,
        disableDefaultUI: true,
        clickableIcons: false
    });

    // Get the users position
    if (window.navigator.geolocation) {
        navigator.geolocation.watchPosition(setPosition, handleGPSError, {enableHighAccuracy: true}); //getCurrentPosition
    } else {
        console.log("This browser does not support HTML5 Geolocation");
    }

    map.addListener('click', function(e) {
        contentWindowOpenIndex = -1;
        closeInfoWindow();
    });

    map.addListener('drag', function(e) {
        if (jQuery('#toggleBtnLocation').hasClass("active")) {
            jQuery('#toggleBtnLocation').removeClass("active");
            $("#toggleBtnLocationImg").attr("src", "images/icons/toggleGPS.png")
        }
    });

    map.addListener('zoom_changed', function(e) {
        if (jQuery('#toggleBtnLocation').hasClass("active")) {
            $("#toggleBtnLocationImg").attr("src", "images/icons/toggleGPS.png")
            jQuery('#toggleBtnLocation').removeClass("active");
        }
    });
}

// Function that is called when we can get the position of the user
function setPosition(position) {

    var iconBase = 'https://www.caswognum.nl/images/markers/';

    userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var d = new Date();
    previousTime = currentTime;
    currentTime = d.getTime();
    delta += currentTime - previousTime;

    // each 10 minutes
    if (delta > 600000) {
        checkProvince();
        delta = 0;
    }

    if (userMarker == undefined) {
        // Not clickable and not obstructing other markers
        var shape = {
            coord: [0, 0],
            type: 'poly'
        };

        userMarkerLocation = new google.maps.LatLng(userLocation.lat(), userLocation.lng());

        // Make current location marker
        userMarker = new google.maps.Marker({
              position: userMarkerLocation,
              map: map,
              icon: {
                url: "https://caswognum.nl/images/markers/pin-user.png",
                scale: 2,
                rotation: 90
            }
        });

        map.setCenter(userMarkerLocation);
        map.setZoom(16);

        if (!(jQuery('#toggleBtnLocation').hasClass("active"))) {
            $("#toggleBtnLocationImg").attr("src", "images/icons/toggleGPSactive.png")
            jQuery('#toggleBtnLocation').addClass("active");
        }


    } else {
        if (canAnimateToNext && !userMarkerLocation.equals(userLocation)) {
            canAnimateToNext = false;
            initializeAnimation(userMarkerLocation, userLocation);
        }
    }


}

// function to update current location smoothly
function initializeAnimation(current, goal) {
    animationIteration = 1;
    var deltaLat = (goal.lat() - current.lat()) / POS_UPDATE_NUMDELTAS;
    var deltaLng = (goal.lng() - current.lng()) / POS_UPDATE_NUMDELTAS;
    animateCurrentPositon(deltaLat, deltaLng);
}

function animateCurrentPositon(deltaLat, deltaLng) {
    var lat = userMarkerLocation.lat() + deltaLat;
    var lng = userMarkerLocation.lng() + deltaLng;
    userMarkerLocation = new google.maps.LatLng(lat, lng);
    userMarker.setPosition(userMarkerLocation);

    if (jQuery('#toggleBtnLocation').hasClass("active")) {
        map.setCenter(userMarkerLocation);
    }

    if (animationIteration < POS_UPDATE_NUMDELTAS) {
        animationIteration++;

        setTimeout(function() {
            animateCurrentPositon(deltaLat, deltaLng);
        }, POS_UPDATE_DELAY);
    } else {
        canAnimateToNext = true;
    }

    //stevens tryout
        //var lastPosn = userMarker.getPosition();
        //var heading = google.maps.geometry.spherical.computeHeading(lastPosn,userMarkerLocation);
        //var heading = 34;
        //icon.rotation = heading;
        //userMarkerLocation.setIcon(icon);
        //console.log(lastPosn);
        //console.log(heading);
        //console.log(icon);
    //eind stevenstryout
}

function checkProvince() {
    geocoder.geocode({'location': userLocation}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
                var addressComp = results[0].address_components;

                if (addressComp === undefined) {
                    console.warn("This is not a valid adress");
                    return;
                }

                var province;

                for (var i = 0; i != addressComp.length; ++i) {
                    for (var b = 0 ; b != addressComp[i].types.length; ++b) {
                        if (addressComp[i].types[b] == "administrative_area_level_1") {
                            province = addressComp[i].long_name;
                            break;
                        }
                    }
                }

                if (province === undefined) {
                    console.warn("No province found");
                } else {
                    jQuery.ajax({
                        type: "POST",
                        url: "../php/BackseatDB.php",
                        datatype: 'json',
                        data: {functionname: 'getCollectibles'},

                        success: function(obj, textstatus) {
                            var newCollectible = true;
                            if (!('error' in obj)) {
                                for (var i = 0; i != obj.collectibles.length; ++i) {
                                    if (obj.collectibles[i].cTitle == province) {
                                        newCollectible = false;
                                        break;
                                    }
                                }

                                if (newCollectible) {
                                    jQuery.ajax({
                                        type: "POST",
                                        url: "../php/BackseatDB.php",
                                        datatype: 'json',
                                        data: {functionname: 'addCollectible', collectible: province},

                                        success: function(obj2, textstatus) {
                                            if ('error' in obj2) {
                                                handleDBError(obj2.error)
                                            } else {
                                                alert("Je hebt een nieuwe collectible ontvangen: " + province + ". Ga snel naar je dashboard om hem te bekijken!");
                                            }
                                        }
                                    });
                                }
                            } else {
                                handleDBError(obj.error)
                            }
                        }
                    });
                }
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
}

// Function that is called when we can NOT get the position of the user
function handleGPSError(error) {

    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("ERROR: User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("ERROR: Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("ERROR: The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}


// Function to communicate with the DB to find all POI's
// INPUT: N.a.N
// OUTPUT: N.a.N
function getPOIFromDatabase()
{
    console.log("Accessing Database...");

    jQuery.ajax({
        type: "POST",
        url: "php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'getAll'},

        success: function(obj, textstatus) {
            if (!('error' in obj)) {
                createMarkers(obj.markers);
            } else {
                handleDBError(obj.error)
            }
        }
    });
}

// function to process the JSON containing the point details
function createMarkers(data) {
    console.log('Finished with the database: SUCCESS');
    console.log(data);
    var markers = [];
    var infoBubbles = [];

    for (var i = 0; i < data.length; i++) {
        var path = '../images/markers/pin'+data[i].pIcon+'.png';
        markers[i] = new google.maps.Marker({
              position: {lat: parseFloat(data[i].lat), lng: parseFloat(data[i].lng)},
              map: map,
              icon: path
        });

        markers[i].index = i;

     	//finally call the explicit infowindow object
    	markers[i].addListener('click', function(e) {
            openInfoWindow.call(e, data[this.index]);
    	})
    }

    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers,
         {imagePath: '../lib/MarkerClusters/icons/m'});
}

// function to handle an error trying to obtain the route details
function handleDBError(e) {
    console.error('Finished with the database: ERROR');
    console.error(e);
}

function openInfoWindow(data) {

    if (contentWindowOpenIndex == -1 || !contentWindowOpened) {
        timeout = 0;
    } else {
        timeout = 500;
    }

    closeInfoWindow();

    setTimeout(function(){

        if (contentWindowOpenIndex != data.pID) {

            loadLocationArray = data;

            var width = $( document ).width();
            var height = $( document ).height();
            var baseURLBanner = "url('../images/banners/"

            var imageUrl = baseURLBanner + data.pImage + "')";

            jQuery('#pImage').css('background-image', imageUrl);
            jQuery('#pCategory').text(data.pCategory.toUpperCase());
            jQuery('#pTitle').text(data.pTitle.toUpperCase());
            jQuery('#pSubtitle').text(data.pTitle.toUpperCase());
            jQuery('#pDescr').text(data.pDescr);

            var types = data.pType.replace(" ", "").split(',');
            var htmlString = "";
            //for (var i = 0; i < types.length; i++) {
              //  htmlString += '<img src="images/icons/' + types[i] + '.png" alt="' + types[i] + '">';
            //}
            jQuery('#pType').html(htmlString);

            loadLocation(data.lat, data.lng, data.pID, data.pTitle);

            if (width >= height) {
                $('#sideContent').css({'width': '400px', 'box-shadow': '5px 0px 8px #2b2b2b77'});
                $('.nowrap').css('width', 400 * 0.8 + "px");
                $('#followMeSection').css("right", "430px");
            } else {
                $('#sideContent').css('width', '100%');
                $('.nowrap').css('width', width * 0.8 + "px");
            }
            contentWindowOpened = true;
            contentWindowOpenIndex = data.pID;
        } else {
            contentWindowOpenIndex = -1;
            contentWindowOpened = false;
        }
    }, timeout);

}

// function to close the infowindow
function closeInfoWindow() {
    $('#sideContent').css({'width': '0', 'box-shadow': 'none'});
    $('#followMeSection').css("right", "30px");
    contentWindowOpened = false;
    contentWindowOpenIndex = -1;
}

function loadLocation() {
    var distanceCheck = checkDistanceToPOI(loadLocationArray.lat, loadLocationArray.lng);
    var gameUnlocked = false;

    jQuery.ajax({
        type: "POST",
        url: "php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'checkThirtyMinutes', pID: loadLocationArray.pID},

        success: function(obj, textstatus) {
            if ('error' in obj) {
                handleDBError(obj.error)
            } else {
                gameUnlocked = obj.gameUnlocked;
                if (distanceCheck < MAXIMUM_DISTANCE && distanceCheck != false) {
                    if (loadLocationArray.pIcon == 2) {
                        addThirtyMinutesToDatabase(loadLocationArray.pID);
                    }
                    if (loadLocationArray.pIcon != 0) {
                        jQuery('#pButton').attr('href', '/pages/POI/' + loadLocationArray.pTitle.toLowerCase() + '.php');
                        jQuery('#pButton').html('GA NAAR ' + loadLocationArray.pTitle.toUpperCase() + ' &#8594;');
                        jQuery('#pButton').removeClass('not-active');
                        jQuery('#pButton').css("color", "#000");
                        jQuery('#pReload').html('');
                    }
                    if (loadLocationArray.pIcon == 0) {
                        jQuery('#pButton').html('');
                        jQuery('#pReload').html('');
                    }
                    if (loadLocationArray.pIcon == 1) {
                        jQuery('#pButton').html('JE KUNT ' + loadLocationArray.pTitle.toUpperCase() + ' NU ZIEN!');
                        jQuery('#pButton').addClass('not-active');
                        jQuery('#pButton').css("color", "#000");
                        jQuery('#pReload').html('');
                    }
                } else if (distanceCheck == false){
                    jQuery('#pButton').attr('href', '#');
                    jQuery('#pButton').html('WE HEBBEN JE GPS LOCATIE NIET KUNNEN VINDEN');
                    jQuery('#pButton').addClass('not-active');
                    jQuery('#pButton').css("color", "#ddd");
                    jQuery('#pReload').attr('href', '#');
                    jQuery('#pReload').html('<a href="javascript:void(0)" onclick="loadLocation()">HERLAAD LOCATIE &#8635;</a>');
                    jQuery('#pReload').css("color", "#ddd");
                } else if (gameUnlocked && loadLocationArray.pIcon == 2) {
                    jQuery('#pButton').attr('href', '/pages/POI/' + loadLocationArray.pTitle.toLowerCase() + '.php');
                    jQuery('#pButton').html('GA NAAR ' + loadLocationArray.pTitle.toUpperCase() + ' &#8594;');
                    jQuery('#pButton').removeClass('not-active');
                    jQuery('#pButton').css("color", "#000");
                    jQuery('#pReload').html('');
                } else if (loadLocationArray.pIcon == 0){
                    jQuery('#pButton').attr('href', '#');
                    jQuery('#pButton').html('');
                    jQuery('#pReload').html('');
                }
                else if (loadLocationArray.pIcon == 1){
                    jQuery('#pButton').attr('href', '#');
                    jQuery('#pButton').html('JE KUNT DIT ZIEN OVER: ' + Math.round(distanceCheck-MAXIMUM_DISTANCE) + ' KM');
                    jQuery('#pButton').addClass('not-active');
                    jQuery('#pButton').css("color", "#ddd");
                    jQuery('#pReload').attr('href', '#');
                    jQuery('#pReload').html('<a href="javascript:void(0)" onclick="loadLocation()">HERLAAD AFSTAND &#8635;</a>');
                    jQuery('#pReload').css("color", "#ddd");
                }
                else if (loadLocationArray.pIcon >= 2){
                    jQuery('#pButton').attr('href', '#');
                    jQuery('#pButton').html('JE SPEELT DIT VRIJ OVER: ' + Math.round(distanceCheck-MAXIMUM_DISTANCE) + ' KM');
                    jQuery('#pButton').addClass('not-active');
                    jQuery('#pButton').css("color", "#ddd");
                    jQuery('#pReload').attr('href', '#');
                    jQuery('#pReload').html('<a href="javascript:void(0)" onclick="loadLocation()">HERLAAD AFSTAND &#8635;</a>');
                    jQuery('#pReload').css("color", "#ddd");
                }
            }
        }
    });

}



function addThirtyMinutesToDatabase(pID) {
    jQuery.ajax({
        type: "POST",
        url: "php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'addThirtyMinutes', pID: pID},

        success: function(obj, textstatus) {
            if ('error' in obj) {
                handleDBError(obj.error)
            }
        }
    });
}

 // Function to compute the distance between two latlng points (could also be done via API)
// Source: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
// Author: Haversina Formula
function checkDistanceToPOI(lat1, lon1) {
    if (userLocation == undefined) {
        return false;
    }

    var lat2 = userLocation.lat();
    var lon2 = userLocation.lng();

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km

    console.log("Distance computed (as the crow flies): " + d);

    return d
}


function deg2rad(deg) {
    return deg * (Math.PI/180)
}

jQuery(document).ready(function() {
    jQuery('#toggleBtnLocation').click(function() {

        $(this).toggleClass('active');

        if ($(this).hasClass('active')) {
            $("#toggleBtnLocationImg").attr("src", "images/icons/toggleGPSactive.png")
            map.panTo(userMarkerLocation);
        } else {
            $("#toggleBtnLocationImg").attr("src", "images/icons/toggleGPS.png")
        }
    });

});
