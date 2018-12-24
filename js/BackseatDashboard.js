var dbReady;

getScript('/js/BackseatGeneral.js', function(){
  var userName = userName;
});

// set right properties to object
function makeCar(moment){
  dbReady = false;

  // Check whether the moment variable is properly defined
  if (typeof(moment) !== "string") {
      console.error("makeCar() failed: " + moment + " is not a valid moment name.");
      return false;
  }

  getAllCars(moment);
}

//load all properties of the car in separate car Objects, and load these objects into the carArray
function getAllCars(moment) {
    var requestData = {functionname: "loadCar", moment: moment};
    var request = constructAJAXRequest(requestData, "BackseatDB.php");

    request.success = function(response) {
      console.log(response);
      var carArray = [];
        for(let i=0;i<response.loadCar.length;i++){
          var car = {};
          car = {carID: response.loadCar[i].carID, type: response.loadCar[i].carType, colour: response.loadCar[i].carColour, strokeColour: response.loadCar[i].carStrokeColour, costs: response.loadCar[i].carCosts, current: response.loadCar[i].current};
          carArray.push(car);
        }

      fillCarPathArray(carArray);
    }

    jQuery.ajax(request);
}

/**
 * Displays the car
 * @return HTML element to add
 */

function fillCarPathArray(carArray){
  var carPathArray = [];

  for (let i = 0; i < carArray.length; i++) {
    $.ajax({
      url: '/lib/carTypes/car' + carArray[0].type + '.txt', // file with the svg path of the car
      dataType: 'text', // type of file (text, json, xml, etc)
      success: function(data) { // callback for successful completion
        var carPath = data;
        carPathArray.push(carPath);
        if(i == (carArray.length - 1)){
          displayCars(carArray, carPathArray);
        }
      }
    });
  }
}

function displayCars(carArray, carPathArray){
  var counter = 0;
  var NUMBER_OF_CELLS_CARS = 10;
  dbReady = true;

  for (var i = 0; i < carArray.length; i++) {

      var car = "";
      car += '<li class="chew-cell">';
      car += '<div class="chew-card">';

        car += '<div id="indivCar">'
        car += '<div id="carSVG">'
        car += '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 512 512" xml:space="preserve">'
        car += '<g><path id="car" fill="' + carArray[i].colour + '" d="' + carPathArray[i] + '" stroke="' + carArray[i].strokeColour + '" stroke-width="1"></path></g></svg>'
        car += '</div>'

        if(carArray[i].current === '1'){
            car += '<div id="carText">'
            car += ' <h3 class="selected"> Huidige Auto </h3> '
            car += '</div>'
        }else if(carArray[i].current === '0'){
            car += '<div id="carText">'
            car += ' <a onclick="selectCar(' + carArray[i].carID + ')"><h3 class="unlocked"> Selecteer Auto </h3></a> '
            car += '</div>'
        }else{
            car += '<div id="carText">'
            car += ' <a onclick="askBuyCar(' + carArray[i].carID + ', ' + carArray[i].costs + ')"><h3 class="buy"> Koop <img src="/images/other/bsbCoin.png" width="20px"/> ' + carArray[i].costs + ' </h3></a> '
            car += '</div>'
        }

      car += '</div>' // close first indivCar div
      car += '</div></li>';

      jQuery("#car-row").append(car);
      counter++;
  }

  while (counter % NUMBER_OF_CELLS_CARS != 0) {
      var ghost = "<li class='chew-cell chew-cell--ghost'></li>";
      jQuery("#car-row").append(ghost);
      counter++;
  }
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
    $('#car-row').text('');
    makeCar("dashboard");
  }

  jQuery.ajax(request);
}

function askBuyCar(carID, costs){
  // weet je het zeker?
  $('#price').text(costs);
  $('#ynBtns').append('<a onclick="buyCar(' + carID + ',' + costs + ');closeAskScreen();" class="yesButton shopBtn"> Ja </a> <a onclick="closeAskScreen()" class="noButton shopBtn"> Nee </a>');
  $('#buyCheckBG').fadeIn();
}

function closeAskScreen(){
  $('#buyCheckBG').fadeOut('fast', function() {
      $('#ynBtns').text('');
});

}

function buyCar(carID,costs){
  //check for sufficient funds
  getScript('/js/BackseatGeneral.js', function(){
    if(userCoins >= costs){
      buyCarFromDB(carID, costs);
    }else{
      $('#fixedShopError').show();
      setTimeout(function(){$('#fixedShopError').fadeOut();},1500);
    }
  });
}

function buyCarFromDB(carID, costs){
  var requestData = {functionname: "buyCar", carID: carID, costs: costs};
  var request = constructAJAXRequest(requestData, "BackseatDB.php");

  request.success = function(response) {
    $('#car-row').text('');
    makeCar("dashboard");
    waitForIt();
    function waitForIt(){
        if (!dbReady) {
            setTimeout(function(){waitForIt()},100);
        } else {
            updateCoins('false');
        }
      }
  }

  jQuery.ajax(request);
}

function getScript(url, callback) {
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   script.onreadystatechange = callback;
   script.onload = callback;

   document.getElementsByTagName('head')[0].appendChild(script);
}

function editUsername(){
  var editUsernameHTML = '<h3> Nieuwe gebruikersnaam </h3>'
  editUsernameHTML += '<input id="username" type="text" name="username" value="' + userName + '"><br>';
  editUsernameHTML += '<input type="hidden" id="functionname" name="functionname" value="editUsername">';
  editUsernameHTML += '<input type="submit" value="Opslaan">';
  $('.editUsernameIcon').hide();
  $('.usernamePlace').text('');
  $('.usernamePlace').append(editUsernameHTML);
}
