<?php include("../includes/session.php") ?>
<?php $filename = basename(__FILE__, '.php'); ?>
<!DOCTYPE html>
<html lang="nl">
    <head>
    </head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <title>Backseat Buddy - Prototype | Game</title>

        <!-- CSS -->
        <link rel="stylesheet" href="../../../css/bsb_style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

        <!-- Libraries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script type="text/javascript" src="../../../lib/TouchEvents/src/jquery.mobile-events.min.js"></script>

        <!-- Javascript -->
        <script src="../../../js/BackseatWindmills.js"></script>
        <script src="../../../js/BackseatNAV.js"></script>
    <body>
        <!-- NAVIGATION -->
        <?php include("../includes/menu.php") ?>

        <!-- Info window -->
        <div id="sideContent" class="sideWindow">
            <a href="javascript:void(0)" class="closebtn" onclick="closeInfoWindow()">&times;</a>
            <div class="sideWindowWrapper">
                <h1 class="nowrap headerText">  </h1>

                <div class="scores">
                    <table id="scoresTabel">

                    </table>
                </div>
                <div id="tutorialContent" class="nowrap">
                </div>
                <div id="sideWindowImg">
                </div>
            </div>
    	</div>
        <!-- Show score -->
      <div id="inGameContainer">
          <a onclick="exitGame()" class="exitGame fa fa-times fa-3x nonSelectable"></a>

        <div id="inGameBoxes" class="inGame">
          <div id="ScoreText" class="box nonSelectable">
              <p>Energie: <b class='score'>0</b> kWh</p>
          </div>
          <div id="TimeText"  class="box nonSelectable">
              <p>Tijd: <b class='timeLeft'>20</b></p>
          </div>
        </div>
      </div>

        <!-- Swipe Image -->
          <div id="swipeImage" class="swipeTutorial outGame">
            <img src="../../images/game/swipeDown.png">
          </div>

        <div id="GameButtons" class="outGame">
            <!-- Start game -->
            <div id="StartButton">
                <a href="#" class="startbtn btn green nonSelectable"><b>Start</b></a>
            </div>
            <!-- Highscores -->
            <div id="HighScoreButton">
                <a onclick="openHighscores()" class="btn blue nonSelectable">Highscores</a>
            </div>
            <!-- Tutorial Button -->
            <div id="TutorialButton">
                <a onclick="openTutorial()" class="btn pink nonSelectable">Tutorial</a>
            </div>
        </div>

    </body>
</html>
