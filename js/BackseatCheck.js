/*
  to add:
  - get contentID from URL
  - get sort out of URL or otherwise (quiz, info, game) --> pIcon
  - get from db: matching pIcon and contentID
  - get the long and lat from only that point
  - compare that to showPosition
*/

jQuery(document).ready(function(){

      // get location of current POI from database
      jQuery.ajax({
        type: "POST",
        url: "../../php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'NAME?!', qID:contentID},

        success: function(data) {
            if (!('error' in data)) {

            }else{

            }
        }
      });
});

getUserLocation();

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function showPosition(position) {
  console.log("lat: " + position.coords.latitude);
  console.log("long: " + position.coords.longitude);
}
