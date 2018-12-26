var dbReady;

getScript('/js/BackseatGeneral.js', function(){
  var userName = userName;
});

// set right properties to object
function makeProducts(moment){
  dbReady = false;

  // Check whether the moment variable is properly defined
  if (typeof(moment) !== "string") {
      console.error("makeProducts() failed: " + moment + " is not a valid moment name.");
      return false;
  }

  if(moment == "dashboard"){
    getAllCars(moment);
    getAllAvatars(moment);
  }else if(moment == "carOnly"){
    getAllCars(moment);
  }else if(moment == "avatarOnly"){
    getAllAvatars(moment);
  }

}

// START CAR LOADER

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
      url: '/lib/carTypes/car' + carArray[i].type + '.txt', // file with the svg path of the car
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
      // place dot when > 999, so 20000 = 20.000
      var carCosts = carArray[i].costs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

      var carMoment = "'car'";
      var car = "";
      car += '<li class="chew-cell">';
      car += '<div class="chew-card">';

        car += '<div id="indivProduct">'
        car += '<div id="carSVG">'
        car += '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 512 512" xml:space="preserve">'
        car += '<g><path id="car" fill="' + carArray[i].colour + '" d="' + carPathArray[i] + '" stroke="' + carArray[i].strokeColour + '" stroke-width="1"></path></g></svg>'
        car += '</div>'

        if(carArray[i].current === '1'){
            car += '<div id="productText">'
            car += ' <h3 class="selected"> Huidig </h3> '
            car += '</div>'
        }else if(carArray[i].current === '0'){
            car += '<div id="productText">'
            car += ' <a onclick="selectCar(' + carArray[i].carID + ')"><h3 class="unlocked"> Selecteer </h3></a> '
            car += '</div>'
        }else{
            car += '<div id="productText">'
            car += ' <a onclick="askBuyProduct(' + carArray[i].carID + ', ' + carArray[i].costs + ', ' + carMoment + ')"><h3 class="buy"> Koop <img src="/images/other/bsbCoin.png" width="20px"/> ' + carCosts + ' </h3></a> '
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

// END CAR LOADER

// START AVATAR LOADER

function getAllAvatars(moment) {
    var requestData = {functionname: "loadAvatar", moment: moment};
    var request = constructAJAXRequest(requestData, "BackseatDB.php");

    request.success = function(response) {
      console.log(response);
      var avatarArray = [];
        for(let i=0;i<response.loadAvatar.length;i++){
          var avatarShop = {};
          avatarShop = {aID: response.loadAvatar[i].aID, aGlasses: response.loadAvatar[i].aGlasses, glassColour: response.loadAvatar[i].glassColour, costs: response.loadAvatar[i].costs, current: response.loadAvatar[i].current};
          avatarArray.push(avatarShop);
        }

      displayAvatars(avatarArray);
    }

    jQuery.ajax(request);
}

function displayAvatars(avatarArray){
  var counter = 0;
  var NUMBER_OF_CELLS_AVATARS = 10;
  dbReady = true;

  for (var i = 0; i < avatarArray.length; i++) {
      // place dot when > 999, so 20000 = 20.000
      var avatarCosts = avatarArray[i].costs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      var avatarMoment = "'avatar'";
      var avatar = "";
      avatar += '<li class="chew-cell">';
      avatar += '<div class="chew-card">';

        avatar += '<div id="indivProduct">'
        avatar += '<div id="avatarSVG' + i + '" class="avatarSVG">'
        avatar += '</div>'

        if(avatarArray[i].current === '1'){
            avatar += '<div id="productText">'
            avatar += ' <h3 class="selected"> Huidig </h3> '
            avatar += '</div>'
        }else if(avatarArray[i].current === '0'){
            avatar += '<div id="productText">'
            avatar += ' <a onclick="selectAvatar(' + avatarArray[i].aID + ')"><h3 class="unlocked"> Selecteer </h3></a> '
            avatar += '</div>'
        }else{
            avatar += '<div id="productText">'
            avatar += ' <a onclick="askBuyProduct(' + avatarArray[i].aID + ', ' + avatarArray[i].costs + ', ' + avatarMoment + ')"><h3 class="buy"> Koop <img src="/images/other/bsbCoin.png" width="20px"/> ' + avatarCosts + ' </h3></a> '
            avatar += '</div>'
        }

      avatar += '</div>' // close first indivCar div
      avatar += '</div></li>';

      jQuery("#avatar-row").append(avatar);

      // we need to place the svg in the right div only at this place
      // since BackseatPainter will look for the div, and only at this point, it is placed in the php file
      ShopAvatars("avatarSVG" + i, avatarArray[i]);

      counter++;
  }

  while (counter % NUMBER_OF_CELLS_AVATARS != 0) {
      var ghost = "<li class='chew-cell chew-cell--ghost'></li>";
      jQuery("#avatar-row").append(ghost);
      counter++;
  }
}

// END AVATAR LOADER

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
    makeProducts("carOnly");
  }

  jQuery.ajax(request);
}

function askBuyProduct(productID, costs, moment){
  // weet je het zeker?
  costs = costs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  $('#price').text(costs);
  $('#ynBtns').append('<a onclick="costCheck(' + productID + ',' + costs + ',' + moment + ');closeAskScreen();" class="yesButton shopBtn"> Ja </a> <a onclick="closeAskScreen()" class="noButton shopBtn"> Nee </a>');
  $('#buyCheckBG').fadeIn();
}

function closeAskScreen(){
  $('#buyCheckBG').fadeOut('fast', function() {
      $('#ynBtns').text('');
});

}

function costCheck(productID, costs, moment){
  //check for sufficient funds
  getScript('/js/BackseatGeneral.js', function(){
    if(userCoins >= costs){
      if(moment == car){
        buyCarFromDB(productID, costs);
      }else if(moment == avatar){
        buyAvatarFromDB(productID, costs);
      }

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
    makeProducts("carOnly");
    waitForIt();
    function waitForIt(){
        if (!dbReady) {
            setTimeout(function(){waitForIt()},100);
        } else {
            updateCoins("reload");
        }
      }
  }

  jQuery.ajax(request);
}

function selectAvatar(aID){
  var requestData = {functionname: "selectAvatar", aID: aID};
  var request = constructAJAXRequest(requestData, "BackseatDB.php");

  request.success = function(response) {
    $('#avatar-row').text('');
    makeProducts("avatarOnly");
    $('#bsb-avatar-drawing').text('');
    new BackseatAvatar(150, "bsb-avatar-drawing", "current");
  }

  jQuery.ajax(request);
}

function buyAvatarFromDB(aID, costs){
  var requestData = {functionname: "buyAvatar", aID: aID, costs: costs};
  var request = constructAJAXRequest(requestData, "BackseatDB.php");

  request.success = function(response) {
    $('#avatar-row').text('');
    makeProducts("avatarOnly");
    waitForIt();
    function waitForIt(){
        if (!dbReady) {
            setTimeout(function(){waitForIt()},100);
        } else {
            updateCoins("reload");
            $('#bsb-avatar-drawing').text('');
            new BackseatAvatar(150, "bsb-avatar-drawing", "current");
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
