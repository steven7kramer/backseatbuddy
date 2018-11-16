var windMillHead;
var startAngle;
var gameIsActive = false;
var MINIMUM_SPEED = 0.005;
var windowOpen = false;
var userLocation;

jQuery(document).ready(function() {
    startGame();
});

function startGame() {
    myGameArea.start();
    windMillHead = new component(477, 447, "../../../images/game/windmill_head.png", window.innerWidth / 2, 300, true);
    windMillPost = new component(477, 371, "../../../images/game/windmill_post.png", window.innerWidth / 2, 480, false);

    jQuery('#gameCanvas').swipedown(function(e, touch) {
        var swipeSpeed = Math.min(5, touch.yAmount / touch.duration); // Gives speed in pixels/millisecond
        windMillHead.rotateVelocity = swipeSpeed;
    });

    jQuery('.startbtn').click(function() {
        if (windowOpen) {
            closeHighScores();
        }
        jQuery('#GameButtons').fadeOut();
        gameIsActive = true;
        startAngle = windMillHead.angle;

        setTimeout(function() {
            jQuery('#GameButtons').fadeIn();
            gameIsActive = false;
            saveHighscore(Math.round(windMillHead.angle - startAngle));
            windMillHead.angle = 0;
        }, 20000);
    });
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
    }
}

function saveHighscore(score) {
    jQuery.ajax({
        type: "POST",
        url: "../../php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'saveHighscore', pID: 1, score: score},

        success: function(obj, textstatus) {
            if (!('error' in obj)) {
                console.log("Saved highscore " + score + " in the database" );
            } else {
                console.error("Failed to save highscore " + score + " in the database" );
            }
        }
    });
}

function openHighscores() {
    if (windowOpen) {
        closeHighScores();
    } else {
        windowOpen = true;
        var width = $( document ).width();
        var height = $( document ).height();
        getHighscoresFromDB();

        if (width >= height) {
            $('.nowrap').css('width', 400 * 0.8 + "px");
            $('#sideContent').css({'width': '400px', 'box-shadow': '5px 0px 8px #2b2b2b77'});
        } else {
            $('.nowrap').css('width', width * 0.8 + "px");
            $('#sideContent').css('width', '100%');
        }
    }
}

function getHighscoresFromDB() {
    jQuery.ajax({
        type: "POST",
        url: "../../php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'getHighscores'},

        success: function(obj, textstatus) {
            if (!('error' in obj)) {
                jQuery('#scoresTabel').empty();
                jQuery('#scoresTabel').append("<tr><th>#</th><th>Naam</th><th>Score</th><tr>)");
                jQuery.each(obj.highscores, function(index, value) {
                    if (index + 1 > 3) {
                        var HTMLString =  "<tr><td class='cellcentered'>" + (index + 1) + "</td><td>" + value.uEmail + "</td><td>" + value.score + "</td></tr>";
                    } else {
                        var HTMLString =  "<tr><td class='cellcentered'><img src='../../../images/game/hs_no" + (index + 1) + ".png' style='width:35px;'/></td><td>" + value.uEmail + "</td><td>" + value.score + "</td></tr>";
                    }
                    jQuery('#scoresTabel').append(HTMLString);
                });
            } else {
                console.error("Failed to retrieve highscores from the database" );
            }
        }
    });
}

function closeHighScores() {
    windowOpen = false;
    $('#sideContent').css({'width': '0', 'box-shadow': 'none'});
}
