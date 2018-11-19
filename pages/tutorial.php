<?php include("includes/session.php") ?>
<?php $filename = basename(__FILE__, '.php'); ?>

<html>
  <head>
  <title>Tutorial Backseat Buddy</title>
  <link rel="stylesheet" href="../css/bsb_style.css">

  <link rel="stylesheet" type="text/css" href="../lib/Slick/slick/slick.css"/>
  <link rel="stylesheet" type="text/css" href="../lib/Slick/slick/slick-theme.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Libraries -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

  </head>
  <body>
     <!-- NAVIGATION -->
        <?php include("includes/menu.php") ?>

  <div class="responsive contentHeight">
    <div class="slickContent">
      <div class="slickBg">
        <img src="../images/tutorial/sofieTulp2.png" />
      </div>
      <div class="slickText">
      <h1>Hoi!</h1>
        <p>Superleuk dat je er bent! Ik ben Sofie Tulp, jouw persoonlijke Nederlandse Backseat Buddy! Swipe naar links om naar het volgende scherm te gaan.</p>

      <img src="../images/tutorial/swipeLeft.png" class="swipeImg" />
    </div>
    </div>

    <div class="slickContent">
      <div class="slickBg2">
        <img src="../images/tutorial/tut2v2.png"/>
      </div>
      <div class="slickText">
      <h1>Iconen</h1>
        <p>Tijdens je reis zal je iconen tegenkomen. Zodra je in de buurt bent kan je hier op klikken en leuke dingen doen!</p>
    </div>
  </div>
    <div class="slickContent">

      <div class="slickBg">
        <img src="../images/tutorial/tutIcons.png"/>
      </div>
      <div class="slickText">
      <h1>Onderweg</h1>
        <p>Dit zijn de verschillende iconen die je tegen gaat komen. </p>
      </div>

    </div>
    <div class="slickContent">

      <div class="slickBg2">
        <img src="../images/tutorial/tut3v2.png"/>
      </div>
      <div class="slickText">
      <h1>Terug naar Auto</h1>
        <p>Wanneer je op dit icoon klikt ga je terug naar waar jij zelf bent!</p>

        <img src="../images/tutorial/currentLocation.png" class="locationImg" />
      </div>

    </div>
    <div class="slickContent">

      <div class="slickBg">
        <img src="../images/tutorial/buddies.png"/>
      </div>
      <div class="slickText">
      <h1>Rijden maarrr!</h1>
        <p>Jij bent hier helemaal klaar voor. Veel plezier onderweg!</p>

          <div id="slickEnd">
            <a onClick="tutorialEndButton()"><i class="fa fa-car"></i> Zin in!</a>



            <script>
            function tutorialEndButton(){
              var getUrl = getURLParameter("first_time");

              if(getUrl === 'true'){
                window.location.href="locationNote.php";
              }else{
                window.location.href="../index.php";
              }

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
            }
            </script>

          </div>
        </div>

    </div>
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script type="text/javascript" src="../lib/Slick/slick/slick.min.js"></script>
  <script type="text/javascript" src="../js/BackseatNAV.js"></script>

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
