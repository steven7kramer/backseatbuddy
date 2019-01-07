/* GLOBAL VARS */
var firstLap;
var steerLeft;
var steerRight;
var touchBrake;

var startX;
var startY;
var startAlfa;

var firstStart = true;

var speed;

var phoneTilted;
var windowOpen = false; // sideWindow for tutorial and highscore

var fpsElement = document.getElementById('fpsElement');

var savedHighscore;
var dbLapTime;

function getURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }

    return -1;
}

var contentID = getURLParameter('id');
if(contentID == 0){
  speed = 10;
}else if(contentID == 1){
  speed = 4;
}

/* Touch Steering */

$(document).ready(function(){
	// Device orientation motion event listener for accelerating
	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', deviceOrientationHandler, false);
		console.log("Orientation is supported in this browser!");
	}
});


/*
 * Car Object
 */
function Car (x, y, alfa, color, maxVelocity, radius) {
	this.x = x;					// X coordinate
	this.y = y;					// Y coordinate
	this.alfa = alfa == null ? Math.PI / 2 : alfa;	// Angle
	this.v = 0;					// Velocity
	this.v0 = 0.5;				//

	this.a = 1.025;				// Acceleration pixels/frame^2
	this.maxVelocity = maxVelocity == null ? speed : maxVelocity;	// Maximum velocity - change to increase top speed

	this.color = color == null ? '#4A96AD' : color;	// Car's color
	this.r = radius == null ? 10 : radius;			// Radius

	/* Car's representation */
	this.repr = function (c, x, y) {
		c.fillStyle = this.color;
		c.beginPath();
		c.arc(Math.round(x), Math.round(y), this.r, -1 * Math.PI / 2 - this.alfa, Math.PI / 2 - this.alfa);
		c.fill();
	}

	this.reprShadow = function(c, x, y, alfa) {
		c.globalAlpha = 0.5;
		c.fillStyle = '#999';
		c.beginPath();
		c.arc(Math.round(x), Math.round(y), this.r, -1 * Math.PI / 2 - alfa, Math.PI / 2 - alfa);
		c.fill();
		c.globalAlpha = 1;
	}

	/* Collision algorithms */
	/*
	// Prototype
	this.collision = function () {
		return !onTheRoad(this.x, this.y);
	};
	// */

	// /*
	// Bounding half-circle
	this.collision = function () {
		if (this.x < 0 || this.y < 0 || this.x > track.w - 1 || this.y > track.h - 1) return false;
		if (!onTheRoad(this.x, this.y)) return true;

		var x, y;
		for (var r = this.r; r > 0; r--) {
			for (var alfa = -1 * Math.PI / 2; alfa < Math.PI / 2; alfa += Math.PI / 10) {
				x = ~~(r * Math.cos(alfa + this.alfa));
				y = ~~(r * Math.sin(alfa - this.alfa));
				if ((this.x + x < 0) || (this.y + y < 0) || (this.x + x > track.w - 1) || (this.y + y > track.h - 1)) continue;
				if (!onTheRoad(this.x + x, this.y + y)) return true;
			}
		}
		return false;
	}
	// */

	/*
	// Checks all pixels in a rectangle/square (bounding box)
	this.collision = function () {
		for (var i = -1 * this.r + 1; i < this.r - 1; i += 1) {
			for (var j = -1 * this.r; j <this.r; j += 1) {
				if ((this.x + i < 0) || (this.y + j < 0) || (this.x + i > track.w - 1) || (this.y + j > track.h - 1)) continue;
				if (!onTheRoad(this.x + i, this.y + j)) return true;
			}
		}
		return false;
	};
	// */

	// Checkpoints
	this.checkpoints = [ false, false ];
	this.allCheckpoints = function () {
		for (var i = 0; i < this.checkpoints.length; i++) {
			if (!car.checkpoints[i]) return false;
		}
		return true;
	}
	this.resetCheckpoints = function () {
		for (var i = 0; i < this.checkpoints.length; i++) this.checkpoints[i] = false;
	}

	this.shadow = [];
	this.newShadow = [];
};

