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

    pId
    0 = parking
    1 = viewPoint
    2 = game
    3 = infoPoint
    4 = quiz

-------------------------------------------------------------------

*/

var map;
var geocoder;

// CONSTANTS
var POS_UPDATE_DELAY = 10; // ms
var POS_UPDATE_NUMDELTAS = 100; // ms

// Set the unlocking distance for each individual pIcon in km
// 0 and 3, parking and infoPoint,  will stay at the default distance of 5
var maxDistPOI = function(pIcon){
  $.getScript('/js/BackseatGeneral.js', function(){
    return maxDistPOI(pIcon);
  });
  return;
}

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


        jQuery.ajax({
            type: "POST",
            url: "../php/BackseatDB.php",
            datatype: 'json',
            data: {functionname: 'customCar'},

            success: function(data) {
                if ('error' in data) {
                    handleDBError(data.error)
                } else {
                  var type = data.customCar[0].carType;
                  var colour = data.customCar[0].carColour;

                  $.ajax({
                    url: 'lib/carTypes/car' + type + '.txt', // file with the svg path of the car
                    dataType: 'text', // type of file (text, json, xml, etc)
                    success: function(data) { // callback for successful completion
                      var carType = data;
                      var carColour = colour;
                      var firstTimeMarker;

                      //push both variables to make the marker
                      //only once
                      if(firstTimeMarker != false){
                        firstTimeMarker = false;
                        makeMarker(carType, carColour);
                      }
                    },
                    error: function() { // callback if there's an error
                      alert("error");
                    }
                  });

                }
            }
        });

        // Make current location marker
        function makeMarker(carType, carColour){
            userMarker = new google.maps.Marker({
                  position: userMarkerLocation,
                  map: map,
                  icon: {
                    path: carType,
                    scale: .1,
                    fillColor: carColour,
                    fillOpacity: 1,
                    rotation: 90,
                    anchor: new google.maps.Point(256,256)

                }
            });
        }

        map.setCenter(userMarkerLocation);
        //map.setZoom(16);
        map.setZoom(6); //for testing purposes


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
    let targetRotation = Math.round(getBearing(lat, lng, userLocation.lat(), userLocation.lng())); //get bearing through calculations before userMarker is updated
    userMarkerLocation = new google.maps.LatLng(lat, lng);
    userMarker.setPosition(userMarkerLocation);

    if (jQuery('#toggleBtnLocation').hasClass("active")) {
        map.setCenter(userMarkerLocation);
    }

    rotateIcon(targetRotation);

    if (animationIteration < POS_UPDATE_NUMDELTAS) {
        animationIteration++;

        setTimeout(function() {
            animateCurrentPositon(deltaLat, deltaLng);
        }, POS_UPDATE_DELAY);
    } else {
        canAnimateToNext = true;
    }
}

//function to rotate icon based on movement direction using bearing
function rotateIcon(targetRotation){
    //declare the userIcon from the userMarker
    var userIcon = userMarker.getIcon();
    userMarker.setIcon(userIcon);
    let userRotation = userMarker.icon.rotation;

    // set rotation of the icon based on the calculated targetrotation
    userMarker.icon.rotation = targetRotation;
}

//start of bearing calculations
function radians(n) {
  return n * (Math.PI / 180);
}
function degrees(n) {
  return n * (180 / Math.PI);
}

function getBearing(startLat,startLong,endLat,endLong){
  startLat = radians(startLat);
  startLong = radians(startLong);
  endLat = radians(endLat);
  endLong = radians(endLong);

  var dLong = endLong - startLong;

  var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
  if (Math.abs(dLong) > Math.PI){
    if (dLong > 0.0)
       dLong = -(2.0 * Math.PI - dLong);
    else
       dLong = (2.0 * Math.PI + dLong);
  }

  return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
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
            locationDenied();
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

function locationDenied(){
  window.location.replace('pages/locationDenied.php');
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

        //listener for mouseOver and Out of marker for animation purposes
        markers[i].addListener('mouseover', function() {

        });
        markers[i].addListener('mouseout', function() {

        });
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
            var baseURLBanner = "url('../images/banners/";

            var imageUrl = baseURLBanner + data.pImage + "')";

            jQuery('#pImage').css('background-image', imageUrl);
            jQuery('#pCategory').text(data.pCategory.toUpperCase());
            jQuery('#pTitle').text(data.pTitle.toUpperCase());
            jQuery('#pSubtitle').text(data.pTitle.toUpperCase());
            jQuery('#pDescr').text(data.pDescr);

            var types = data.pIcon.replace(" ", "").split(',');
            var htmlString = "";
            //for (var i = 0; i < types.length; i++) {
              //  htmlString += '<img src="images/icons/' + types[i] + '.png" alt="' + types[i] + '">';
            //}
            jQuery('#pIcon').html(htmlString);

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
                designInfowindowButton(loadLocationArray.pIcon, gameUnlocked, distanceCheck);
            }
            }
    });
}

