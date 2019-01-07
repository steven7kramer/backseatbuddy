<?php
session_start();

if( isset($_SESSION["uID"]) ){
    header("location:../index.php");
    exit();
}
?>

<html>
<head>
  <link rel="stylesheet" href="../css/login.css">
   <meta name="viewport" content="width=device-width, initial-scale=1">

   <!-- Google Tag Manager Header -->
   <?php readfile("includes/tagmanagerHeader.php") ?>
</head>
<body>

  <!-- Google Tag Manager Body -->
  <?php readfile("includes/tagmanagerBody.php") ?>

<div id="loginContainer">
	<div class="loginHead">
		<img src="../images/logo-min.jpg" alt="Backseat Buddy" />
	</div>

	<div class="loginMain">

		<div class="loginTitel">
			Wachtwoord vergeten
		</div>

		    <input type="text" placeholder="E-mail" name="email" required>

		    <button type="submit">Stuur wachtwoord naar mail</button>

		    <div class="wwForget">
		    	<a href="login.php"><i> &#8592; Ik weet mijn wachtwoord weer!</i>
		    </div>
	</div>


</div>

</body>
</html>