/*
 * Track Object
 */
function Track (name, filename, width, height, x, y, alfa, teleporter, checkpoints) {
	this.name = name;
	filename = '/lib/racing-game/tracks/' + filename;
	this.filename = filename + '.png';
	this.filenameHidden = filename + '_h.png';
	this.w = width;		// Track size
	this.h = height;
	this.x = x; 	// Car's initial position
	this.y = y;
	this.alfa = alfa == null ? Math.PI / 2 : alfa;

	/* Checkpoints
	 * Every track needs (exactly!) 2 checkpoints and a start (3 checkpoints in total). That way players can't cheat.
	 * Each checkpoint must be a rectangular area.
	 * Those 3 areas must NOT intersect! The 3 checkpoints must follow in this order (in the direction of driving): start, checkpoint 1, checkpoint 2.
	 */
	this.checkpoints = checkpoints == null ? null : checkpoints;
};

/*
 * Track's teleporter function which simulates an infinite track
 */
function infiniteTrack(carObject) {
	if (carObject.x < 0) carObject.x += track.w;
	if (carObject.y < 0) carObject.y += track.h;
	if (carObject.x > track.w) carObject.x %= track.w;
	if (carObject.y > track.h) carObject.y %= track.h;
}

/*
 * Main frame
 */
function frame () {
	if (!trackLoaded) {
		wipeCanvas();
		displayText('Laden...', 200, 100);
		setTimeout(frame, 500);
		firstLap = true;
		return;
	}

	if (show === 'menu') {
		jQuery('.startbtn').click(function() { // New game
			if(firstStart){
				startTutorial();
			}else{
				startGame();
			}
		});

		function startGame(){
			if (windowOpen) {
					closeSideWindow();
			}
			show = '321';
			countdown = (new Date()).getTime();
		}

		function startTutorial(){
			if (windowOpen) {
					closeSideWindow();
			}
			$('.racingMenu').fadeOut();
			$('#touchSteeringContainer').fadeIn();
		}

		jQuery('#startAfterTutorial').click(function(){
			$('#startAfterTutorial').fadeOut();
			firstStart = false;
			startGame();
		});
	}

	if (show === 'game') {
		// Backup
		var x = car.x,
			y = car.y;

		// Steering touch input
			// Left touch
			$('#touchLeft').on({ 'touchstart' : function(){ 	steerLeft = true; } });
			$('#touchLeft').on({ 'touchend' : function(){ 	steerLeft = false; } });

			// Right touch
			$('#touchRight').on({ 'touchstart' : function(){ 	steerRight = true; } });
			$('#touchRight').on({ 'touchend' : function(){ 	steerRight = false; } });

			// Middle touch
			$('#touchMiddle').on({ 'touchstart' : function(){ 	touchBrake = true; } });
			$('#touchMiddle').on({ 'touchend' : function(){ 	touchBrake = false; } });

		if (keyDown('UP') || phoneTilted) {
			if (car.v > 0) {
				car.v *= car.a; // How quickly you accelerate
			} else if (car.v < 0) {
				car.v *= 1 - (car.a - 1) * 5;
			} else {
				car.v = car.v0;
			}
		}else if (keyDown('DOWN')) {
			if (car.v < 0) {
				car.v *= car.a;
			} else if (car.v > 0) {
				car.v *= 1 - (car.a - 1) * 5;
			} else {
				car.v = -1 * car.v0;
			}
		} else {
			car.v *= 0.98; // Friction - How quickly you slow down without speed
		}

		// Brakes
		if (keyDown('SPACE') || touchBrake == true) {
			car.v *= Math.pow(1 - (car.a - 1), 3);
		}

		if (Math.abs(car.v) < 0.2) car.v = 0;

		// Speed limit
		if (car.v > 0) {
			if (car.v > car.maxVelocity) car.v = car.maxVelocity;
		} else if (car.v < 0) {
			if (car.v < -1 / 2 * car.maxVelocity) car.v = -1 / 2 * car.maxVelocity;
		}

		// Steering
		if (!strictSteering || car.v > 0) {
			if (keyDown('LEFT') || steerLeft == true){
				car.alfa += steeringAngle;
			} else if (keyDown('RIGHT') || steerRight == true) {
				car.alfa -= steeringAngle;
			}
		}
		if (car.alfa > 2 * Math.PI) car.alfa %= 2 * Math.PI;

		// Update car's position
		car.x += car.v * Math.cos(car.alfa);
		car.y -= car.v * Math.sin(car.alfa);

		// Collision
		if (car.collision()) {
			car.x = x;
			car.y = y;
			car.v = -1 * car.v / 1.5;
		}

		// Checkpoints
		if (track.checkpoints != null) {
			if (insideRectangle(car.x, car.y, track.checkpoints['1'])) { // Checkpoint 1
				if (car.checkpoints[0] && car.checkpoints[1]) {
					car.resetCheckpoints();
				}
				if (!car.checkpoints[0]) car.checkpoints[0] = true;
			} else if (insideRectangle(car.x, car.y, track.checkpoints['2'])) { // Checkpoint 2
				if (car.checkpoints[0]) {
					if (!car.checkpoints[1]) car.checkpoints[1] = true;
				} else {
					car.resetCheckpoints();
				}
			} else if (insideRectangle(car.x, car.y, track.checkpoints['start'])) { // Start
				if (car.allCheckpoints()) newLap();

				car.resetCheckpoints();
			}
		}

		car.newShadow.push([ car.x, car.y, car.alfa ]);
	} else if (show === 'menu') {
		// Nothing to do here
	} else if (show === '321') {
		var diff = (new Date()).getTime() - countdown;
		if (diff >= 3000) {
			time = (new Date()).getTime();
			lapTime = time;

			countdown = null;

			$('.exitGame').fadeIn();
			show = 'game';
		}
	} else {
		return;
	}

	// Track's offset
	var trackOffsetX = car.x - cNode.width / 2,
		trackOffsetY = car.y - cNode.height / 2;

	// Fix offset
	if (trackOffsetX < 0) trackOffsetX = 0;
	if (trackOffsetX > track.w - cNode.width) trackOffsetX = track.w - cNode.width;
	if (trackOffsetY < 0) trackOffsetY = 0;
	if (trackOffsetY > track.h - cNode.height) trackOffsetY = track.h - cNode.height;

	// Car's relative position to canvas
	var rX = car.x - trackOffsetX,
		rY = car.y - trackOffsetY;

	/* REDRAW EVERYTHING */
	// Redraw map
	wipeCanvas();
	c.drawImage(trackImg, -trackOffsetX, -trackOffsetY);

	// Shadow
	if (car.shadow.length > 0) {
		var shadow = car.shadow.shift();
			car.reprShadow(c, shadow[0] - trackOffsetX, shadow[1] - trackOffsetY, shadow[2]);
	}

	// Draw
	car.repr(c, rX, rY);

	if (show === 'game') {
		// GO!
		if ((new Date()).getTime() - time < 3000) {
			displayText('GO!', 100, 60);
		}
	} else if (show === 'menu') {
		if(!firstStart){
			$('.racingMenu').show();
		}
	} else if (show === '321') {
		document.getElementById("touchLeft").style.backgroundColor = "transparent";
		document.getElementById("touchRight").style.backgroundColor = "transparent";
		document.getElementById("touchMiddle").style.backgroundColor = "transparent";

		$('.steeringText').hide();

		$('.racingMenu').fadeOut();
		if (diff < 1000) {
			displayText('3', 100, 60);
		} else if (diff < 2000) {
			displayText('2', 100, 60);
		} else if (diff < 3000) {
			displayText('1', 100, 60);
		}
	}

	f++;
	requestAnimationFrame(frame);
}

