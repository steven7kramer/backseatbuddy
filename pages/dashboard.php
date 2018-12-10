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
        <link rel="stylesheet" href="../css/dashboard.css">
        <link rel="stylesheet" type="text/css" href="../lib/ChewingGrid/build/chewing-grid-atomic.css"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">


        <!-- Libraries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="../lib/SVG/svg.min.js"></script>
        <!--<link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">-->

        <!-- Javascript -->
        <script src="../js/BackseatGeneral.js"></script>
        <script src="../js/BackseatNAV.js"></script>
        <script src="../js/BackseatCollectibles.js"></script>
        <script src="../js/BackseatDashboard.js"></script>
        <script src="../js/Avatar/BackseatAvatar.js"></script>
        <script src="../js/Avatar/BackseatPainter.js"></script>

        <!-- Google Tag Manager Header -->
        <?php readfile("includes/tagmanagerHeader.php") ?>

    </head>

    <body class='dashboard'>

        <!-- NAVIGATION -->
        <?php include("includes/menu.php") ?>

        <!-- Google Tag Manager Body -->
        <?php readfile("includes/tagmanagerBody.php") ?>

        <div class="container">

            <h2 class="no-margin-bottom">Jouw Profiel</h2>
            <hr class="divider"/>

            <div id="dashboardUserInfo">
              <table>
                <tr>
                  <th>
                    Username
                  </th>
                  <th>
                    <div class="usernamePlace infoPlace"></div>
                  </th>
                </tr>
                <tr>
                  <th>
                    E-mail
                  </th>
                  <th>
                    <div class="emailPlace infoPlace"></div>
                  </th>
                </tr>
              </table>
            </div>

            <!--  Draw an avatar -->
            <div id="bsb-avatar-drawing">
                <script>
                    var avatar = new BackseatAvatar(150, "bsb-avatar-drawing");
                </script>
            </div>

            <h2 class="no-margin-bottom">Shop</h2>
            <hr class="divider"/>

            <div id="coinDisplay"></div>

            <h4>Brillen</h4>

            <h4>Auto's</h4>

            <h2 class="no-margin-bottom">Collectibles</h2>
            <hr class="divider"/>

                <ul id="collectibles-row" class="chew-row chew-row--card-min-200 chew-row--card-max-400  chew-row--col-6 chew-row--gutter">

                </ul>


            <h2 class="no-margin-bottom">Games</h2>
            <hr class="divider"/>

            <div id="windmillImg"></div>
            <div id="windmillScores">
              <h4>Windmolen</h4>

            </div>
        </div>
    </body>

</html>
