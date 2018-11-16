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
      <div class="tutBgInfo1">
        <img src="../../images/tutorial/sofieTulp2.png" />
      </div>
      <div class="tutText">
      <h1>Hoi!</h1>
        <p>Welkom bij Vliegveld Valkenburg. Dit kleine tweebaans vliegveld kent een bijzondere geschiedenis na de bouw in 1939. Swipe naar links om deze te ontdekken!</p>

      <img src="../../images/tutorial/swipeLeft.png" class="swipeImg" />
    </div>
    </div>

    <div class="slickContent">
      <div class="tutBgInfo1">
        <img src="../../images/POI/infowindow1/wo2.jpg"/>
      </div>
      <div class="tutText">
      <h1>Tweede Wereldoorlog</h1>
        <p>Tijdens de Tweede Wereldoorlog is dit vliegveld in handen gevallen van de Duitsers. Dit vliegveld was alleen helemaal nog niet voltooid! Hier waren de Duitsers niet van op de hoogte en gingen dit vliegveld alsnog gebruiken voor transport van mensen en materialen...</p>
    </div>
  </div>
    <div class="slickContent">

      <div class="tutBgInfo1">
        <img src="../../images/POI/infowindow1/landen2.jpg"/>
      </div>
      <div class="tutText">
      <h1>Toch proberen te landen...</h1>
        <p>Het landen van de zware vliegtuigen op de nog onvoltooide landingsbaan ging niet volgens plan. Doordat de grond te zacht was strandde het eerste vliegtuig al halverwege de landingsbaan. Het tweede vliegtuig volgde door een druk tijdschema al snel, zonder te weten dat er nog een vliegtuig vast stond op de landingsbaan. Deze botsten dus op grote snelheid, evenals een aantal van de volgende vliegtuigen. Dit ging niet helemaal lekker dus!</p>
      </div>

    </div>
    <div class="slickContent">

      <div class="tutBgInfo1">
        <img src="../../images/POI/infowindow1/vliegtuigen.jpg"/>
      </div>
      <div class="tutText">
      <h1>Omleiding</h1>
        <p>Toen de Duitsers er eindelijk achterkwamen dat de landingsbaan nog niet geschikt was om op te landen, besloten ze de missie nog niet af te lasten. Het was namelijk erg belangrijk voor ze om snel het kabinet in Den Haag gevangen te nemen om zo de belangrijkste invloeden binnen Nederland onschadelijk te maken. Daarom maakten de aankomende vliegtuigen een noodlanding op het strand van Scheveningen.</p>
      </div>

    </div>
    <div class="slickContent">

      <div class="tutBgInfo1">
        <img src="../../images/POI/infowindow1/soldaatoranje.jpg"/>
      </div>
      <div class="tutText">
      <h1>Wat is er nu?</h1>
        <p>Het vliegveld is tijdens en na de oorlog veelvuldig gebruikt. Momenteel zijn de landingsbanen al sinds 2010 buiten gebruik en wordt een hangar gebruikt voor een musical. Vanaf 2020 zal dit vliegveld verdwijnen en zullen er woonwijken voor in de plaats komen. </p>

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