/*
 * New lap
 */
function newLap () {
	var t = (new Date()).getTime();
	var n = t - lapTime;
	lastLapTime = n;
	if(n < fastestLapTime || firstLap == true){
			fastestLapTime = n;
			firstLap = false;
	}
	lapTime = t;

	car.shadow = car.newShadow;
	car.newShadow = [];

	lastLapTimeElement.innerHTML = (lastLapTime / 1000).toFixed(2);
	fastestLapTimeElement.innerHTML = (fastestLapTime / 1000).toFixed(2);

  // delete last number of string since the current variable has 1 extra
  dbLapTime = lastLapTime.toString().slice(0, -1);
  saveHighscore(dbLapTime);


    jQuery('.lastHighScore').text('');
    $('.lastHighScore').prepend('<i class="fa fa-spinner fa-spin"></i>');

    waitForIt();
    function waitForIt(){
        if (!savedHighscore) {
            setTimeout(function(){waitForIt()},100);
        } else {
          getHighscoresFromDB('lastHighscorePlace');
        }
    }
}

/*
 * Load track
 */
function loadTrack(id) {
	if (id < 0 || id >= tracks.length) return false;
	trackLoaded1 = false, trackLoaded2 = false, trackLoaded = false;
	track = tracks[id];

	// Car
	car = new Car(0, 0);
	car.x = track.x;
	car.y = track.y;
	car.alfa = track.alfa;
	car.shadow = [];
	car.newShadow = [];

  //store initial values for resetting the canvas
  startX = track.x;
  startY = track.y;
  startAlfa = track.alfa;

	if (track.name == 'Track 1') {
		car.r = 14;
		car.maxVelocity += 1;
	}

	// Remove old img node
	var node = document.getElementById('track');
	var parent = node.parentNode;
	parent.removeChild(node);
	// Create new
	node = document.createElement('img');
	node.setAttribute('id', 'track');
	node.setAttribute('onload', 'trackLoaded1 = true;');
	node.setAttribute('src', track.filename);
	parent.appendChild(node);

	// Remove old img node (hidden canvas)
	node = document.getElementById('hiddenTrack');
	parent.removeChild(node);
	// Create new
	node = document.createElement('img');
	node.setAttribute('id', 'hiddenTrack');
	node.setAttribute('onload', 'trackLoaded2 = true;');
	node.setAttribute('src', track.filenameHidden);
	parent.appendChild(node);

	cNode = document.getElementById('raceTrack');
	c = cNode.getContext('2d');

	hiddenCanvas = document.getElementById('hiddenCanvas')
	hiddenCanvas.width = track.w;
	hiddenCanvas.height = track.h;
	hiddenCanvas = hiddenCanvas.getContext('2d');

	trackImg = document.getElementById('track');
	hiddenTrackImg = document.getElementById('hiddenTrack');
	loadTrackFinish();

	// UI
	show = 'menu';

	// Reset
	speedElement.innerHTML = '0.00';
	lapTimeElement.innerHTML = '0.00';
	fastestLapTimeElement.innerHTML = '0.00';
	lastLapTimeElement.innerHTML = '0.00';

	resetFPS();

	document.getElementById('raceTrack').focus();
}

