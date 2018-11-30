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
  /*switch(pIcon) {
    case '1': return 1; break;
    case '2': return 10; break;
    case '4': return 7; break;
    default: return 5;
  };*/
  return 1000; //for development
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

        // Make current location marker
        userMarker = new google.maps.Marker({
              position: userMarkerLocation,
              map: map,
              icon: {
                //url: "https://caswognum.nl/images/markers/pin-user.png",
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 5,
                strokeColor: '#e83273',
                rotation: 90,
                anchor: new google.maps.Point(0,2)

                //path try-out
                //path: 'M178.471,107.469c-0.036,0.001-0.15,0.018-0.24,0.02   c-0.878,0.019-3.998,0.094-5.7,0.48c-1.903,0.431-3.806,1.018-5.48,2.02c-2.505,1.5-4.617,3.641-6.56,5.82   c-1.622,1.818-2.862,3.944-4.2,5.98c-0.538,0.819-1.232,1.584-1.52,2.52c-0.04,0.129-0.093,0.245-0.12,0.38   c-31.257,0.088-62.513,0.31-93.76,1.02c-18.762,0.627-37.167,10.052-47.44,25.98c-4.402,5.134-7.214,11.198-8.48,17.76   c-7.318,19.753-4.191,41.284-4.86,61.9c-0.621,16.44,2.831,32.975,10.28,47.6c8.66,13.65,21.606,25.827,38.16,28.3   c23.191,4.821,47.076,2.084,70.58,2.88c11.854-0.026,23.706-0.018,35.56-0.02c0.02,0.085,0.055,0.158,0.08,0.24   c0.288,0.936,0.982,1.701,1.52,2.52c1.338,2.036,2.578,4.162,4.2,5.98c1.943,2.179,4.055,4.32,6.56,5.82   c1.674,1.003,3.577,1.589,5.48,2.02c1.702,0.385,4.822,0.461,5.7,0.48c0.395,0.081,0.82,0.011,1.1-0.2s0.368-0.419,0.44-0.9   s-0.001-0.689-0.32-1.9s-1.082-3.32-1.9-5.24s-2.176-4.557-3.08-6.22c-0.578-1.064-1.048-1.868-1.5-2.6   c15.421,0.007,30.838,0.007,46.26,0.02c0.054,0.071,0.111,0.148,0.18,0.22c0.356,0.375,0.873,0.872,1.86,1.22   c0.987,0.348,1.037,0.25,4.04,0.4c3.003,0.15,10.612,0.097,12.84-0.04s2.625-0.172,3.72-0.6c0.884-0.346,1.544-0.512,1.68-1.18   c23.496,0.006,47.005-0.021,70.5-0.12c0.864,0.293,1.059,0.217,3.92,0.36c3.003,0.15,10.632,0.097,12.86-0.04   c1.837-0.113,2.436-0.167,3.2-0.42c19.412-0.121,38.829-0.305,58.24-0.58c13.574,0.032,27.064-8.429,31.62-21.48   c11.638-28.71,11.428-60.541,10.24-91.04c-1.52-19.914-4.089-40.865-14.88-58.06c-9.668-13.695-28.301-14.1-43.48-14.04   c-14.294-0.15-28.584-0.208-42.88-0.24c-0.486-0.064-1.078-0.12-2.06-0.18c-2.228-0.137-9.857-0.19-12.86-0.04   c-1.971,0.098-2.633,0.098-3.16,0.18c-18.306-0.005-36.613,0.039-54.92,0.04c-5.439,0.029-10.881,0.042-16.32,0.06   c-0.114-0.706-0.796-0.867-1.7-1.22c-1.095-0.428-1.492-0.463-3.72-0.6s-9.837-0.19-12.84-0.04c-3.003,0.15-3.053,0.052-4.04,0.4   s-1.504,0.845-1.86,1.22c-0.089,0.094-0.177,0.187-0.24,0.28c-15.421,0.02-30.839,0.039-46.26,0.06   c0.471-0.758,0.955-1.587,1.56-2.7c0.904-1.664,2.262-4.299,3.08-6.22c0.818-1.92,1.581-4.029,1.9-5.24s0.392-1.419,0.32-1.9   c-0.072-0.481-0.16-0.689-0.44-0.9c-0.191-0.144-0.452-0.21-0.72-0.22C178.565,107.467,178.517,107.467,178.471,107.469   L178.471,107.469z M231.051,124.549c0.569-0.006,1.216-0.006,1.84,0.02c-0.887,0.002-1.773-0.002-2.66,0   C230.513,124.558,230.803,124.552,231.051,124.549z M392.671,131.869c3.984-0.1,8.475,0.497,10.9,1.74   c5.937,3.043,9.497,7.731,10.88,14.34c0.451,2.157,1.527,5.292,2.38,6.98c2.538,5.022,4.874,12.282,4.66,14.46l-0.2,2.02   l-1.98-1.86c-1.088-1.02-2.95-3.953-4.12-6.52c-6.772-14.861-15.816-23.517-29.6-28.36c-1.199-0.421-1.19-0.468-0.06-1.3   C386.789,132.443,389.572,131.947,392.671,131.869L392.671,131.869z M178.331,133.129c1.289-0.008,2.762-0.003,4.4,0   c10.918,0.021,29.102,0.262,48.16,0.66l13.6,0.28l5.3,8.32c2.911,4.567,5.377,8.74,5.48,9.28c0.185,0.969,0.136,0.967-4.1,0.9   c-2.361-0.037-8.515-0.213-13.66-0.4c-14.533-0.528-36.943-2.857-51.1-5.3l-5.66-0.96l-1.82-2.84   c-1.002-1.555-2.866-4.275-4.14-6.06s-2.387-3.433-2.48-3.66C172.264,133.235,174.465,133.153,178.331,133.129L178.331,133.129z    M50.751,133.589c1.039,0,2.219-0.006,3.56,0c14.446,0.06,17.025,1.169,11.5,4.9c-3.192,2.156-23.743,14.638-32.06,19.48   c-7.072,4.117-9.857,6.488-13.02,11.08c-1.273,1.848-3.207,3.772-4.32,4.3c-2.067,0.981-5.292,1.268-6.02,0.54   c-0.226-0.226-0.42-2.035-0.42-4.02c0-3.856,1.171-6.737,5.4-13.4c3.48-5.483,10.249-13.165,14.26-16.18   c2.052-1.542,6.01-3.7,8.8-4.78C42.838,133.803,43.475,133.589,50.751,133.589L50.751,133.589z M268.251,134.409   c1.649-0.004,4.244,0.059,8.26,0.16c33.707,0.848,55.631,1.593,55.9,1.88c0.451,0.48,1.7,8.213,1.7,10.54   c0,3.626,0.283,3.523-12.22,4.18c-8.366,0.44-40.073,1.428-47.62,1.48c-0.734,0.005-1.541-1.452-4.66-8.4   c-2.074-4.619-3.916-8.752-4.08-9.18C265.354,134.606,265.503,134.415,268.251,134.409L268.251,134.409z M352.591,139.249   c0.728-0.024,1.629,0.029,2.78,0.12c4.51,0.359,15.212,1.876,15.8,2.24c1.263,0.781-5.239,3.088-13.2,4.7   c-5.925,1.2-6.614,1.27-8.08,0.68c-1.362-0.548-1.632-2.195-0.78-4.76C349.835,140.049,350.408,139.32,352.591,139.249z    M113.871,142.989c1.925,0,55.013,11.673,64.22,14.12c6.208,1.65,17.614,5.504,25.34,8.56c17.578,6.952,26.57,9.32,35.44,9.32   c6.752,0,7.142,0.179,12.68,6.1l5.7,6.1v30.24v30.26l-5.56,5.94l-5.54,5.92l-10.76,0.64c-8.487,0.496-13.218,1.589-22.44,5.18   c-22.98,8.949-37.944,13.313-65.84,19.26c-15.566,3.318-29.535,6.317-31.04,6.66c-2.204,0.502-3.188-0.271-5.08-4   c-2.909-5.735-9.306-25.696-11.14-34.78c-4.045-20.033-3.727-55.656,0.64-73.22C104.563,162.909,111.907,142.989,113.871,142.989   L113.871,142.989z M399.071,149.289c3.395-0.166,4.423,2.766,8.12,9.7c10.055,18.859,13.099,35.101,12.16,65   c-0.737,23.458-2.732,32.473-10.86,49c-7.083,14.402-7.268,14.5-17.72,9.52c-4.738-2.257-11.808-5.301-15.7-6.76   s-7.08-2.875-7.08-3.14s1.93-4.293,4.28-8.96c7.376-14.648,9.794-26.292,9.72-46.82c-0.075-20.549-2.245-30.756-9.68-45.52   c-2.46-4.884-4.293-9.025-4.08-9.2s7.532-3.43,16.26-7.24C392.371,151.429,396.431,149.418,399.071,149.289L399.071,149.289z    M11.851,260.189c0.488-0.043,1.092,0.041,1.84,0.22c3.659,0.874,4.193,1.296,7.28,5.54c3.662,5.035,5.749,6.701,14.84,11.96   c13.472,7.793,31.589,19.145,32.24,20.2c1.395,2.262-0.265,2.64-12.72,2.78c-10.284,0.115-12.234-0.022-15.04-1.04   c-9.38-3.403-16.845-9.753-23.88-20.32c-5.178-7.777-6.403-10.62-6.42-14.86C9.979,261.562,10.386,260.317,11.851,260.189   L11.851,260.189z M421.291,263.409l0.18,1.84c0.217,2.132-2.37,10.221-4.56,14.22c-0.818,1.493-1.902,4.672-2.4,7.06   c-2.12,10.167-9.973,16.474-20.26,16.3c-2.053-0.035-4.573-0.254-5.6-0.5s-2.402-0.752-3.06-1.12   c-1.119-0.626-1.075-0.708,0.64-1.4c7.987-3.225,12.381-5.899,16.6-10.06c5.036-4.966,8.203-9.575,12.3-17.94   c1.556-3.178,3.565-6.377,4.48-7.1L421.291,263.409z M273.371,282.069l8.72,0.1c10.585,0.12,31.399,0.849,42.66,1.48   c6.71,0.376,8.359,0.591,8.8,1.16c0.75,0.967,0.671,4.788-0.22,9.44l-0.76,3.9l-1.96,0.3c-1.899,0.287-24.574,0.961-51.92,1.54   c-9.474,0.201-13.399,0.148-13.28-0.18c0.093-0.256,1.92-4.352,4.06-9.1L273.371,282.069L273.371,282.069z M247.611,282.249   c4.695-0.008,7.74,0.179,7.74,0.62c0,0.57-9.584,16.057-10.62,17.16c-0.511,0.543-11.651,0.836-60.18,1.56l-12.7,0.2l1.78-2.46   c0.985-1.351,2.976-4.281,4.42-6.5c1.602-2.461,2.989-4.117,3.54-4.24c4.928-1.102,23.755-3.611,35.48-4.74   C227.408,282.854,239.786,282.262,247.611,282.249L247.611,282.249z M352.191,287.529c1.809,0.025,4.377,0.466,7.88,1.26   c8.774,1.988,13.206,3.948,10.28,4.56c-2.82,0.59-11.111,1.606-15.22,1.86l-4.42,0.26l-0.88-1.44   c-0.482-0.793-1.002-2.208-1.16-3.14C348.277,288.555,349.176,287.487,352.191,287.529L352.191,287.529z',
                //fillColor: '#e83273',
                //fillOpacity: 1,
            }

        });

        map.setCenter(userMarkerLocation);
        map.setZoom(16);
        //map.setZoom(9); //for testing purposes


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

    userMarker.icon.rotation = targetRotation; // the default non-smooth option

    //set smooth rotation of the userMarker
    //for some reason, the code beneath does the same as the line above, it doesn't smooth the animation at all

    /*
    let rotationDegrees = targetRotation-userRotation;

    console.log('userRotationPreCode = ' + userRotation)
    console.log('targetRotation = ' + targetRotation)

    if(userRotation>=360){
        userRotation=0;
    }

    const rotationSpeed = 10;

    if(rotationDegrees > 180){ //make sure it turns around the left side if that's the quickest option (not correct yet)
        if(userRotation<targetRotation&&userRotation>=0){
            userMarker.icon.rotation-= rotationSpeed;
                if(userRotation<1){
                    userMarker.icon.rotation=360;
                }
        }
    }else if(rotationDegrees < -180){
        if(userRotation>targetRotation&&userRotation<=360){
            userMarker.icon.rotation+= rotationSpeed;
        }
    }else{
        if(userRotation<targetRotation&&userRotation<=360){
            userMarker.icon.rotation+= rotationSpeed;
        }
        if(userRotation>targetRotation&&userRotation>=0){
            userMarker.icon.rotation-= rotationSpeed;
                if(userRotation<1){
                    userMarker.icon.rotation=360;
                }
        }
    }

    console.log('userRotationPostCode = ' + userRotation)
    console.log('userMarker.icon.rotation = ' + userMarker.icon.rotation)
    */
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
                    jQuery('#pButton').attr('href', '/pages/POI/' + loadLocationArray.pTitle.toLowerCase().split(' ').join('_') + '.php');
                }else if(pIcon == 3){
                    jQuery('#pButton').attr('href', '/pages/POI/info.php' + '?id=' + loadLocationArray.contentID);
                }else if(pIcon == 4){
                    jQuery('#pButton').attr('href', '/pages/POI/quiz.php' + '?id=' + loadLocationArray.contentID);
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

        console.log('pIcon = ' + pIcon);
        console.log('maxDistPOI(pIcon) = ' + maxDistPOI(pIcon));

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
