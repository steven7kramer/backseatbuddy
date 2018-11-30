var windMillHead;
var startAngle;
var gameIsActive = false;
var MINIMUM_SPEED = 0.005;
var windowOpen = false;
var userLocation;
var gameTimerVar;
var gameTimer = 20000;
var firstSwipe = true;
var currentWindow = '';
var score;
var savedHighscore;

jQuery(document).ready(function() {
    jQuery('.hideOnStart').hide();
    startGame();
});

function startGame() {
    tutorialAnimation();
    myGameArea.start();
    windMillHead = new component(477, 447, "../../../images/game/windmill_head.png", window.innerWidth / 2, 300, true);
    windMillPost = new component(400, 400, "../../../images/game/windmill_post.png", (window.innerWidth / 2) - 5, 480, false);

    jQuery('#gameCanvas').swipedown(function(e, touch) {
        var swipeSpeed = Math.min(5, touch.yAmount / touch.duration); // Gives speed in pixels/millisecond
        windMillHead.rotateVelocity = swipeSpeed;
        if(firstSwipe == true){
          jQuery('.swipeTutorial').fadeOut();
          firstSwipe = false;
        }
    });

    jQuery('.startbtn').click(function() {
        if (windowOpen) {
            closeSideWindow();
        }
        jQuery('.swipeTutorial').fadeOut();
        jQuery('.inGame').fadeIn();
        jQuery('.outGame').fadeOut();
        gameIsActive = true;
        tutorialAnimation();
        startAngle = windMillHead.angle;

        countDownTimer();
        gameTimerVar = setTimeout(function() {
            exitGame('after');
            score = Math.round(windMillHead.angle - startAngle);
            saveHighscore(score);
        }, gameTimer);
    });
}

function countDownTimer(){
  var n = gameTimer/1000;
  setTimeout(countDown,1000);
  jQuery('.timeLeft').text(n);

  function countDown(){
     n--;
     if(n > 0){
        setTimeout(countDown,1000);
     }
     jQuery('.timeLeft').text(n);
  }
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.id = "gameCanvas";
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, src, x, y, rotate) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.rotateVelocity = MINIMUM_SPEED;
    this.rotateAcceleration = 0.90;
    this.image = new Image();
    this.image.src = src;

    this.update = function(){
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        if (rotate) {
            ctx.rotate(this.angle);
        }
        ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }

    this.newVelocity = function() {
        this.rotateVelocity = Math.max(this.rotateVelocity * this.rotateAcceleration, 0);
        if (this.rotateVelocity < MINIMUM_SPEED) {
            this.rotateVelocity = MINIMUM_SPEED;
        }
    }

    this.newAngle = function() {
        this.angle += this.rotateVelocity;
    }
}

function updateGameArea() {
    myGameArea.clear();
    windMillPost.update();
    windMillHead.newVelocity();
    windMillHead.newAngle();
    windMillHead.update();
    if (gameIsActive) {
        jQuery('.score').text(Math.round(windMillHead.angle - startAngle));
        jQuery('.timeLeft').text();
    }
}

function saveHighscore(score) {
    savedHighscore = false;
    jQuery.ajax({
        type: "POST",
        url: "../../php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'saveHighscore', pID: 1, score: score},

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
          jQuery('#tutorialContent').text('Wek zoveel mogelijk energie op binnen 20 seconde door de windmolen zo hard mogelijk te laten draaien. Dit doe je door naar beneden te swipen. Als je er klaar voor bent, druk dan op Start! In het spel kan je de opgewekte energie zien, en hoeveel tijd je nog over hebt.');
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

function getHighscoresFromDB(moment) {
    jQuery.ajax({
        type: "POST",
        url: "../../php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'getHighscores'},

        success: function(obj, textstatus) {
            if (!('error' in obj)) {
              if(moment == 'loadTop10'){
                  jQuery('#scoresTabel').empty();
                  jQuery('#scoresTabel').append("<tr><th>#</th><th>Naam</th><th>Score</th><tr>)");
                  jQuery.each(obj.highscores, function(index, value) {
                      if (index + 1 > 3) {
                          var HTMLString =  "<tr><td class='cellcentered'>" + (index + 1) + "</td><td>" + value.uEmail + "</td><td>" + value.score + "</td></tr>";
                      } else {
                          var HTMLString =  "<tr><td class='cellcentered'><img src='../../../images/game/hs-no" + (index + 1) + ".png' style='width:35px;'/></td><td>" + value.uEmail + "</td><td>" + value.score + "</td></tr>";
                      }
                      jQuery('#scoresTabel').append(HTMLString);
                  });
              }else if(moment == 'lastHighscorePlace'){

                    for(i=0;i<obj.highscores.length;i++){
                      //if the score appears in the top 10, return that data into showLastScore()
                      console.log('score = ' + score);
                      console.log(obj.highscores[i].score);

                      if(score == obj.highscores[i].score){
                        showLastScore(score, (i+1));
                        break;
                      }
                      if(i == (obj.highscores.length - 1)){
                      //if at the end of the for loop, the score hasn't been found, it's not in top 10
                        showLastScore(score, 'Geen top 10');
                    }
                  };
                }
              } else {
                console.error("Failed to retrieve highscores from the database" );
            }
        }
    });
}
function closeSideWindow() {
    windowOpen = false;
    $('#sideContent').css({'width': '0', 'box-shadow': 'none'});
    jQuery('#scoresTabel').empty();
    jQuery('#tutorialContent').empty();
    jQuery('#sideWindowImg').empty();
}

function tutorialAnimation(){
  //get the div with the image
  var elem = document.getElementById("swipeImage");

  //placing the div
  const startPos = 200;
  elem.style.left = (window.innerWidth / 2) + 100 + 'px';
  elem.style.top = startPos + 'px';

  //animate the div
  var pos = startPos;
  var id = setInterval(frame, 10);
  var n = 0;

    function frame() {
        if(n < 400){
          if(pos == startPos + 100) {
              setTimeout(function(){ pos = startPos; n+=1;}, 1000);
          }else{
              pos++;
              elem.style.top = pos + 'px';
          }
        }else{
          jQuery('.swipeTutorial').fadeOut();
          clearInterval(id);
        }
    }
}

function showLastScore(score, lastHighscorePlace){
  jQuery('.lastScore').text(score);
  jQuery('.lastHighScore').text(lastHighscorePlace);
  if(lastHighscorePlace < 4){
    $('.lastHighScore').prepend('<img id="trophyImg" src="../../images/game/hs-no' + lastHighscorePlace + '.png" style="width: 35px;"/>');
  }
  jQuery('#lastScore').fadeIn();
}

function exitGame(moment){
  if(moment == 'after'){
    jQuery('.outGame').fadeIn();

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

  }else if(moment == 'during'){
    jQuery('.outGame').fadeIn();
    jQuery('#lastScore').hide();
  }
  jQuery('.inGame').fadeOut();
  clearTimeout(gameTimerVar);
  gameIsActive = false;
}