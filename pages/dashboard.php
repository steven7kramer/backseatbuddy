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
                    Gebruikersnaam
                  </th>
                  <th>
                    <form action="../php/BackseatDB.php" title="" method="post" id="editUsername" enctype="multipart/form-data">
                      <div class="usernamePlace infoPlace"></div>
                      <a href="#" onclick="editUsername()" class="editUsernameIcon"> <i class='fa fa-pencil' style="margin-left: 10px;"></i> </a>
                    </form>
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

            <!-- form handler for editing userName -->
            <script type='text/javascript'>
                /* attach a submit handler to the form */
                $("#editUsername").submit(function(event) {

                  /* stop form from submitting normally */
                  event.preventDefault();

                  /* get the action attribute from the <form action=""> element */
                  var $form = $( this ),
                      url = $form.attr( 'action' );

                  /* Send the data using post with element id name and name2*/
                  var posting = $.post( url, {
                    username: $('#username').val(),
                    functionname: $('#functionname').val()
                  });

                  /* Alerts the results */
                  posting.done(function( data ) {
                    console.log($('#username').val());
                    console.log(posting.username);
                    $('.usernamePlace').text($('#username').val());
                    $('.editUsernameIcon').show();
                  });
                });
            </script>

            <!--  Draw an avatar -->
            <div id="bsb-avatar-drawing">
                <script>
                    var avatar = new BackseatAvatar(150, "bsb-avatar-drawing");
                </script>
            </div>

            <h2 class="no-margin-bottom">Shop</h2>
            <hr class="divider"/>
            <div id="fixedShopError">Je hebt niet voldoende munten!</div>
            <div id="buyCheckBG">
              <div id="buyCheck">
                <h2> Weet je het zeker? </h2>
                <img src="/images/other/bsbCoin.png" width="30px"/> <div id="price"></div>

                <div id="ynBtns">
                </div>
              </div>
            </div>

            <div id="coinDisplay" class="coinNoLink"></div>

            <h4>Brillen</h4>

                <ul id="avatar-row" class="chew-row chew-row--card-min-200 chew-row--card-max-400  chew-row--col-6 chew-row--gutter">
                </ul>

            <h4 class="clearBoth">Jouw auto's</h4>

            <ul id="car-row" class="chew-row chew-row--card-min-200 chew-row--card-max-400  chew-row--col-6 chew-row--gutter">
            </ul>


                <script>
                // Fills car products as well as the avatars
                  makeProducts("dashboard");
                </script>

            <h2 class="no-margin-bottom clearBoth">Collectibles</h2>
            <hr class="divider"/>

                <ul id="collectibles-row" class="chew-row chew-row--card-min-200 chew-row--card-max-400  chew-row--col-6 chew-row--gutter">

                </ul>
        </div>
    </body>

</html>