/*
 * loadTrack's helper method
 */
function loadTrackFinish () {
	if (trackLoaded1 && trackLoaded2) {
		hiddenCanvas.drawImage(hiddenTrackImg, 0, 0);

		// Pixels
		trackImageData = []; // Contains pixel data of road's position
		var k = hiddenCanvas.getImageData(0, 0, track.w, track.h).data;
		var j;
		for (var i = 0; i < k.length / 4; i += 1) {
			j = 4 * i;
			if (k[j] === 255 && k[j + 1] === 255 && k[j + 2] === 255) {
				trackImageData.push(false);
			} else {
				trackImageData.push(true);
			}
		}

		trackLoaded = true;
	} else {
		setTimeout(loadTrackFinish, 200);
	}
}

/*
 * Check whether given coordinates lie on the road.
 */
function onTheRoad (x, y) {
	var i = Math.round(y) * track.w + Math.round(x);
	return trackImageData[i];
}

/*
 * Event handler for selecting tracks

function selectTrack () {
	var id = document.getElementsByName('selectTrack')[0].value;
	loadTrack(id);
}
*/
/*
 * Display text in a box
 */
function displayText (text, x, y, fontSize) {
	fontSize = fontSize == null ? 32 : fontSize;

	c.textAlign = "center";
	c.fillStyle = '#1d71b8';
	c.strokeStyle = '#2d2e83';
	c.globalAlpha = 0.7;
	var x0 = Math.round(cNode.width / 2 - x / 2);
	var y0 = Math.round(cNode.height / 2 - y / 2);
	c.fillRect(x0, y0, x, y - Math.round(fontSize / 2));
	c.strokeRect(x0, y0, x, y - Math.round(fontSize / 2));
	c.globalAlpha = 1;

	c.font = fontSize + "px Arial";
	c.fillStyle = '#FFF';
	c.fillText(text, Math.round(cNode.width / 2), Math.round(cNode.height / 2));
}

