/**
 * Represents an avatar for Backseat Buddy
 *
 * [LAST UPDATED: november 2018] <Prototype>
 * In Backseat Buddy, the characters are genderless and take on a basic human shape. They are mainly
 * added to test character customization. Both technically and conceptually.
 *
 * For now, each character has the following properties:
 *      1) Glasses: {None, Modern, Futuristic, Classic}
 *
 * A character's properties are stored in the database
 *
 * @author Cas Wognum
 * @constructor
 */
function BackseatAvatar(size, container, moment) {

    /**
     * Contains all data for this object
     */
    var object = {};

    // Robustness tests:
    // Check whether the size variable is properly defined
    if (typeof(size) !== "number" || size <= 0) {
        console.error("BackseatAvatar() failed: " + size + " is not a valid size.");
        return false;
    }

    // Check whether the container variable is properly defined
    if (typeof(container) !== "string") {
        console.error("BackseatAvatar() failed: " + container + " is not a valid container name.");
        return false;
    }

    /**
     * The identifier of this Avatar object. Corresponds to the DB id
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
     * Contains all properties of this Avatar object
     */
    object.properties;
    getAvatarID(object, moment);
    return object;
}

/**
 * Retrieves the avatar ID based on the currently logged in user
 */
function getAvatarID(avatar, moment) {
    var requestData = {functionname: "findAvatarID", moment: moment};
    var request = constructAJAXRequest(requestData, "BackseatDB.php");

    request.success = function(response) {
      console.log(response);
        avatar.id = response.aID;
        getPropertiesFromDatabase(avatar);
    }

    jQuery.ajax(request);
}

/**
 * Retrieves all character's information from the database by submitting a AJAX request to
 * BackseatDatabase.php
 *
 * @param  int id Identifier of the Avatar in the Avatar Table in the database
 * @return JSON object with all the character's properties
 */
function getPropertiesFromDatabase(avatar) {
    var requestData = { aID: avatar.id, functionname: "getAvatarProperties"};
    var request = constructAJAXRequest(requestData, "BackseatDB.php");

    request.success = function(response) {
        avatar.properties = { aID:response.aID, aGlasses:response.aGlasses, glassColour: response.glassColour};
        display(avatar);
    }

    jQuery.ajax(request);
}

/**
 * handles placing all avatars in the shop
 * container is unique, since it is numbered by using a for loop in BackseatDashboard.js
 * data is only from the right object, not all data is brought
 */
function ShopAvatars(container, data){
  var painter = new BackseatPainter(150, container);
  painter.drawFace();
  painter.drawGlasses(data.aGlasses, data.glassColour);
}

/**
 * Displays an avatar
 * @return HTML element to add
 */
function display(avatar) {
    var painter = new BackseatPainter(avatar.size, avatar.container);
    painter.drawFace();
    console.log(avatar);
    painter.drawGlasses(avatar.properties.aGlasses, avatar.properties.glassColour);
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
        console.error("BackseatAvatar.sendAJAXRequest() failed: The PHP file was not properly defined");
        return false;
    }

    if (data === undefined || typeof(data) !== "object") {
        console.error("BackseatAvatar.sendAJAXRequest() failed: The data object was not properly defined");
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
            console.error("BackseatAvatar.sendAJAXRequest() failed: Sending the AJAX request failed" +
            " with the following status: " + textstatus);
        }
    };

    return response;
}
