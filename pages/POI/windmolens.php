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
        <div id="ScoreText">
            <p>Hoeveelheid energie: <b class='score'>0</b> kWh</p>
        </div>
        <div id="TimeText">
            <p>Tijd over: <b class='timeLeft'>20</b> seconde</p>
        </div>

        <!-- Swipe Image -->
          <div id="swipeImage">
            <img src="../../images/game/swipeDown.png">
          </div>

        <div id="GameButtons">
            <!-- Start game -->
            <div id="StartButton">
                <a href="#" class="startbtn btn green">Bring it on!</a>
            </div>
            <!-- Start game -->
            <div id="HighScoreButton">
                <a onclick="openHighscores()" class="hsbtn btn blue">Highscores</a>
            </div>
        </div>

    </body>
</html>
