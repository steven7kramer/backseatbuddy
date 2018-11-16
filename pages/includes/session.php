<?php
session_start();

if(!isset($_SESSION["uID"])) {
    header("location:/pages/login.php");
    exit();
}

?>
