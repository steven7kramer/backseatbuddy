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
function BackseatAvatar() {

    /**
     * Contains all data for this object
     */
    var object = {};

    /**
     * The identifier of this Avatar object. Corresponds to the DB id
     */
    object.id;

    /**
     * Contains all properties of this Avatar object
     */
    object.properties;

    getAvatarID(this);
    return object;
}

/**
 * Retrieves the avatar ID based on the currently logged in user
 */
function getAvatarID(avatar) {
    var requestData = {functionname: "findAvatarID"};
    var request = constructAJAXRequest(requestData, "BackseatDB.php");

    request.success = function(response) {
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
        display(response);
    }

    jQuery.ajax(request);
}

/**
 * Displays an avatar
 * @return HTML element to add
 */
function display(avatar) {

    // SVG.js
    var draw = SVG('bsb-avatar-drawing'),
    rect = draw.rect(100, 100).fill('#f06');
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
