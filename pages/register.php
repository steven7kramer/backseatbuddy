<?php
session_start();

if( isset($_SESSION["uID"])){
    header("location:../index.php");
    exit();
} ?>

<!-- Standard header -->
<html>
<head>
  <link rel="stylesheet" href="../css/login.css">

   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

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
			Nieuw account aanmaken
		</div>
        <div class="error feedback" id="errorRegi"></div>
        <div class="success feedback" id="successRegi"></div>
		<form action="../php/BackseatDB.php" title="" method="post" id="backseatRegister">
		    <input type="text" placeholder="E-mail" id="uEmail" class="email" required>

        <input type="text" placeholder="Username" id="uUsername" class="username" required>

		    <input type="password" placeholder="Wachtwoord" id="uPassword" required>

		    <input type="hidden" id="functionname" name="functionname" value="loginRegistration">
		    <button type="submit">Registreren</button>
		</form>
		    <div class="wwForget">
		    	<a href="login.php"><i>&#8592; Ik heb al een account</i>
		    </div>
	</div>


</div>

<script type='text/javascript'>
                /* attach a submit handler to the form */
                $("#backseatRegister").submit(function(event) {

                    event.preventDefault();
                    /* get the action attribute from the <form action=""> element */
                    var form = $( this ),
                        url = form.attr( 'action' );

                    /* Send the data using post with element id name and name2*/
                    var posting = $.post( url, {
                        uEmail: $('#uEmail').val(),
                        uUsername: $('#uUsername').val(),
                        uPassword: $('#uPassword').val(),
                        functionname: $('#functionname').val()
                    });

                    /* Alerts the results */
                    posting.done(function( data ) {

                        if (!('error' in data)) {

                            jQuery('#errorRegi').css("display", "none");
                            jQuery('#successRegi').html("<strong>Woehoe!</strong> Welkom bij Backseat Buddy. Klaar voor de start? <a href='tutorial.php?first_time=true'>Klik hier!</a>");
                            jQuery('#successRegi').css("display", "block");

                            // Email verification
                            /* Send the data using post to send an email*/
                            var posting = $.post( '../php/BackseatMail.php', {
                                uEmail: $('#uEmail').val(),
                                uPassword: $('#uPassword').val(),
                                functionname: 'register'
                            });

                            var resetForm = document.getElementById("backseatRegister");
                            resetForm.reset();

                        } else {
                            jQuery('#successRegi').css("display", "none");
                            jQuery('#errorRegi').html("<strong>Oeps!</strong> " + data.error);
                            jQuery('#errorRegi').css("display", "block");
                        }
                    });
                });
            </script>
</body>
</html>
