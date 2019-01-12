<!--
Title:      Backseat Buddy Prototype
Author:     Cas Wognum
Descr:      A very minimalistic prototype for
            Backseat Buddy, an app that uses
            GPS to offer location based content
URL:        N.A.
Version:    0.1

For the update logs, see the end of this document

-->

<?php include("pages/includes/session.php"); ?>

<html lang="nl">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <title>Backseat Buddy - Prototype</title>

        <!-- CSS -->
        <link rel="stylesheet" href="css/bsb_style.css">

        <!-- Libraries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">

        <script src="../lib/SVG/svg.min.js"></script>

        <!-- Javascript -->
        <script src="js/BackseatGPS.js"></script>
        <script src="js/BackseatNAV.js"></script>
        <script src="js/BackseatNotifications.js"></script>
        <script src="js/BackseatGeneral.js"></script>
        <script src="js/Avatar/BackseatAvatar.js"></script>
        <script src="js/Avatar/BackseatPainter.js"></script>

        <!-- Google Tag Manager Header -->
        <?php readfile("pages/includes/tagmanagerHeader.php") ?>

    </head>

    <body>

        <!-- NAVIGATION -->
        <?php include("pages/includes/menu.php") ?>

        <!-- Google Tag Manager Body -->
        <?php readfile("pages/includes/tagmanagerBody.php") ?>

        <!-- Info window -->
        <div id="sideContent" class="BinfoWindow">
            <a href="javascript:void(0)" class="closebtn" onclick="closeInfoWindow()">&times;</a>
            <div class="BinfoWrapper">
                <div id="pImage" class="BinfoHeader">
    				<h3 class='nowrap' id="pCategory"></h3>
    				<h1 class='nowrap' id="pTitle"></h1>
    			</div>
    			<div class="BinfoText">
    				<h4 class='nowrap' id="pSubtitle"></h4>
    				<p class='nowrap' id="pDescr"></p>
    			</div>
    			<div class="BinfoButton nowrap" id="bbInfoBubbleButton">
    				<a id="pButton"></a> <br />
                    <a id="pReload"></a>
            </div>

            <div class='nowrap' id="gameTimerLeft">
              <i class="fas fa-stopwatch"></i> Nog <b><div class="gameTimerLeftFill">30</div> minuten</b> over om te spelen!
            </div>
    		</div>
    	</div>
      <div id="overlayNote">
        <a href="javascript:void(0)" class="closebutton" onclick="closeOverlay()">&times;</a>
        <img src="/images/other/dashboardNote.png" />
        <p> Wist je dat je via het dashboard nieuwe auto's en brillen kunt kopen? </p>
        <div id="overlayButton"><a onclick="closeOverlay()" href="pages/dashboard.php">Naar het dashboard </a></div>
      </div>
      <!-- Display coins in header -->
      <div id="coinDispContainerInd">
        <a href="/pages/dashboard.php">
        <div id="avatarPlaceDiv">
          <script>
              var avatar = new BackseatAvatar(50, "avatarPlaceDiv", "current");
          </script>
        </div>

              <div id="coinBGInd">
                <img src="images/other/bsbCoin.png" id="coinDisplayImage"/>
                <span class="coinAmountInd">
                  <div id="coinPlaceDiv"></div>
                  <script>
                        jQuery.ajax({
                            type: "POST",
                            url: "../../php/BackseatDB.php",
                            datatype: 'json',
                            data: {functionname: 'coinDisplay'},

                            success: function(obj, textstatus) {
                                if (!('error' in obj)) {
                                    jQuery('#coinPlaceDiv').html(obj.coins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

                                    // check if dashDone is true from BackseatGps.js
                                    overlayCheck(obj.coins);
                                } else {
                                    console.error("Failed to add Coins to display" );
                                }
                            }
                        });
                  </script>
                </span>
              </div>
          </a>
      </div>

        <!-- Stay on location -->
        <div id="followMeSection">
            <a id="toggleBtnLocation" href="#" class="toggle_btn">
                <span>
                    <img src="images/icons/toggleGPS.png" id="toggleBtnLocationImg" style="width:30px; height:30px;"/>
                </span>
            </a>
        </div>

        <!-- MAIN CONTENT -->
        <div id="main" class = "width-100 height-100">
            <div id="map" class = "width-100 height-100">
            </div>
        </div>

        <!-- Add the Google Maps API key -->
        <script src="\lib\MarkerClusters\markerclusterer.js"></script>
        </script>
        <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAfW9lpLVdkMcvafwYeh5JL41qDA4gi7ro&callback=initialize">
        </script>
  </body>
</html>

<!--
UPDATE LOG:
v0.1 - Testing the Google Maps API
v0.2 - Coupled database to Google Maps Markers
v0.3 - Made a login screen
-->
