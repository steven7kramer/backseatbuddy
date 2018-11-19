<?php include("includes/session.php") ?>
<?php $filename = basename(__FILE__, '.php'); ?>


<!DOCTYPE html>
<html lang="nl">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <title>Backseat Buddy - Prototype</title>

        <!-- CSS -->
        <link rel="stylesheet" href="../css/bsb_style.css">
        <link rel="stylesheet" type="text/css" href="../lib/ChewingGrid/build/chewing-grid-atomic.css"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">


        <!-- Libraries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="../lib/SVG/svg.min.js"></script>
        <!--<link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">-->

        <!-- Javascript -->
        <script src="../js/BackseatNAV.js"></script>
        <script src="../js/BackseatCollectibles.js"></script>
        <script src="../js/Avatar/BackseatAvatar.js"></script>
        <script src="../js/Avatar/BackseatPainter.js"></script>

    </head>

    <body class='dashboard'>

        <!-- NAVIGATION -->
        <?php include("includes/menu.php") ?>

        <div class="container">

            <h2 class="no-margin-bottom">User information</h2>
            <hr class="divider"/>

            <!--  Draw an avatar -->
            <div id="bsb-avatar-drawing">
                <script>
                    var avatar = new BackseatAvatar(150, "bsb-avatar-drawing");
                </script>
            </div>

            <h2 class="no-margin-bottom">Highscores</h2>
            <hr class="divider"/>

            <div style="border-radius: 20px; background-color: #FF5454; padding: 20px;">
                <p style="color: white;"><b>Warning:</b> This is not implemented yet</p>
            </div>
                <!-- <ul class="chew-row chew-row--card-min-100 chew-row--card-max-300  chew-row--col-8 chew-row--gutter">
                    <li class="chew-cell">
                        <div class="chew-card">
                            <div class="card">
                                <img src="../images/cards/dog.jpg" alt="image" style="width:100%">
                                <div class="container">
                                    <p><b>Highscore 1</b>: 100.000</p>
                                </div>
                            </div>
                        </div>
                    </li>

                    <li class="chew-cell chew-cell--ghost"></li>
                    <li class="chew-cell chew-cell--ghost"></li>
                    <li class="chew-cell chew-cell--ghost"></li>
                    <li class="chew-cell chew-cell--ghost"></li>
                    <li class="chew-cell chew-cell--ghost"></li>
                    <li class="chew-cell chew-cell--ghost"></li>
                    <li class="chew-cell chew-cell--ghost"></li>
                </ul> -->

           <h2 class="no-margin-bottom">Coins</h2>
           <hr class="divider"/>

           <div id="dashboardCoins"></div>
           <script>
                 jQuery.ajax({
                     type: "POST",
                     url: "../../php/BackseatDB.php",
                     datatype: 'json',
                     data: {functionname: 'coinDisplay'},

                     success: function(obj, textstatus) {
                         if (!('error' in obj)) {
                             jQuery('#dashboardCoins').html(obj.coins);
                         } else {
                             console.error("Failed to add Coins to display" );
                         }
                     }
                 });
           </script>

           <div id="doubleCoins">
             <button onclick="doubleCoins()">Verdubbel je Coins</button>
          </div>

          <script>
          function doubleCoins(){
                jQuery.ajax({
                    type: "POST",
                    url: "../../php/BackseatDB.php",
                    datatype: 'json',
                    data: {functionname: 'doubleCoins'},

                    success: function(obj, textstatus) {
                        if (!('error' in obj)) {
                            jQuery('#doubleCoins').html('Ga je! 0 Coins left.');
                        } else {
                            console.error("Failed to add Coins to display" );
                        }
                    }
                });
              }
          </script>

            <h2 class="no-margin-bottom">Collectibles</h2>
            <hr class="divider"/>

                <ul id="collectibles-row" class="chew-row chew-row--card-min-200 chew-row--card-max-400  chew-row--col-6 chew-row--gutter">

                </ul>


            <h2 class="no-margin-bottom">Games</h2>
            <hr class="divider"/>

            <div style="border-radius: 20px; background-color: #FF5454; padding: 20px;">
                <p style="color: white;"><b>Warning:</b> This is not implemented yet</p>
            </div>
            <!-- <ul class="chew-row chew-row--card-min-300  chew-row--col-4 chew-row--gutter">
                <li class="chew-cell">
                    <div class="chew-card">
                        <div class="card">
                            <img src="../images/cards/game.jpg" alt="image" style="width:100%">
                            <div class="container">
                                <p><b>Game 1</b>: X</p>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="chew-cell">
                    <div class="chew-card">
                        <div class="card">
                            <img src="../images/cards/game.jpg" alt="image" style="width:100%">
                            <div class="container">
                                <p><b>Game 2</b>: Y</p>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="chew-cell">
                    <div class="chew-card">
                        <div class="card">
                            <img src="../images/cards/game.jpg" alt="image" style="width:100%">
                            <div class="container">
                                <p><b>Game 3</b>: Z</p>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="chew-cell chew-cell--ghost"></li>
            </ul> -->
        </div>
    </body>

</html>
