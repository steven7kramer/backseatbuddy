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
function BackseatAvatar(id) {

    /**
     * Contains all data for this object
     */
    var object = {};

    // If no ID is given, get the ID
    if (id === undefined) {
        id = getAvatarID();
    }

    // Retrieve properties
    object.properties = getPropertiesFromDatabase(id);

    // Draws the image to the screen
    object.display = function(parent) {
        if (object.svg === undefined) {
            object.svg = null;
        }

        var htmlString = "<img src='https://www.w3schools.com/html/img_girl.jpg' alt='Girl in a jacket' style='width:500px;height:600px;'>";
        return htmlString;
    }

    return object;
}

/**
 * Retrieves the avatar ID based on the currently logged in user
 *
 * @return int the identifier of the user's avatar
 */
function getAvatarID() {
    return -1;
}

/**
 * Retrieves all character's information from the database by submitting a AJAX request to
 * BackseatDatabase.php
 *
 * @param  int id Identifier of the Avatar in the Avatar Table in the database
 * @return JSON object with all the character's properties
 */
function getPropertiesFromDatabase(id) {
    return null;
}

/**
 * Sends an AJAX request
 *
 * @param JSON The data object to be send to the PHP file
 * @param String Name of the PHP file
 *
 * @return JSON Object with the response
 */
function sendAJAXRequest(data, phpFile) {
    return null;
}
