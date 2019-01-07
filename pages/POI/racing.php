<?php include("../includes/session.php") ?>
<?php $filename = basename(__FILE__, '.php'); ?>
<!DOCTYPE html>
<html lang="nl">
    <head>
    </head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<meta charset="utf-8">

	<title>Backseat Buddy - Prototype | Game</title>

	<!-- CSS -->
	<link rel="stylesheet" href="/css/bsb_style.css">
	<link rel="stylesheet" href="/css/racing.css">
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<!-- Libraries -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script>function keyHandler () { }</script>

	<!-- Javascript - Racing script is located at the bottom of the page -->
	<script src="/js/BackseatGeneral.js"></script>
	<script src="/js/BackseatCheck.js"></script>
	<script src="/js/BackseatNAV.js"></script>

	<!-- Google Tag Manager Header -->
	<?php readfile("../includes/tagmanagerHeader.php") ?>
<body onkeydown="keyHandler(event)" onkeyup="keyHandler(event)">
	<!-- NAVIGATION -->
	<?php include("../includes/menu.php") ?>

	<!-- Google Tag Manager Body -->
	<?php readfile("../includes/tagmanagerBody.php") ?>

	<!-- Info window -->
	<div id="sideContent" class="sideWindow">
			<a href="javascript:void(0)" class="closebtn" onclick="closeSideWindow()">&times;</a>
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

	<!-- Start Game Content -->
	<div id="notLandscape">
		Voor dit spel moet je je scherm een kwartslag draaien! <br />
		<i class="fas fa-mobile-alt" style="font-size:150px; transform: rotate(270deg); margin-top:20px;"></i>
	</div>
	<div id="landscape">

				<div id="touchSteeringContainer">
					<div id="touchLeft" class="inline"> <div class="steeringText b "> Stuur <br /> links </div> </div>
					<div id="touchMiddle" class="inline"> <div class="steeringText "> <i>Hoe te spelen: </i> <br /> <b> Remmen </b> </div> </div>
					<div id="touchRight" class="inline"> <div class="steeringText b "> Stuur <br /> rechts </div> </div>
					<div id="tiltPhone"> <div class="steeringText b "> Geef gas door je telefoon van je af te draaien </div> </div>
					<div id="startAfterTutorial"> Starten! </div>
				</div>

		<div id="container">
			<div id="canvasContainer">
				<canvas id="raceTrack"></canvas>
			</div>

			<a onclick="exitGame()" class="exitGame fa fa-times fa-3x nonSelectable" style="top: 90px; z-index: 3; display: none;"></a>

			<div id="GameButtons" class="racingMenu">
					<!-- Start game -->
					<div id="StartButton">
							<a href="#" class="startbtn btn green nonSelectable"><b>Start</b></a>
					</div>
					<!-- Highscores -->
					<div id="HighScoreButton">
							<a onclick="openSideWindow('highscores')" class="btn blue nonSelectable">Highscores</a>
					</div>
					<!-- Tutorial Button -->
					<div id="TutorialButton">
							<a onclick="openSideWindow('tutorial')" class="btn pink nonSelectable">Tutorial</a>
					</div>
			</div>

			<div id="statsContainer">
				<div class="box">
						<div class="raceStats center"> <i class="fas fa-tachometer-alt"></i> <div id="speed" class="b inline">0.00</div> km/u </div>
						<div class="raceStats center"> <i class="far fa-clock"></i> <div id="lapTime" class="b inline">0.00</div> sec </div>
						<div class="raceStats center"> <i class="fas fa-trophy"></i> <div id="fastestLapTime" class="b inline">0.00</div> sec </div>
						<div class="raceStats center"> <i class="fas fa-arrow-left"></i> <div id="lastLapTime" class="b inline">0.00</div> sec </div>
						<div id="fpsElement" class="fps">60</div>
				</div>
			</div>

      <!-- Show last score after playing -->
      <div id="lastScore" class="hideOnStart outGame">
          <p class="boxShadow">
            Laatste tijd: <b class='lastScore boxShadow'></b> sec <br />
            <a onclick="openSideWindow('highscores')">Higscore plek: <b class='lastHighScore boxShadow'></b></a>
          </p>
          <div id="coinsWonContainer">
            <img src="/images/other/bsbCoin.png" style="width:20px;" />
            <div id="coinsWon">
            </div>
          </div>
      </div>
		</div>
		<div class="hidden"><img id="track"><img id="hiddenTrack"><canvas id="hiddenCanvas" width="750" height="500"></canvas></div>

	</div>

		<script>
    (function() {
        var
        // Obtain a reference to the canvas element using its id.
        htmlCanvas = document.getElementById('raceTrack'),
        // Obtain a graphics context on the canvas element for drawing.
        context = htmlCanvas.getContext('2d');

       // Start listening to resize events and draw canvas.
       initialize();

       function initialize() {
           // Register an event listener to call the resizeCanvas() function
           // each time the window is resized.
           window.addEventListener('resize', resizeCanvas, false);
           // Draw canvas border for the first time.
           resizeCanvas();
        }

        // Display custom canvas. In this case it's a blue, 5 pixel
        // border that resizes along with the browser window.
        function redraw() {
           context.strokeStyle = 'blue';
           context.lineWidth = '5';
           context.strokeRect(0, 0, window.innerWidth, (window.innerHeight-33));
        }

        // Runs each time the DOM window resize event fires.
        // Resets the canvas dimensions to match window,
        // then draws the new borders accordingly.
        function resizeCanvas() {
            htmlCanvas.width = window.innerWidth;
            htmlCanvas.height = (window.innerHeight-33);
            redraw();
        }
    })();

    </script>
		<script src='/js/BackseatRacing.js'></script>
	</body>
</html>
