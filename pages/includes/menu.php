<?php $BASE_URL =  'https://caswognum.nl'?>
<script type="text/javascript" src='/js/BackseatGeneral.js'> </script>

<div id="sidenav" class="sidenav">

    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>

    <img src="<?php echo $BASE_URL ?>/images/logo.png" id="navlogo" class="logo"> </img>

    <br><hr><br>

    <a href='<?php echo $BASE_URL; ?>'>Kaart</a>
    <a href='<?php echo $BASE_URL . '/pages/dashboard.php'; ?>'>Dashboard</a>
    <a href='<?php echo $BASE_URL . '/pages/tutorial.php'; ?>'>Tutorial</a>
    <a href='<?php echo $BASE_URL . '/pages/logout.php'; ?>'>Afmelden</a>


    <?php if($_SESSION['admin']): ?>
    </br> </br>
        <div style='position:absolute; bottom: 3.5rem; text-align: center; width:100%; background-color:#e83273; padding: 12px 0px;'>
            <b><a href='<?php echo $BASE_URL . '/pages/admin.php'; ?>' style='color:white; font-size:16px;'>Admin &#x2192;</a></b>
        </div>
    <?php endif; ?>

</div>

<!--?php if($filename == "index"): ?>-->
<?php
$basename = substr(strtolower(basename($_SERVER['PHP_SELF'])),0,strlen(basename($_SERVER['PHP_SELF']))-4);
if($basename == "index"):
?>
    <!-- Stay on location -->

    <div id="menuSection" style="top:17px;">
        <a id="toggleBtnMenu" href="#" class="toggle_btn">
            <span id="toggleMenuIcon" onclick="openNav()">&#9776;</span>
        </a>
    </div>
<?php else: ?>
    <div class="menubar">

    <!-- menu button left -->
    <span class="openbtn" onclick="openNav()">&#9776;</span>

    <!-- Display coins in header -->
<div id="coinsAndMap">
    <div id="coinDispContainer">
        <a href="/pages/dashboard.php">
            <div id="coinBG">
              <img src="/images/other/bsbCoin.png" id="coinDisplayImage"/>
              <span class="coinAmount">
                <div id="coinPlaceDiv"></div>
                <script>updateCoins("firstTime");</script>
              </span>
            </div>
        </a>
    </div>

    <!-- Display menu button -->
        <a href='<?php echo $BASE_URL ?>' class="mapbtn fa fa-map-o fa-2x"></a>
  </div>

    </div>

<?php endif; ?>
