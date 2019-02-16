<?php
session_start();

if(!isset($_SESSION["uID"])) {
    header("location:/prototype/pages/login.php");
    exit();
}

?>
