<?php

header('Content-Type: application/json');

session_start();

$result = array();
$points = array();
$collectibles = array();
$Highscores = array();
$infoPoints = array();
$quizQuestion = array();
$gameChecker = array();
$loadCar = array();
$loadAvatar = array();
$checkIfUnlocked = array();
$usernameEmail = array();
$overlayCheck = array();
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
                $result['Highscores'] = $GLOBALS['Highscores'];
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
        case 'checkIfUnlocked':
            if (connect()) {
                checkIfUnlocked();
                $result['checkIfUnlocked'] = $GLOBALS['checkIfUnlocked'];
            }
            break;
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
        case 'infoPointLoader':
            if (connect()) {
                infoPointLoader();
                $result['infoPoints'] = $GLOBALS['infoPoints'];
            }
            break;
      case 'quizLoader':
          if (connect()) {
              quizLoader();
              $result['quizQuestion'] = $GLOBALS['quizQuestion'];
          }
          break;
      case 'gameChecker':
          if (connect()) {
              gameChecker();
              $result['gameChecker'] = $GLOBALS['gameChecker'];
          }
          break;
      case 'loadCar':
          if (connect()) {
              loadCar();
              $result['loadCar'] = $GLOBALS['loadCar'];
          }
          break;
      case 'selectCar':
          if (connect()) {
              selectCar();
          }
          break;
      case 'buyCar':
          if (connect()) {
              buyCar();
          }
          break;
      case 'loadAvatar':
          if (connect()) {
              loadAvatar();
              $result['loadAvatar'] = $GLOBALS['loadAvatar'];
          }
          break;
      case 'selectAvatar':
          if (connect()) {
              selectAvatar();
          }
          break;
      case 'buyAvatar':
          if (connect()) {
              buyAvatar();
          }
          break;
      case 'usernameEmail':
          if (connect()) {
              usernameEmail();
              $result['usernameEmail'] = $GLOBALS['usernameEmail'];
          }
          break;
      case 'editUsername':
          if (connect()) {
              editUsername();
          }
          break;
      case 'overlayCheck':
          if (connect()) {
              overlayCheck();
              $result['overlayCheck'] = $GLOBALS['overlayCheck'];
          }
          break;
      case 'giveFeedback':
          if(connect()) {
              $result['error'] = "none";
              giveFeedback();
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
    $table2 = "Users U";

    switch ($_POST['game']) {
        case 'windmills':
            $table1 = "HighscoresWindmill H";
            $query = sprintf("SELECT U.uUsername, H.score FROM %s, %s WHERE U.uID = H.uID AND H.contentID = %d ORDER BY H.score DESC LIMIT 10", $table1, $table2, $_POST['contentID']);
            break;
        case 'racing':
            $table1 = 'HighscoresRacing H';
            $query = sprintf("SELECT U.uUsername, H.score FROM %s, %s WHERE U.uID = H.uID AND H.contentID = %d ORDER BY H.score ASC LIMIT 10", $table1, $table2, $_POST['contentID']);
            break;
        default:
            $result['error'] = 'Specified game not found';
            break;
    }
    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    while ($row = $result -> fetch_assoc()) {
        array_push($GLOBALS['Highscores'], $row);
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
    $timestamp = date("Y-m-d H:i:s", strtotime("+30 minutes"));

    switch ($_POST['game']) {
        case 'windmills':
            $table = 'HighscoresWindmill';
            break;
        case 'racing':
            $table = 'HighscoresRacing';
            break;
        default:
            $result['error'] = 'Specified game not found';
            break;
    }

    $query = sprintf("INSERT INTO $table (contentID, uID, score, date)
              VALUES ('%d', '%d', '%d', '%s')",
              $_POST['contentID'], $_SESSION['uID'], $_POST['score'], $timestamp);

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
    $username = $_POST["uUsername"];

    if (strlen($_POST["uUsername"]) > 15) {
      $GLOBALS['result']['error'] = "Je username mag maximaal 15 tekens hebben!";
      return;
    }

    $query = sprintf("SELECT * FROM Users WHERE uUsername = '%s'", $_POST['uUsername']);
    $result = mysqli_query($GLOBALS['link'], $query);

    if (mysqli_num_rows($result) > 0) {
        $GLOBALS['result']['error'] = "Deze username is al in gebruik!";
        return;
    }

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

    $query = sprintf("INSERT INTO Users (uID, uEmail, uUsername, uPassword)
              VALUES (NULL, '%s', '%s', '%s')",
              $email, $username, $password);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    $_POST['uEmail'] = $email;
    checkDBForUser();

    //add the default car to the user
    $query = sprintf("INSERT INTO CarsOwned (uID, carID, current, unq) VALUES (%d, DEFAULT, DEFAULT, DEFAULT)", $_SESSION['uID']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    //add the default avatar to the user
    $query = sprintf("INSERT INTO AttachAvatars (uID, aID, current, unq) VALUES (%d, DEFAULT, DEFAULT, DEFAULT)", $_SESSION['uID']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
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
            $_SESSION["username"] = $row['uUsername'];
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
function checkIfUnlocked(){
  $table1 = "PointsOfInterest";

  $query = sprintf("SELECT lng, lat FROM %s WHERE pIcon = %d AND contentID = %d", $table1, $_POST['pType'], $_POST['contentID']);
  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  while ($row = $result -> fetch_assoc()) {
      array_push($GLOBALS['checkIfUnlocked'], $row);
  }

  mysqli_free_result($result);
}

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
    $table1 = "AttachAvatars AA";
    $table2 = "Avatars A";

    $query = sprintf("SELECT aID, aGlasses, glassColour FROM %s NATURAL JOIN %s WHERE AA.uID = %d AND AA.aID = %d", $table1, $table2, $_SESSION['uID'], $_POST['aID']);

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
    $table1 = "AttachAvatars AA";
    $table2 = "Avatars A";

    if($_POST['moment'] == "all"){
      $query = sprintf("SELECT aID FROM %s NATURAL JOIN %s WHERE AA.uID = %d", $table1, $table2, $_SESSION['uID']);
    }else if($_POST['moment'] == "current"){
      $query = sprintf("SELECT aID FROM %s NATURAL JOIN %s WHERE AA.uID = %d AND AA.current = 1", $table1, $table2, $_SESSION['uID']);
    }

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    $GLOBALS["result"]["aID"] = $result->fetch_assoc()['aID'];
}

function infoPointLoader(){
  $table1 = "InfoRelation IR";
  $table2 = "InfoPoints";
  $table3 = "InfoSlides";

  $query = sprintf("SELECT * FROM %s NATURAL JOIN %s NATURAL JOIN %s WHERE IR.ipID = %d", $table1, $table2, $table3, $_POST['ipID']);
  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  while ($row = $result -> fetch_assoc()) {
      array_push($GLOBALS['infoPoints'], $row);
  }

  mysqli_free_result($result);
}

function quizLoader(){
  $table1 = "QuizContainer QC";
  $table2 = "QuizQuestions QQ";
  $table3 = "QuizAnswers QA";
  $table4 = "QuizRelQuestions QRQ";
  $table5 = "QuizRelAnswers QRA";

  $query = sprintf("SELECT * FROM %s NATURAL JOIN %s NATURAL JOIN %s NATURAL JOIN %s NATURAL JOIN %s WHERE QC.qID = %d", $table1, $table2, $table3, $table4, $table5, $_POST['qID']);

  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  while ($row = $result -> fetch_assoc()) {
      array_push($GLOBALS['quizQuestion'], $row);
  }

  mysqli_free_result($result);
}

function gameChecker(){
  $table = "PointsOfInterest";

  $query = sprintf("SELECT contentID FROM %s WHERE pCategory = '%s'", $table, $_POST['category']);

  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  while ($row = $result -> fetch_assoc()) {
      array_push($GLOBALS['gameChecker'], $row);
  }

  mysqli_free_result($result);
}

function loadCar(){
  $table1 = "AllCars ac";
  $table2 = "CarsOwned co";

  // check on which page the call is made. In index, only the current car should load
  if($_POST['moment'] == 'index'){
    $query = sprintf("SELECT carType, carColour, carStrokeColour FROM %s NATURAL JOIN %s WHERE uID = %d AND current = 1", $table1, $table2, $_SESSION['uID']);
  }else{
    $query = sprintf("SELECT carID, carType, carColour, carStrokeColour, carCosts, current FROM %s NATURAL JOIN %s WHERE uID = %d

    UNION ALL

    SELECT DISTINCT carID, carType, carColour, carStrokeColour, carCosts, ''
    FROM %s
    WHERE NOT EXISTS(
        SELECT * FROM %s
        WHERE co.carID = ac.carID AND co.uID = %d)

    ORDER BY current DESC, carCosts", $table1, $table2, $_SESSION['uID'], $table1, $table2, $_SESSION['uID']);
  }

  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  while ($row = $result -> fetch_assoc()) {
      array_push($GLOBALS['loadCar'], $row);
  }

  mysqli_free_result($result);
}

function selectCar(){
    // first set all currents to 0
    $query = sprintf("UPDATE CarsOwned
              SET current = 0
              WHERE uID = %d",
              $_SESSION['uID']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    // then set selected car current to 1
    $query = sprintf("UPDATE CarsOwned
              SET current = 1
              WHERE uID = %d AND carID = %d",
              $_SESSION['uID'], $_POST['carID']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
}

function buyCar(){
  //set current car to 0, since the bought car will be the new current car
  $query = sprintf("UPDATE CarsOwned
            SET current = 0
            WHERE uID = %d",
            $_SESSION['uID']);

  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  //add bought car to CarsOwned
  $query = sprintf("INSERT INTO CarsOwned (uID, carID, current, unq)
      VALUES(%d, %s, '1', DEFAULT)", $_SESSION['uID'], $_POST['carID']);

  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  // subtract costs for car of total coins
  $query = sprintf("UPDATE Users
            SET uCoins = uCoins - %d
            WHERE uID = %d",
            $_POST['costs'], $_SESSION['uID']);

  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }
}

// START AVATAR //
function loadAvatar(){
  $table1 = "Avatars AV";
  $table2 = "AttachAvatars AA";

  // check on which page the call is made. In index, only the current avatar should load
  if($_POST['moment'] == 'index'){
    $query = sprintf("SELECT aID, aGlasses, glassColour FROM %s NATURAL JOIN %s WHERE uID = %d AND current = 1", $table1, $table2, $_SESSION['uID']);
  }else{
    $query = sprintf("SELECT aID, aGlasses, glassColour, costs, current FROM %s NATURAL JOIN %s WHERE uID = %d

    UNION ALL

    SELECT DISTINCT aID, aGlasses, glassColour, costs, ''
    FROM %s
    WHERE NOT EXISTS(
        SELECT * FROM %s
        WHERE AA.aID = AV.aID AND AA.uID = %d)

    ORDER BY current DESC, costs", $table1, $table2, $_SESSION['uID'], $table1, $table2, $_SESSION['uID']);
  }

  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  while ($row = $result -> fetch_assoc()) {
      array_push($GLOBALS['loadAvatar'], $row);
  }

  mysqli_free_result($result);
}
function selectAvatar(){
    // first set all currents to 0
    $query = sprintf("UPDATE AttachAvatars
              SET current = 0
              WHERE uID = %d",
              $_SESSION['uID']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }

    // then set selected car current to 1
    $query = sprintf("UPDATE AttachAvatars
              SET current = 1
              WHERE uID = %d AND aID = %d",
              $_SESSION['uID'], $_POST['aID']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
}

function buyAvatar(){
  //set current car to 0, since the bought car will be the new current car
  $query = sprintf("UPDATE AttachAvatars
            SET current = 0
            WHERE uID = %d",
            $_SESSION['uID']);

  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  //add bought car to CarsOwned
  $query = sprintf("INSERT INTO AttachAvatars (uID, aID, current, unq)
      VALUES(%d, %s, '1', DEFAULT)", $_SESSION['uID'], $_POST['aID']);

  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  // subtract costs for avatar of total coins
  $query = sprintf("UPDATE Users
            SET uCoins = uCoins - %d
            WHERE uID = %d",
            $_POST['costs'], $_SESSION['uID']);

  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }
}
// END AVATAR //

function usernameEmail(){
  $table = "Users";

  $query = sprintf("SELECT uUsername, uEmail FROM %s WHERE uID = %d", $table, $_SESSION['uID']);

  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  while ($row = $result -> fetch_assoc()) {
      array_push($GLOBALS['usernameEmail'], $row);
  }

  mysqli_free_result($result);
}

function editUsername(){
    $query = sprintf("UPDATE Users
              SET uUsername = '%s'
              WHERE uID = %s",
              $_POST['username'], $_SESSION['uID']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
}

function overlayCheck(){
  $table = "Users";

  if($_POST['moment'] == "initiate"){
    $query = sprintf("SELECT dashDone FROM %s WHERE uID = '%s'", $table, $_SESSION['uID']);
  }else if($_POST['moment'] == "done"){
    $query = sprintf("UPDATE %s SET dashDone = 1 WHERE uID = '%s'", $table, $_SESSION['uID']);
  }

  $result = mysqli_query($GLOBALS['link'], $query);

  if (!$result) {
      $message  = 'Invalid query: ' . mysqli_error() . "\n";
      $message .= 'Whole query: ' . $query;
      die($message);
  }

  if($_POST['moment'] == "initiate"){
    while ($row = $result -> fetch_assoc()) {
        array_push($GLOBALS['overlayCheck'], $row);
    }

    mysqli_free_result($result);
  }
}

function giveFeedback() {

    $query = sprintf("INSERT INTO Feedback (fID, uID, cijfer, goed, kanbeter)
              VALUES (DEFAULT, %s, %s, '%s', '%s')",
              $_SESSION['uID'], $_POST['cijfer'], $_POST['goed'], $_POST['kanbeter']);

    $result = mysqli_query($GLOBALS['link'], $query);

    if (!$result) {
        $message  = 'Invalid query: ' . mysqli_error() . "\n";
        $message .= 'Whole query: ' . $query;
        die($message);
    }
}
?>
