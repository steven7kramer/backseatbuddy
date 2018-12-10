var maxDistPOI = function(pIcon){
  /*switch(pIcon) {
    case '1': return 1; break;
    case '2': return 10; break;
    case '4': return 7; break;
    default: return 5;
  };*/
  return 1000; //for development
}

jQuery(document).ready(function(){

  //place amount of coins in the div called coinDisplay if available
  if($('#coinDisplay').length){
    var coinDisplay = document.getElementById('coinDisplay');

    jQuery.ajax({
        type: "POST",
        url: "../../php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'coinDisplay'},

        success: function(obj, textstatus) {
            if (!('error' in obj)) {
                coinDisplay.innerHTML = '<a href="/pages/dashboard.php"><img src="/images/other/bsbCoin.png"/><div id="coins">' + obj.coins + '</div><script>updateCoins(true);</script></a>';
            } else {
                console.error("Failed to add Coins to display" );
            }
        }
    });
  }

  //place username and email in the designated placement divs
  jQuery.ajax({
      type: "POST",
      url: "../../php/BackseatDB.php",
      datatype: 'json',
      data: {functionname: 'usernameEmail'},

      success: function(obj, textstatus) {
          if (!('error' in obj)) {
              jQuery('.usernamePlace').html(obj.usernameEmail[0].uUsername);
              jQuery('.emailPlace').html(obj.usernameEmail[0].uEmail);
          } else {
              console.error("Failed to retrieve username and email" );
          }
      }
  });
});

function updateCoins(firstTime){
    jQuery.ajax({
        type: "POST",
        url: "../../php/BackseatDB.php",
        datatype: 'json',
        data: {functionname: 'coinDisplay'},

        success: function(obj, textstatus) {
            if (!('error' in obj)) {
                if(!firstTime){
                  jQuery('#coinPlaceDiv').fadeOut();
                }
                  jQuery('#coinPlaceDiv').html(obj.coins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
                  jQuery('#coinPlaceDiv').fadeIn();
            } else {
                console.error("Failed to add Coins to display" );
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
