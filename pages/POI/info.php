<?php
  include("pages/includes/session.php");
  $session_admin=(isset($_SESSION['admin']))?$_SESSION['admin']:'';
?>
<?php $filename = basename(__FILE__, '.php'); ?>

<html>
  <head>
  <title>Backseat Prototype - Info</title>

  <!-- StyleSheets -->
  <link rel="stylesheet" href="../../css/bsb_style.css">
  <link rel="stylesheet" type="text/css" href="../../lib/Slick/slick/slick.css"/>
  <link rel="stylesheet" type="text/css" href="../../lib/Slick/slick/slick-theme.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Libraries -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

  <!-- Admin Session -->
  <script type="text/javascript">
    var adminSession ='<?php echo $session_admin;?>';
  </script>

  <!-- Javascript -->
  <script type="text/javascript" src="../../js/BackseatGeneral.js"></script>
  <script type="text/javascript" src="../../js/BackseatMaxDistance.js"></script>
  <script type="text/javascript" src="../../js/BackseatCheck.js"></script>
  <script type="text/javascript" src="../../js/BackseatNAV.js"></script>

  <!-- Google Tag Manager Header -->
  <?php readfile("../includes/tagmanagerHeader.php") ?>

  </head>
  <body>
     <!-- NAVIGATION -->
        <?php include("../includes/menu.php") ?>

    <!-- Google Tag Manager Body -->
        <?php readfile("../includes/tagmanagerBody.php") ?>


    <div id="infoContainer"></div>

    <script type="text/javascript" src="../../lib/Slick/slick/slick.min.js"></script>
    <script type="text/javascript" src="../../js/BackseatInfo.js"></script>

  </body>
</html>
