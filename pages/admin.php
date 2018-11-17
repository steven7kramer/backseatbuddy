<!--
Title:      Backseat Buddy Prototype
Author:     Cas Wognum
Descr:      A very minimalistic prototype for
            Backseat Buddy, an app that uses
            GPS to offer location based content
URL:        N.A.
Version:    0.1
-->

<?php include("includes/session.php") ?>
<?php
if(!($_SESSION["admin"])) {
    header("location: ../index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="nl">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <title>Backseat Buddy - Prototype</title>

        <!-- CSS -->
        <link rel="stylesheet" href="../css/bsb_style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">


        <!-- Libraries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <!--<link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">-->

        <!-- Javascript -->
        <script src="../js/BackseatNAV.js"></script>

    </head>

    <body>

        <!-- NAVIGATION -->
        <?php include("includes/menu.php") ?>
        <div id="main" class = "width-100 height-100">
            <form action="../php/BackseatDB.php" title="" method="post" class="backseat-form" id="backseatContentForm" enctype="multipart/form-data">
                Title: <input type="text" id="pTitle" name="pTitle"><br>
                Description: <input type="text" id="pDescr" name="pDescr"><br>
                Lattitude: <input type="number" step="any"id="lat" name="lat"><br>
                Longitude: <input type="number" step="any" id="lng" name="lng"><br>
                Category: <input type="text" id="pCategory" name="pCategory"><br>
                Types:
                <select id="pIcon" name="pIcon">
                    <option value="0">Parkeerplaats</option>
                    <option value="1">Viewpoint</option>
                    <option value="2">Game</option>
                    <option value="3">Info</option>
                    <option value="4">Quiz</option>
                </select><br>

                File name: <input type="text" id="pImage" name="pImage"><br>
                <input type="hidden" id="functionname" name="functionname" value="addToDatabase">
                <input type="submit" value="Submit">
            </form>

            <script type='text/javascript'>
                /* attach a submit handler to the form */
                $("#backseatContentForm").submit(function(event) {

                  /* stop form from submitting normally */
                  event.preventDefault();

                  /* get the action attribute from the <form action=""> element */
                  var $form = $( this ),
                      url = $form.attr( 'action' );

                  /* Send the data using post with element id name and name2*/
                  var posting = $.post( url, {
                      pTitle: $('#pTitle').val(),
                      pDescr: $('#pDescr').val(),
                      pIcon: $('#pIcon').val(),
                      pCategory: $('#pCategory').val(),
                      lat: $('#lat').val(),
                      lng: $('#lng').val(),
                      pImage: $('#pImage').val(),
                      functionname: $('#functionname').val()
                  });

                  /* Alerts the results */
                  posting.done(function( data ) {
                    alert("MYSQL: Inserting data was a success");
                    var resetForm = document.getElementById("backseatContentForm");
                    resetForm.reset();
                  });
                });
            </script>
        </div>
  </body>
</html>
