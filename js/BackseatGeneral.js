var maxDistPOI = function(pIcon){
  /*switch(pIcon) {
    case '1': return 1; break;
    case '2': return 10; break;
    case '4': return 7; break;
    default: return 5;
  };*/
  return 1000; //for development
}

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