//in the next part, the buttons in the bottom of the infoWindows are designed based on their icon and distance.
function designInfowindowButton(pIcon, gameUnlocked, distanceCheck){
    let buttonState = false; //false means button is not-active, either because the user is too far or GPS not detected
    let buttonString = '';

    if (distanceCheck < maxDistPOI(pIcon) && distanceCheck != false) {
        buttonState = true;
    }else if(distanceCheck > maxDistPOI(pIcon)){
        buttonState = false;
    }else if(distanceCheck == false){
        buttonState = false;
        buttonString = 'WE HEBBEN JE GPS LOCATIE NIET KUNNEN VINDEN.';
        designInactiveButton(distanceCheck);
    }

    if(buttonState == false && distanceCheck != false){

            if (pIcon == 0){
                buttonString = 'JE BENT HIER OVER: ' + distanceString();
            }else if(pIcon == 1){
                buttonString = 'JE KUNT DIT ZIEN OVER: ' + distanceString();
            }else if (pIcon >= 2){
                buttonString = 'JE SPEELT DIT VRIJ OVER: ' + distanceString();
            }

            designInactiveButton(distanceCheck);//design when user is not within playing distance of infoWindow - buttonState = false

        }else if(buttonState == true){//design of active button
                jQuery('#pButton').css("color", "#000");

            if (pIcon != 0 && pIcon != 1){
                addThirtyMinutesToDatabase(loadLocationArray.pID);
                if(pIcon == 2){
                    jQuery('#pButton').attr('href', '/pages/POI/' + loadLocationArray.pCategory.toLowerCase().split(' ').join('_') + '.php?id=' + loadLocationArray.pID);
                }else if(pIcon == 3){
                    jQuery('#pButton').attr('href', '/pages/POI/info.php?id=' + loadLocationArray.contentID);
                }else if(pIcon == 4){
                    jQuery('#pButton').attr('href', '/pages/POI/quiz.php?id=' + loadLocationArray.contentID);
                }
                jQuery('#pButton').html('GA NAAR ' + loadLocationArray.pTitle.toUpperCase() + ' &#8594;');
                jQuery('#pButton').removeClass('not-active');
                jQuery('#pReload').html('');
            }
            if(pIcon == 1 || pIcon == 0){
                if (pIcon == 1){
                    jQuery('#pButton').html('JE KUNT ' + loadLocationArray.pTitle.toUpperCase() + ' NU ZIEN!');
                }else if(pIcon == 0){
                    jQuery('#pButton').html('JE BENT IN DE BUURT!');
                }
                jQuery('#pButton').addClass('not-active');
                jQuery('#pReload').html('');
            }
        }

    function distanceString(){
        distanceNumber = distanceCheck-maxDistPOI(pIcon);

        if(distanceNumber > 1){
            return Math.round(distanceNumber) + ' KM';
        }else{
            return Math.round(distanceNumber*1000) + ' M';//convert km to meters from 1km
        }
    }

    function designInactiveButton(){
            jQuery('#pButton').attr('href', '#');
            jQuery('#pButton').html(buttonString);
            jQuery('#pButton').addClass('not-active');
            jQuery('#pButton').css("color", "#ddd");
            jQuery('#pReload').attr('href', '#');
            jQuery('#pReload').css("color", "#ddd");
        if(distanceCheck){
            jQuery('#pReload').html('<a href="javascript:void(0)" onclick="loadLocation()">HERLAAD AFSTAND &#8635;</a>');
        }else{
            jQuery('#pReload').html('<a href="javascript:void(0)" onclick="loadLocation()">PROBEER OPNIEUW &#8635;</a>');
        }
    }
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
