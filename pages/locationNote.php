<?php include("includes/session.php") ?>

<html>
<head>
 <link rel="stylesheet" href="../css/locationNote.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Google Tag Manager Header -->
  <?php readfile("includes/tagmanagerHeader.php") ?>

</head>
<body>

  <!-- Google Tag Manager Body -->
  <?php readfile("includes/tagmanagerBody.php") ?>

<div id="LocatieContainer">

        <div class="locationText">
            <h1>Hoi!</h1>

            <p>Om Backseat Buddy te gebruiken hebben wij je GPS locatie nodig. Druk dus op het volgende scherm op 'oke'! En geen zorgen, we zullen zorgen dat je locatie niet naar jou te herleiden is.</p>
        </div>

        <img src="../images/other/locationNote.png" />

            <div class="locatieButton">
                <div class="acceptButton">
                	<a href="../index.php">Locatie Toestaan &#8594;</a>
                </div>
            </div>
        </div>

</body>
</html>
