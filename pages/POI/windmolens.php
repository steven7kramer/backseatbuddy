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
        <div id="sideContent" class="highScoresWindow">
            <a href="javascript:void(0)" class="closebtn" onclick="closeHighScores()">&times;</a>
            <div class="BHighscoreWrapper">
                <h1 class="nowrap"> Top 10 </h1>

                <div class="scores">
                    <table id="scoresTabel">

                    </table>
                </div>
            </div>
    	</div>

        <!-- Show score -->
      <div id="inGameContainer">
        <div id="exitGame" class="inGame">
          <a href="#" class=""><i class="fas fa-arrow-alt-circle-left"></i></a>
        </div>

        <div id="inGameBoxes" class="inGame">
          <div id="ScoreText" class="">
              <p>Energie: <b class='score'>0</b> kWh</p>
          </div>
          <div id="TimeText"  class="">
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
                <a href="#" class="startbtn btn green">Start</a>
            </div>
            <!-- Highscores -->
            <div id="HighScoreButton">
                <a onclick="openHighscores()" class="btn blue">Highscores</a>
            </div>
            <!-- Tutorial Button -->
            <div id="TutorialButton">
                <a onclick="openTutorial()" class="btn pink">Tutorial</a>
            </div>
        </div>

    </body>
</html>