/*
 * Wipe canvas
 */
function wipeCanvas () {
	var temp = c.fillStyle;
	c.fillStyle = "#FFF";
	c.fillRect(0, 0, cNode.width, cNode.height);
	c.fillStyle = temp;
}

/*
 * Reset fps counter
 */
function resetFPS () {
	f = 0;
	fpsTime = (new Date()).getTime();
}

/*
 * Return whether given key is pressed
 */
function keyDown (key) {
	return keys[key];
}

/*
 * Event handler method
 */
function keyHandler (e) {
	//console.log(e.type + ' ' + e.keyCode);

	if (!trackLoaded) return;

	if (show === 'menu') {
	} else if (show === 'game') { // Pause
		if (e.keyCode === 80) {

		}
	} else if (show === 'pause') { // Unpause
		if (e.keyCode === 80) {

		}
	}

	if ((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode === 32) {
		keys[keyCodes[e.keyCode]] = e.type === 'keydown';
		e.preventDefault();
	}
}

function deviceOrientationHandler(){
	var absolute = event.absolute;
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma; // gamma detects tilting the phone outwards and inwards when holding in front

	if(gamma < 0 && gamma > -80){ // if phone is tilted backwards ar enough
		phoneTilted = true;
	}else{
		phoneTilted = false;
	}
}

/*
 * Return whether coordinates (x, y) lie inside rectangle.
 */
function insideRectangle (x, y, array) {
	return (x > array[0] && x < array[1] && y > array[2] && y < array[3]);
}

var tracks = [ // title, file name, width, height, finish x, finish y, alfa, teleportation { start,checkpoint1,checkpoint2 [x1, x2, y1, y2] --> collision box }
				new Track('Zandvoort Short', 'zandvoortshort', 3248, 3756, 1377, 3593, 3.16, null, {'start' : [1332, 1361, 3487, 3685], '1' : [1106, 1134, 3487, 3685], '2' : [879, 907, 3487, 3685] }),
				new Track('Track 1', 'track', 1500, 800, 770, 80, 0, null, { 'start' : [790, 800, 5, 160], '1' : [850, 860, 5, 160], '2' : [900, 910, 5, 160] })
			 ],
	track, c, cNode, hiddenCanvas, trackImg,
	car = new Car(0, 0),
	trackLoaded1, trackLoaded2, trackLoaded,
	trackImageData,
	keyCodes = { 37 : 'LEFT', 38 : 'UP', 39 : 'RIGHT', 40 : 'DOWN', 32 : 'SPACE' },
	keys = {
			'UP' : false,
			'DOWN' : false,
			'LEFT' : false,
			'RIGHT' : false,
			'SPACE' : false
	},
	strictSteering = false, 		// You can only steer while driving
	steeringAngle = Math.PI / 60;

// UI
var show = 'menu', // menu, 321, game
	countdown,
	speedElement = document.getElementById('speed'),
	lapTimeElement = document.getElementById('lapTime'),
	fastestLapTimeElement = document.getElementById('fastestLapTime'),
	lastLapTimeElement = document.getElementById('lastLapTime'),
	time = 0;

// Debug
var debug = false;

// Load track
loadTrack(contentID);

// Select track
/*var selected,
	e = document.getElementsByName('selectTrack')[0];
e.innerHTML = '';
for (var i = 0; i < tracks.length; i++) {
	selected = track.filename == tracks[i].filename ? ' selected' : '';
	e.innerHTML += '<option value="' + i + '"' + selected + '>' + tracks[i].name + '</option>';
}*/

// Display FPS
setInterval(function () {
	if (show === 'game') {
		fpsElement.innerHTML = (f / ((new Date()).getTime() - fpsTime) * 1000).toFixed(0);
		if ((new Date()).getTime() - fpsTime > 5000) resetFPS(); // 5 seconds' average FPS
	}
}, 250);

// Display time, lap time, nr. of laps, speed
setInterval(function () {
	if (show == 'game') {
		var now = (new Date()).getTime();
		lapTimeElement.innerHTML = ((now - lapTime) / 1000).toFixed(2);
		speedElement.innerHTML = car.v.toFixed(2);
	}
}, 100);

// Debug
setInterval(function () {
	if (debug) {
		console.log(car.x + ' ' + car.y + ' ' + onTheRoad(car.x, car.y) + ' ' + car.collision());
	}
}, 1000);

frame();

function openSideWindow(toLoad) {
    if (windowOpen && currentWindow==toLoad) {
        closeSideWindow();
    } else {
        closeSideWindow();
        windowOpen = true;
        var width = $( document ).width();
        var height = $( document ).height();

        if(toLoad == 'highscores'){
          currentWindow = 'highscores';
          jQuery('.headerText').text('Top 10');
          getHighscoresFromDB('loadTop10');
        }else if(toLoad == 'tutorial'){
          currentWindow = 'tutorial';
          jQuery('.headerText').text('Tutorial');
          jQuery('#tutorialContent').text('Zet jij de snelste tijd op deze track? Sturen doe je door op het linker en rechter deel van je scherm te drukken. Gas geven doe je door je telefoon van je af te kantelen. remmen kan door op het midden van het scherm te klikken. Racen maar!');
          jQuery('#sideWindowImg').append('<img src="../../images/sofieCircle.png" class="sofieCircle">');
        }

        if (width >= height) {
            $('.nowrap').css('width', 400 * 0.8 + "px");
            $('#sideContent').css({'width': '400px', 'box-shadow': '5px 0px 8px #2b2b2b77'});
        } else {
            $('.nowrap').css('width', width * 0.8 + "px");
            $('#sideContent').css('width', '100%');
        }
    }
}
function closeSideWindow() {
    windowOpen = false;
    $('#sideContent').css({'width': '0', 'box-shadow': 'none'});
    jQuery('#scoresTabel').empty();
    jQuery('#tutorialContent').empty();
    jQuery('#sideWindowImg').empty();
}

function exitGame(){
	show = 'menu';
	$('.racingMenu').fadeIn();
	$('.exitGame').fadeOut();
  $('#lastScore').fadeOut();

	// reset position
	car.x = startX;
	car.y = startY;

	// reset rotation
	car.alfa = 0;

	// reset speed
	car.v = 0;

	// reset textfields
	speedElement.innerHTML = '0.00';
	lapTimeElement.innerHTML = '0.00';

	// reset checkpoints
	car.resetCheckpoints();

	// reset shadow
	car.shadow = [];
	car.newShadow = [];
}

function saveHighscore(score) {
    savedHighscore = false;
    jQuery.ajax({
        type: "POST",
        url: "../../php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'saveHighscore', contentID: contentID, score: score, game: 'racing'},

        success: function(obj, textstatus) {
            if (!('error' in obj)) {
                console.log("Saved highscore " + score + " in the database" );
                savedHighscore = true;
            } else {
                console.error("Failed to save highscore " + score + " in the database" );
            }
        }
    });
}

function getHighscoresFromDB(moment) {
  var dbScore;

    jQuery.ajax({
        type: "POST",
        url: "../../php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'getHighscores', contentID: contentID, game: 'racing'},

        success: function(obj, textstatus) {
            if (!('error' in obj)) {
              if(moment == 'loadTop10'){
                  jQuery('#scoresTabel').empty();
                  jQuery('#scoresTabel').append("<tr><th>#</th><th>Naam</th><th>Tijd (sec)</th><tr>)");
                  jQuery.each(obj.Highscores, function(index, value) {
                    dbScore = value.score.toString().slice(0, value.score.length - 2) + ":" + value.score.toString().slice(value.score.length - 2);
                      if (index + 1 > 3) {
                          var HTMLString =  "<tr><td class='cellcentered'>" + (index + 1) + "</td><td>" + value.uUsername + "</td><td>" + dbScore + "</td></tr>";
                      } else {
                          var HTMLString =  "<tr><td class='cellcentered'><img src='../../../images/game/hs-no" + (index + 1) + ".png' style='width:35px;'/></td><td>" + value.uUsername + "</td><td>" + dbScore + "</td></tr>";
                      }
                      jQuery('#scoresTabel').append(HTMLString);
                  });
              }else if(moment == 'lastHighscorePlace'){

                    for(i=0;i<obj.Highscores.length;i++){
                      //if the score appears in the top 10, return that data into showLastScore()
                      if(dbLapTime == obj.Highscores[i].score){
                        showLastScore(dbLapTime, (i+1));
                        saveCoins(i+1)
                        break;
                      }
                      if(i == (obj.Highscores.length - 1)){
                      //if at the end of the for loop, the score hasn't been found, it's not in top 10
                        showLastScore(dbLapTime, 'Geen top 10');
                    }
                  };
                }
              } else {
                console.error("Failed to retrieve highscores from the database" );
            }
        }
    });
}

function showLastScore(score, lastHighscorePlace){
  jQuery('.lastScore').text(score);
  jQuery('.lastHighScore').text(lastHighscorePlace);
  if(lastHighscorePlace < 4){
    $('.lastHighScore').prepend('<img id="trophyImg" src="../../images/game/hs-no' + lastHighscorePlace + '.png" style="width: 35px;"/>');
  }
  jQuery('#lastScore').fadeIn();

  window.setTimeout( fadeOut, 5000 );
  function fadeOut(){
      $('#coinsWonContainer').fadeOut();
      $('#lastScore').fadeOut();
  }
}

function saveCoins(lastHighscorePlace){
  let coinReward;
  if(lastHighscorePlace > 3){
    //the higher the place, the higher the reward
    coinReward = (11-lastHighscorePlace) * 100;
  }else{
    //top 3 gets a higher reward
    coinReward = ((11-lastHighscorePlace) * 100)+((4-lastHighscorePlace) * 200);
  }

  jQuery.ajax({
		        type: "POST",
		        url: "../../php/BackseatDB.php",
		        datatype: 'json',
		        data: {functionname: 'addCoins', coins:coinReward},

		        success: function(obj, textstatus) {
		            if (!('error' in obj)) {
		                console.log("Saved " + coinReward + " coins in the database" );
                    $.getScript("/js/BackseatGeneral.js",function(){
                      updateCoins();
                      animateCoinsWon(coinReward);
                    });
		            } else {
		                console.error("Failed to save " + coinReward + " coins in the database" );
		            }
		        }
		    });
}
