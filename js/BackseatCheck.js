let poiCheck = false;

var pID = getURLParameter('pId');

function getURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }

    return -1;
}


jQuery(document).ready(function() {
    checkIfUnlocked(pID);
});

function checkIfUnlocked(pID){
    jQuery.ajax({
          type: "POST",
          url: "php/BackseatDB.php",
          datatype: 'json',
          data: {functionname: 'checkIfUnlocked', pID: pID},

          success: function(obj, textstatus) {
              if ('error' in obj) {
                  handleDBError(obj.error)
              }
          }
        });
}
