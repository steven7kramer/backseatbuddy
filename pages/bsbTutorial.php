<?php
session_start();

if( isset($_SESSION["uID"]) ){
    header("location: https://backseat-buddy.com/prototype");
    exit();
}
?>

<html>
<head>
 <link rel="stylesheet" href="../css/bsbTutorial.css">
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php readfile("includes/tagmanagerHeader.php") ?>

</head>
<body>
<?php readfile("includes/tagmanagerBody.php") ?>

<div id="tutClose">
    <a href="../index.php"><i class="fa fa-close"></i> Sluit Tutorial</a>
</div>
<div id="allTutContainer">
       <div id="tutOne">
            <img src="..images/screens/tutorial1.png" alt="Backseat Buddy" />

            <h1>Titel Tutorial deel 1</h1>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

       </div>

       <div id="tutTwo">
            <img src="..images/screens/tutorial2.png" alt="Backseat Buddy" />

            <h1>Titel Tutorial deel 2</h1>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

       </div>

       <div id="tutThree">
            <img src="..images/screens/tutorial3.png" alt="Backseat Buddy" />

            <h1>Titel Tutorial deel 3</h1>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

       </div>

       <div id="tutBottomScroll">
            1 - 2 - 3
       </div>

</div>

</body>
</html>
