<?php $BASE_URL =  'https://caswognum.nl'?>

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

<?php if($filename == "index"): ?>
    <!-- Stay on location -->

    <div id="menuSection" style="top:17px;">
        <a id="toggleBtnMenu" href="#" class="toggle_btn">
            <span id="toggleMenuIcon" onclick="openNav()">&#9776;</span>
        </a>
    </div>
<?php else: ?>
    <div class="menubar">
        <span class="openbtn" onclick="openNav()">&#9776;</span>
        <a href='<?php echo $BASE_URL ?>' class="mapbtn fa fa-map-o fa-2x"></a>
    </div>
<?php endif; ?>
