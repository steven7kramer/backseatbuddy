<?php
  include("pages/includes/session.php");
  $session_admin=(isset($_SESSION['admin']))?$_SESSION['admin']:'';
?>
<?php $filename = basename(__FILE__, '.php'); ?>
<!DOCTYPE html>
<html lang="nl">
<head>

	<meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8">
    <title>Backseat Buddy - Prototype | Quiz</title>

    <!-- CSS -->
    <link rel="stylesheet" type="text/css" href="../../css/quiz.css">
    <link rel="stylesheet" href="../../css/bsb_style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <!-- Libraries -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

		<!-- Admin Session -->
		<script type="text/javascript">
			var adminSession ='<?php echo $session_admin;?>';
		</script>

    <!-- Javascript -->
		<script src="../../js/BackseatGeneral.js"></script>
		<script src="../../js/BackseatMaxDistance.js"></script>
		<script src="../../js/BackseatNAV.js"></script>
		<script src="../../js/BackseatCheck.js"></script>

		<!-- Google Tag Manager Header -->
		<?php readfile("../includes/tagmanagerHeader.php") ?>

</head>

<body>

	<?php include("../includes/menu.php") ?>

	<!-- Google Tag Manager Body -->
	<?php readfile("../includes/tagmanagerBody.php") ?>

	<div id="quizContainer">

	<div id="quiz"></div>

	<button id="submit">Antwoord insturen</button>

	<div id="results"></div>

	</div>
	 <script src="../../js/BackseatQuiz.js"/></script>

</body>

</html>
