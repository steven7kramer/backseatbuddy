<?php

header('Content-Type: application/json');

session_start();

$result = array();
$points = array();
$collectibles = array();
$highscores = array();
$link;

if (!isset($_POST['functionname'])) {
    $result['error'] = 'No function name given!';
}


if (!isset($result['error'])) {

    switch ($_POST['functionname']) {
        case 'getAll':
            if (connect()) {
                queryPoints();
                $result['markers'] = $GLOBALS['points'];
            } else {
                $result['error'] = mysqli_connect_error();
            }
            break;
        case 'getCollectibles':
            if (connect()) {
                queryCollectibles();
                $result['collectibles'] = $GLOBALS['collectibles'];
            } else {
                $result['error'] = mysqli_connect_error();
            }
            break;
        case 'addToDatabase':
            if(connect()) {
                $result['error'] = "none";
                queryAddToDatabase();
            }
            break;
        case 'addCollectible':
            if(connect()) {
                addCollectibleToUser();
            }
            break;
        case 'loginRegistration':
            if (connect()) {
                addUserToDB();
            }
            break;
        case 'loginMain':
            if (connect()) {
                if (checkDBForUser()) {
                    $result['success'] = 'true';
                } else {
                    $result['success'] = 'false';
                }
            }
        break;
        case 'saveHighscore':
            if (connect()) {
                addScoreToDB();
            }
        break;
        case 'getHighscores':
            if (connect()) {
                queryHighscores();
                $result['highscores'] = $GLOBALS['highscores'];
                mysqli_close($GLOBALS['link']);
            } else {
                $result['error'] = mysqli_connect_error();
            }
            break;
        case 'checkThirtyMinutes':
            if (connect()) {
                $result['gameUnlocked'] = checkThirtyMinutes();
            }
            break;
        case 'addThirtyMinutes':
            if (connect()) {
                addThirtyMinutes();
            }
            break;
        /*case 'checkIfUnlocked':
            if (connect()) {
                checkIfUnlocked();
            }
            break;*/
        case 'addCoins':
            if (connect()) {
                addCoins();
            }
            break;
        case 'coinDisplay':
            if (connect()) {
                coinDisplay();
            }
            break;
        case 'doubleCoins':
            if (connect()) {
                doubleCoins();
            }
            break;
        case 'tutorialDone':
            if (connect()) {
                tutorialDone();
            }
            break;
        case 'tutorialEndButton':
            if (connect()) {
                tutorialEndButton();
            }
            break;
        case 'findAvatarID':
            if (isset($_POST['aID'])) {
                return $_POST['aID'];
            }
            else {
                if (connect()) {
                    findAvatarID();
                }
            }
            break;
        case 'getAvatarProperties':
            if (connect()) {
                getAvatarProperties();
            }
            break;
        default:
            $result['error'] = 'Specified function not found';
            break;
    }
}

if (connect()) {
    mysqli_close($GLOBALS['link']);
}

echo json_encode($result);

function connect() {

    $servername = "db.caswognum.nl";
    $username = "md332540db401549";
    $dbname = "md332540db401549";
    $password = "CASdb001";

    $GLOBALS['link'] = mysqli_connect($servername, $username, $password, $dbname);

    if (mysqli_connect_errno() == 0) {
        return true;
    } else {
        return false;
    }
}

function queryPoints() {
    $table = "PointsOfInterest";

    $query = sprintf("SELECT * FROM %s", $table);
    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    while ($row = $result -> fetch_assoc()) {
        array_push($GLOBALS['points'], $row);
    }


    mysqli_free_result($result);
}

function queryCollectibles() {
    $table1 = "Collectibles C";
    $table2 = "HasCollected HC";

    $query = sprintf("SELECT * FROM %s WHERE C.cID IN (SELECT HC.cID FROM %s WHERE HC.uID = %d)", $table1, $table2, $_SESSION['uID']);
    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    while ($row = $result -> fetch_assoc()) {
        array_push($GLOBALS['collectibles'], $row);
    }


    mysqli_free_result($result);
}

function queryHighscores() {
    $table1 = "Highscores H";
    $table2 = "Users U";

    $query = sprintf("SELECT U.uEmail, H.score FROM %s, %s WHERE U.uID = H.uID ORDER BY H.score DESC LIMIT 10", $table1, $table2);
    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    while ($row = $result -> fetch_assoc()) {
        array_push($GLOBALS['highscores'], $row);
    }


    mysqli_free_result($result);
}

