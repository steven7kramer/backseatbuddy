// set right properties to object
function makeCar(size, container, moment){
  /**
   * Contains all data for this object
   */
  var object = {};

  // Robustness tests:
  // Check whether the size variable is properly defined
  if (typeof(size) !== "number" || size <= 0) {
      console.error("makeCar() failed: " + size + " is not a valid size.");
      return false;
  }

  // Check whether the container variable is properly defined
  if (typeof(container) !== "string") {
      console.error("makeCar() failed: " + container + " is not a valid container name.");
      return false;
  }

  // Check whether the moment variable is properly defined
  if (typeof(moment) !== "string") {
      console.error("makeCar() failed: " + moment + " is not a valid moment name.");
      return false;
  }

  /**
   * The identifier of this car object. Corresponds to the DB id
   */
  object.id;

  /**
   * Stores the location in HTML of where to draw
   */
  object.container = container;

  /**
   * Stores the size of the SVG
   */
  object.size = size;

  /**
   * Contains all properties of this car object
   */
  object.properties;
  getAllCars(container, moment);
}

//load all properties of the car in separate car Objects, and load these objects into the carArray
function getAllCars(container, moment) {
    var requestData = {functionname: "loadCar", moment: moment};
    var request = constructAJAXRequest(requestData, "BackseatDB.php");

    request.success = function(response) {
      var carArray = [];
        for(let i=0;i<response.loadCar.length;i++){
          var car = {};
          car = {type: response.loadCar[i].carType, colour: response.loadCar[i].carColour, strokeColour: response.loadCar[i].carStrokeColour}
          carArray.push(car)
        }

      displayCars(carArray, container);
    }

    jQuery.ajax(request);
}

/**
 * Displays the car
 * @return HTML element to add
 */

function displayCars(carArray, container){
  var carsContainer = document.getElementById(container);
  var carPathArray = [];

  //for (let i = 0; i < carArray.length; i++) {
    $.ajax({
      url: '/lib/carTypes/car' + carArray[0].type + '.txt', // file with the svg path of the car
      dataType: 'text', // type of file (text, json, xml, etc)
      success: function(data) { // callback for successful completion
        var carPath = data;
        //carPathArray.push(carPath);

        carsContainer.innerHTML = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><g><path id="car" fill="' + carArray[0].colour + '" d="' + carPath + '"></path></g></svg>';
      }
    });
  //}

  /*console.log(carPathArray);
  console.log(carPathArray[0]);*/

}

/**
 * Sends an AJAX request
 *
 * @param JSON The data object to be send to the PHP file
 * @param String Name of the PHP file
 *
 * @return JSON Object with the response or false on failure
 */
function constructAJAXRequest(data, phpFile) {

    if (phpFile === undefined || typeof(phpFile) !== "string") {
        console.error("BackseatDashboard.sendAJAXRequest() failed: The PHP file was not properly defined");
        return false;
    }

    if (data === undefined || typeof(data) !== "object") {
        console.error("BackseatDashboard.sendAJAXRequest() failed: The data object was not properly defined");
        return false;
    }

    if (phpFile.substring(phpFile.length - 4, phpFile.length) !== ".php") {
        phpFile.concat(".php");
    }

    var response = {
        type: "POST",
        url: "../../php/" + phpFile,
        datatype: 'json',
        data: data,

        fail: function(responseData, textstatus) {
            console.error("BackseatDashboard.sendAJAXRequest() failed: Sending the AJAX request failed" +
            " with the following status: " + textstatus);
        }
    };

    return response;
}
/*
    userMarker = new google.maps.Marker({
          position: userMarkerLocation,
          map: map,
          icon: {
            path: carType,
            scale: .1,
            fillColor: carColour,
            fillOpacity: 1,
            strokeColor: 'black',
            strokeOpacity: 1,
            strokeWeight: .5,
            rotation: 90,
            anchor: new google.maps.Point(256,256)

        }
    });
*/
