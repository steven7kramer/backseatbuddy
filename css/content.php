<!--
Title:      Backseat Buddy Prototype
Author:     Cas Wognum
Descr:      A very minimalistic prototype for
            Backseat Buddy, an app that uses
            GPS to offer location based content
URL:        N.A.
Version:    0.1
-->

<!DOCTYPE html>
<html lang="nl">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <title>Backseat Buddy - Prototype</title>

        <!-- CSS -->
        <link rel="stylesheet" href="../css/bsb_style.css">

        <!-- Libraries -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

        <!-- Javascript -->
        <script src="../js/BackseatContent.js"></script>
        <script src="../js/BackseatNAV.js"></script>

    </head>

    <body>

        <!-- NAVIGATION -->
        <div id="sidenav" class="sidenav">
            <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>

            <img src="../images/logo.png" id="navlogo" class="logo"> </img>

            <br><hr><br>

            <a href="../index.php">De kaart</a>
            <a href="logout.php">Afmelden</a>
            <a href="user_input.html">Admin</a>
        </div>

        <span class="openbtn" onclick="openNav()">&#9776;</span>

        <div id="main" class = "width-100 height-100">
        </div>
  </body>
</html>
