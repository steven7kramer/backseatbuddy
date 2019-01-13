/*
  This document checks whether the user is within range of the opened infoPoint
  This prevents users from manually adjusting the URL to open infoPoints
*/

// POI lat and lngg
var lat1;
var lng1;

// user lat and lngg
var lat2;
var lng2;
var acqUserPosition = false;
var userIsNearby;
var zeroLength;

var maxDistPOI = function(pType){
  $.getScript('/js/BackseatGeneral.js', function(){
    return maxDistPOI(pType);
  });
  return;
}

// get data out of the url to determine which POI they openend
var contentID = getURLParameter('id');
var pType;
var pCategory;

function getURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }

    return -1;
}

jQuery(document).ready(function(){

      //get position of the user
      getUserPosition();

      if(window.location.href.indexOf("quiz.php") > -1){
        pType = 4;
      }else if(window.location.href.indexOf("windmolens.php") > -1){
        pType = 2;
        pCategory = "windmolens";
      }else if(window.location.href.indexOf("racing.php") > -1){
        pType = 2;
        pCategory = "racing";
      }else if(window.location.href.indexOf("info.php") > -1){
        pType = 3;
      }

      // get pID from db

      jQuery.ajax({
        type: "POST",
        url: "../../php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'findpID', pType:pType, pCategory:pCategory, contentID:contentID},

        success: function(obj) {
          var pID = obj.pID;

              // get location of current POI from database
              jQuery.ajax({
                type: "POST",
                url: "../../php/BackseatDB.php",
                datatype: 'json',
                data: {functionname: 'checkIfUnlocked', pType:pType, pCategory:pCategory, contentID:contentID, pID:pID},

                success: function(data) {
                    if (!('error' in data)) {

                      // wait until userPosition is acquired
                      waitForIt();
                      function waitForIt(){
                          if (!acqUserPosition) {
                              setTimeout(function(){waitForIt()},100);
                          }else{
                            if(data.checkIfUnlocked.length == 0){
                              // handling this error is done in the POI's itself
                              if(pType == 2){
                                calculateDistance();
                                console.log("gameTimer for this pID is not found in db");
                              }else{
                                console.error('data array length is 0');
                                zeroLength = true;
                              }
                            }else{
                              lat1 = data.checkIfUnlocked[0].lat;
                              lng1 = data.checkIfUnlocked[0].lng;

                                if(pType == 2){
                                  // Check if gameTimer is true
                                  let timeEnd = new Date(data.checkIfUnlocked[0].time_end);

                                  if(timeEnd - new Date() > 0){
                                    console.log("gameTimer is still running");
                                    userIsNearby = true;
                                  }else{
                                    calculateDistance();
                                    console.log("gameTimer is not running");
                                  }
                                }else{
                                  calculateDistance();
                                }
                            }
                          }
                      }

                    }else{
                      console.error('error in data');
                    }
                }

              });
        }
      });
});

function getUserPosition(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(updateUserPosition);
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}
function updateUserPosition(position){
  lat2 = position.coords.latitude;
  lng2 = position.coords.longitude;
  acqUserPosition = true;
}

function calculateDistance(){

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dlng = deg2rad(lng2-lng1);
  var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dlng/2) * Math.sin(dlng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km

  checkDistance(d);
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function checkDistance(d){

  if(maxDistPOI(pType) - d > 0){
    userIsNearby = true;
    console.log("User is close enough to POI");
  }else{
    userIsNearby = false;
    console.error('User is too far from the POI');
  }
}
