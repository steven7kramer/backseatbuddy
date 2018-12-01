<?php include("pages/includes/session.php"); ?>

<html lang="nl">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <title>Backseat Buddy - Prototype</title>

        <!-- CSS -->
        <link rel="stylesheet" href="/css/bsb_style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

        <!-- Libraries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

        <!-- Javascript -->
        <script src="/js/BackseatGPS.js"></script>
        <script src="/js/BackseatNAV.js"></script>
        <script src="/js/BackseatNotifications.js"></script>

    </head>

    <body>

        <!-- NAVIGATION -->
        <?php include("pages/includes/menu.php") ?>

        <div id="p404">
          <img src="/images/sofieCircle.png" style="width: 200px;">

          <h1> Oh nee! </h1>
          <p> Deze pagina bestaat helaas niet. Heb je misschien een verkeerde link ingetypt? Zo niet gaan we zo snel mogelijk kijken wat er fout is gegaan! </p>

          <div id="backToMap"><a href="https://caswognum.nl/">
            <i class="fa fa-map-o"></i>Terug naar de map</a>
          </div>
        </div>

  </body>
</html>

<!--
UPDATE LOG:
v0.1 - Testing the Google Maps API
v0.2 - Coupled database to Google Maps Markers
v0.3 - Made a login screen
-->
