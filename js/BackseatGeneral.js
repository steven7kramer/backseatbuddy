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

    $('#coinsWonContainer').animate({'opacity': 'show', 'paddingTop': 0}, 1000);
    window.setTimeout( fadeOut, 5000 );
    function fadeOut(){
        $('#coinsWonContainer').fadeOut();
    }

  });
}
