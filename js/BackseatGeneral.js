var userCoins;
var userName;

jQuery(document).ready(function(){

  //place amount of coins in the div called coinDisplay if available
  if($('#coinDisplay').length){
    var coinDisplay = document.getElementById('coinDisplay');

    jQuery.ajax({
        type: "POST",
        url: "/prototype/php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'coinDisplay'},

        success: function(obj, textstatus) {
            if (!('error' in obj)) {
                coinDisplay.innerHTML = '<a href="/prototype/pages/dashboard.php"><img src="/prototype/images/other/bsbCoin.png" /><div id="coins">' + obj.coins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '</div><script>updateCoins(true);</script></a>';
            } else {
                console.error("Failed to add Coins to display" );
            }
        }
    });
  }

  placeUsername();
});

function updateCoins(moment){
    jQuery.ajax({
        type: "POST",
        url: "/prototype/php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'coinDisplay'},

        success: function(obj, textstatus) {
            if (!('error' in obj)) {
                if(moment != "firstTime"){
                  jQuery('#coinPlaceDiv').fadeOut();
                }
                  userCoins = obj.coins;
                  jQuery('#coinPlaceDiv').html(obj.coins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
                  jQuery('#coinPlaceDiv').fadeIn();
            } else {
                console.error("Failed to add Coins to display" );
            }
        }
    });
}

function placeUsername(){
  //place username and email in the designated placement divs
  jQuery.ajax({
      type: "POST",
      url: "/prototype/php/BackseatDB.php",
      datatype: 'json',
      data: {functionname: 'usernameEmail'},

      success: function(obj, textstatus) {
          if (!('error' in obj)) {
            userName = obj.usernameEmail[0].uUsername;
              jQuery('.usernamePlace').html(userName);
              jQuery('.emailPlace').html(obj.usernameEmail[0].uEmail);
          } else {
              console.error("Failed to retrieve username and email" );
          }
      }
  });
}

function animateCoinsWon(coins){
  $('#coinsWon').text(' + ' + coins);

  $('#coinsWonContainer').fadeIn(function () {
    window.setTimeout( fadeOut, 5000 );
    function fadeOut(){
        $('#coinsWonContainer').fadeOut();
    }

  });
}