function queryAddToDatabase() {

    $query = sprintf("INSERT INTO PointsOfInterest (pID, lng, lat, pTitle, pDescr, pCategory, pIcon, pImage)
              VALUES (NULL, '%f', '%f', '%s', '%s', '%s', '%s', '%s')",
              $_POST['lng'], $_POST['lat'], $_POST['pTitle'], $_POST['pDescr'], $_POST['pCategory'], $_POST['pIcon'], $_POST['pImage']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
}

function addScoreToDB() {
    $query = sprintf("INSERT INTO Highscores (pID, uID, score)
              VALUES ('%d', '%d', '%d')",
              $_POST['pID'], $_SESSION['uID'], $_POST['score']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
}

function addUserToDB() {

    if (!filter_var($_POST["uEmail"], FILTER_VALIDATE_EMAIL)) {
        $GLOBALS['result']['error'] = "Dat lijkt ons geen geldig e-mailadres!";
        return;
    }

    $email = strtolower($_POST["uEmail"]);

    if (strlen($_POST["uPassword"]) < 8) {
        $GLOBALS['result']['error'] = "Je wachtwoord moet uit minimaal 8 karakters bestaan!";
        return;
    }

    $query = sprintf("SELECT * FROM Users WHERE uEmail = '%s'", $_POST['uEmail']);
    $result = mysqli_query($GLOBALS['link'], $query);

    if (mysqli_num_rows($result) > 0) {
        $GLOBALS['result']['error'] = "Dat e-mailadres komt ons al bekend voor! <a href='recover.php' style='color:white;'>Wachtwoord vergeten?</a>";
        return;
    }

    $password = password_hash($_POST["uPassword"], PASSWORD_DEFAULT);

    $query = sprintf("INSERT INTO Users (uID, uEmail, uPassword)
              VALUES (NULL, '%s', '%s')",
              $email, $password);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    $_POST['uEmail'] = $email;
    checkDBForUser();
}

function checkDBForUser() {

    $table = "Users";

    $query = sprintf("SELECT * FROM %s WHERE uEmail = '%s'", $table, $_POST['uEmail']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    if (mysqli_num_rows($result) == 1) {
        $row = mysqli_fetch_array($result);

        if (password_verify($_POST['uPassword'], $row["uPassword"])) {

            $_SESSION["uID"] = $row['uID'];
            $_SESSION["email"] = $row['uEmail'];
            $GLOBALS['result']['tutorialDone']=$row['tutorialDone'];

            if ($row['admin'] == 1) {
                $_SESSION["admin"] = TRUE;
            } else {
                $_SESSION["admin"] = FALSE;
            }

            mysqli_free_result($result);
            return true;
        }

    }

    return false;
}

function addCollectibleToUser() {
    if (!isset($_POST['collectible'])) {
        $GLOBALS['result']['error'] = 'Stress! Geen collectible title gegeven';
    }

    $table1 = "Collectibles C";

    $query = sprintf("SELECT C.cID FROM %s WHERE C.cTitle = '%s'", $table1, $_POST['collectible']);
    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    $cID = $result -> fetch_assoc()['cID'];

    if ($cID === false) {
        $GLOBALS['result']['error'] = 'Deze collectible kennen we nog niet';
        return;
    }

    $query = sprintf("INSERT INTO HasCollected (uID, cID)
              VALUES (%d, %d)",
              $_SESSION['uID'], $cID);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

}

function addThirtyMinutes() {
    $timestamp = date("Y-m-d H:i:s", strtotime("+30 minutes"));

    $query = sprintf("DELETE FROM HasUnlocked WHERE uID = %d AND pID = %d", $_SESSION['uID'], $_POST['pID']);
    $result = mysqli_query($GLOBALS['link'], $query);

    $query = sprintf("INSERT INTO HasUnlocked (uID, pID, time_end)
              VALUES (%d, %d, '%s')",
              $_SESSION['uID'], $_POST['pID'], $timestamp);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
}

function checkThirtyMinutes() {
    $table1 = "HasUnlocked HU";

    $query = sprintf("SELECT * FROM %s WHERE HU.uID = %d AND HU.pID = %d", $table1, $_SESSION['uID'], $_POST['pID']);
    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    $time_end = $result -> fetch_assoc()['time_end'];

    if (!$time_end) {
        return false;
    } else if (new DateTime() > new DateTime($time_end)) {
        $query = sprintf("DELETE FROM HasUnlocked WHERE uID = %d AND pID = %d", $_SESSION['uID'], $_POST['pID']);
        $result = mysqli_query($GLOBALS['link'], $query);
        return false;
    } else {
        return true;
    }

}
/*function checkIfUnlocked(){
  $table1 = "HasUnlocked HU";

  $query = sprintf("SELECT * FROM %s WHERE HU.uID = %d AND HU.pID = %d", $table1, $_SESSION['uID'], $_POST['pID']);
  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  $time_end = $result -> fetch_assoc()['time_end'];

  if (!$time_end) {
      return false;
  } else if (new DateTime() > new DateTime($time_end)) {
      $query = sprintf("DELETE FROM HasUnlocked WHERE uID = %d AND pID = %d", $_SESSION['uID'], $_POST['pID']);
      $result = mysqli_query($GLOBALS['link'], $query);
      return false;
  } else {
      return true;
  }
}*/

function addCoins(){
    $query = sprintf("UPDATE Users
              SET uCoins = uCoins + %d
              WHERE uID = %d",
              $_POST['coins'], $_SESSION['uID']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
}

function coinDisplay(){
  $table1 = "Users";

  $query = sprintf("SELECT uCoins FROM %s WHERE uID = '%s'", $table1, $_SESSION['uID']);
  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  $GLOBALS["result"]["coins"] = $result->fetch_assoc()['uCoins'];
}

function doubleCoins(){
    $query = sprintf("UPDATE Users
            SET uCoins = 0
            WHERE uID = %d",
            $_SESSION['uID']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
}

function tutorialDone(){
    $query = sprintf("UPDATE Users
              SET tutorialDone = 1
              WHERE uID = %d",
              $_SESSION['uID']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
}

function tutorialEndButton(){
  $table1 = "Users";

  $query = sprintf("SELECT tutorialDone FROM %s WHERE uID = '%s'", $table1, $_SESSION['uID']);
  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  $GLOBALS["result"]["tutorialDoneCheck"] = $result->fetch_assoc()['tutorialDone'];
}

function getAvatarProperties() {
    $query = sprintf("SELECT * FROM Avatars
              WHERE aID = %d",
              $_POST['aID']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    if (mysqli_num_rows($result) == 1) {
        $row = mysqli_fetch_array($result);
        $GLOBALS["result"] = $row;
    }
}

function findAvatarID() {
    $query = sprintf("SELECT aID FROM Users
              WHERE uID = %d",
              $_SESSION['uID']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    $GLOBALS["result"]["aID"] = $result->fetch_assoc()['aID'];
}
?>
