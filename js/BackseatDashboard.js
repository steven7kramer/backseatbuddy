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

  getAllCars(container, size, moment);
}

//load all properties of the car in separate car Objects, and load these objects into the carArray
function getAllCars(container, size, moment) {
    var requestData = {functionname: "loadCar", moment: moment};
    var request = constructAJAXRequest(requestData, "BackseatDB.php");

    request.success = function(response) {
      var carArray = [];
        for(let i=0;i<response.loadCar.length;i++){
          var car = {};
          car = {type: response.loadCar[i].carType, colour: response.loadCar[i].carColour, strokeColour: response.loadCar[i].carStrokeColour}
          carArray.push(car)
        }

      fillCarPathArray(carArray, size, container);
    }

    jQuery.ajax(request);
}

/**
 * Displays the car
 * @return HTML element to add
 */

function fillCarPathArray(carArray, size, container){
  var carPathArray = [];

  for (let i = 0; i < carArray.length; i++) {
    $.ajax({
      url: '/lib/carTypes/small/car' + carArray[0].type + '.txt', // file with the svg path of the car
      dataType: 'text', // type of file (text, json, xml, etc)
      success: function(data) { // callback for successful completion
        var carPath = data;
        carPathArray.push(carPath);
        if(i == (carArray.length - 1)){
          displayCars(carArray, carPathArray, size, container);
        }
      }
    });
  }
}

function displayCars(carArray, carPathArray, size, container){
  var htmlArray = [];
  var carsContainer = document.getElementById(container);

  for (let i = 0; i < carArray.length; i++){
    htmlArray.push(
      '<div id="indivCar">'
      + '<div id="carSVG">'
      + '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="' + size + 'px" height="' + size + 'px" viewBox="0 0 ' + size + ' ' + size + '" enable-background="new 0 0 ' + size + ' ' + size + '" xml:space="preserve">'
      + '<g><path id="car" fill="' + carArray[i].colour + '" d="' + carPathArray[i] + '" stroke="' + carArray[i].strokeColour + '" stroke-width="1"></path></g></svg>'
      + '</div>'
    );
    if(i == 0){
      htmlArray.push(
        '<div id="carText">'
        + ' <h3 class="selected"> Huidige Auto </h3> '
        + '</div>'
      );
    }else{
      htmlArray.push(
        '<div id="carText">'
        + ' <a onclick="selectCar(' + carArray[i].carID + ')"><h3 class="unlocked"> Selecteer Auto </h3></a> '
        + '</div>'
      );
    }
    htmlArray.push('</div>') // close first indivCar div
  }
  console.log(htmlArray);
  carsContainer.innerHTML = htmlArray.join(' ');
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

function selectCar(carID){
  var requestData = {functionname: "selectCar", carID: carID};
  var request = constructAJAXRequest(requestData, "BackseatDB.php");

  request.success = function(response) {
    location.reload();
  }

  jQuery.ajax(request);
}
