<?php include("../includes/session.php") ?>
<?php $filename = basename(__FILE__, '.php'); ?>

<html>
  <head>
  <title>Vliegveld Valkenburg</title>
  <link rel="stylesheet" href="../../../css/bsb_style.css">

  <link rel="stylesheet" type="text/css" href="../../../lib/Slick/slick/slick.css"/>
  <link rel="stylesheet" type="text/css" href="../../../lib/Slick/slick/slick-theme.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
     <!-- NAVIGATION -->
        <?php include("../includes/menu.php") ?>

  <div class="responsive contentHeight">
    <div class="slickContent">
      <div class="tutBgInfo2">
        <img src="../../images/tutorial/sofieTulp2.png" />
      </div>
      <div class="tutText">
      <h1>Hoi!</h1>
        <p>Welkom bij Brittenburg, de Romeinse ruïne van een limesvesting. Swipe naar links om hier meer over te weten te komen!</p>

      <img src="../../images/tutorial/swipeLeft.png" class="swipeImg" />
    </div>
    </div>

    <div class="slickContent">
      <div class="tutBgInfo2">
        <img src="../../images/POI/infowindow2/limes.png"/>
      </div>
      <div class="tutText">
      <h1>De Limes</h1>
        <p>De limes (Latijn voor 'grens') is de aanduiding van de grens en verdedigingszone van het Romeinse Rijk, hoofdzakelijk gebouwd in de periode 40 na Chr - ca 250 na Chr. Deze liep van de atlantische kust in Noord- Engeland via de Noordzee langs de toenmalige hoofdstroom van de Rijn en Donau naar de Zwarte Zee. </p>
    </div>
  </div>
    <div class="slickContent">

      <div class="tutBgInfo2">
        <img src="../../images/POI/infowindow2/tekening.jpg"/>
      </div>
      <div class="tutText">
      <h1>Onderzoek</h1>
        <p>Recent archeologisch onderzoek op de plaats waar de Brittenburg volgens recente gegevens kan liggen heeft niets opgeleverd. Wel zijn in 1982 bij het uitgraven van de huidige Uitwateringssluizen duidelijke aanwijzingen gevonden voor een Romeinse nederzetting, die mogelijk verband houdt met Lugdunum Batavorum.</p>
      </div>

    </div>
    <div class="slickContent">

      <div class="tutBgInfo2">
        <img src="../../images/POI/infowindow2/resten.jpg"/>
      </div>
      <div class="tutText">
      <h1>De Restanten</h1>
        <p>De resten van dit castellum liggen tegenwoordig, door het terugwijken van de kustlijn, in zee. Nog tot in de twintigste eeuw zouden er bij extreem laag water resten van dit castellum (vanaf de zestiende eeuw de Brittenburg genoemd) te zien zijn geweest. De zee heeft waarschijnlijk de laatste resten weggespoeld, en wie tegenwoordig over het strand van Noordwijk naar de uitwatering bij Katwijk loopt zal zich moeilijk kunnen voorstellen dat daar ergens in zee ooit het eindpunt lag van de Romeinse limes, het imposante castellum Lugdunum.</p>

        <div id="tutEnd">
            <a href="../../index.php"><i class="fa fa-map-o"></i>Terug naar de kaart</a>
          </div>
      </div>

    </div>
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script type="text/javascript" src="../../lib/Slick/slick/slick.min.js"></script>
  <script type="text/javascript" src="../../js/BackseatNAV.js"></script>

  <script type="text/javascript">
    $(document).ready(function(){

    $('.responsive').slick({
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        });
    });
  </script>

  </body>
</html>
