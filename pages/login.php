<?php
session_start();

if( isset($_SESSION["uID"])){
    header("location: https://backseat-buddy.com/prototype");
    exit();
}
?>

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
				Inloggen
			</div>
            <div class="error feedback" id="errorLogin"></div>
            <form action="../php/BackseatDB.php" title="" method="post" id="backseatLogin">
		          <input type="text" placeholder="E-mail" name="email" id='uEmail' required>
		          <input type="password" placeholder="Wachtwoord" name="wachtwoord" id='uPassword' required>
                  <input type="hidden" id="functionname" name="functionname" value="loginMain">
		          <button type="submit">Login</button>
            </form>
		    <div class="wwForget">
		    	<a href="register.php"><i>Nieuw account aanmaken &#8594;</i></a><br /><br />
		    	<a href="recover.php"><i>Wachtwoord vergeten? &#8594;</i></a>
		    </div>
	</div>

    <script type='text/javascript'>
            /* attach a submit handler to the form */
            $("#backseatLogin").submit(function(event) {

            event.preventDefault();

            /* get the action attribute from the <form action=""> element */
            var $form = $( this ),
            url = $form.attr( 'action' );

            /* Send the data using post with element id name and name2*/
            var posting = $.post( url, {
                uEmail: $('#uEmail').val(),
                uPassword: $('#uPassword').val(),
                functionname: $('#functionname').val()
            });

            /* Alerts the results */
            posting.done(function( data ) {

                if (data.success == 'true') {
                    jQuery('#errorLogin').css("display", "none");
                    data.tutorialDone;
                    if(data.tutorialDone == 0){
                        jQuery.ajax({
                            type: "POST",
                            url: "../php/BackseatDB.php",
                            datatype: 'json',
                            data: {functionname: 'tutorialDone'},

                            success: function(obj, textstatus) {
                                if (!('error' in obj)) {
                                    console.log("tutorialDone is set to 1" );
                                } else {
                                    console.error("there was an error in updating tutorialDone" );
                                }
                            }
                        });
                        window.location.replace('tutorial.php?first_time=true');
                    }else{
                        window.location.replace('../index.php');
                    }
                } else {
                    var resetForm = document.getElementById("backseatLogin");
                    resetForm.reset();

                    jQuery('#errorLogin').html("<strong>Oh oh!</strong> Deze inlog gegevens zijn bij ons niet bekend...");
                    jQuery('#errorLogin').css("display", "block");
                }





            });
        });
    </script>


</div>

</body>
</html>
