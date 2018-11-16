<?php include("includes/session.php") ?>

<html>
<head>
 <link rel="stylesheet" href="../css/locationNote.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

  <meta name="viewport" content="width=device-width, initial-scale=1">

</head>
<body>

<div id="LocatieContainer">
            <img src="../images/browsers/jeanLocation.png" style="width:200px; margin-top:20px;">

            <h1>Oh nee!</h1>

            <p>Jij hebt Backseat Buddy geen toegang gegeven tot je locatie. Zonder locatie is Backseat Buddy helaas niet te spelen.</p>

            <p>We helpen je graag om deze instellingen te wijzigen. De buttons hieronder sturen je door naar de pagina met uitleg hoe dit moet.</p>

            <div id="denyButtonContainer">
              <a class="denyButton" href="https://support.google.com/chrome/answer/142065?hl=nl" target="_blank">
                <img src="../images/browsers/chrome.png">
                <span>Chrome (Alle apparaten)</span>
              </a>
              <a class="denyButton" href="https://support.apple.com/nl-be/HT207092" target="_blank">
                <img src="../images/browsers/safari.png">
                <span>Safari (iPhone, iPad)</span>
              </a>
              <a class="denyButton" href="https://support.apple.com/nl-be/guide/safari/ibrw7f78f7fe/mac" target="_blank">
                <img src="../images/browsers/safari.png">
                <span>Safari (Desktop)</span>
              </a>
              <a class="denyButton" href="https://support.mozilla.org/nl/kb/deelt-firefox-mijn-locatie-websites" target="_blank">
                <img src="../images/browsers/firefox.png">
                <span>Firefox (Alle apparaten)</span>
              </a>
            </div>

            <p><i>Geen zorgen, wij zorgen ervoor dat je locatie niet naar jou te herleiden is.</i></p>

            <p>Staat jouw browser of device er niet bij? Kies dan degene die het dichtst in de buurt komt en probeer of het ongeveer hetzelfde werkt als jouw browser!</p>

</div>

</body>
</html>
