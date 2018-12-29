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
	<link rel="stylesheet" href="/css/bsb_style.css">
	<link rel="stylesheet" href="/css/racing.css">
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

	<!-- Start PageContent -->

				<div id="touchSteeringContainer">
					<div id="touchLeft" class="inline"></div>
					<div id="touchMiddle" class="inline"></div>
					<div id="touchRight" class="inline"></div>
				</div>
				
		<div id="container">
			<div id="canvasContainer">
				<canvas id="raceTrack"></canvas>
			</div>

			<div id="statsContainer">
				<div class="box">
						<div class="raceStats center"> Snelheid: <div id="speed" class="b inline">0.00</div> km/u </div>
						<div class="raceStats center"> Ronde: <div id="lapTime" class="b inline">0.00</div> sec </div>
						<div class="raceStats center"> Snelste: <div id="fastestLapTime" class="b inline">0.00</div> sec </div>
						<div class="raceStats center"> Laatste: <div id="lastLapTime" class="b inline">0.00</div> sec </div>
				</div>
			</div>
		</div>
		<div class="hidden"><img id="track"><img id="hiddenTrack"><canvas id="hiddenCanvas" width="750" height="500"></canvas></div>

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
