jQuery(document).ready(function() {
    var par = getURLParameter("pID");
    if (par < 0) {
        alert("You are accessing the general content page");
    } else {
        alert("You are accessing the page of content with id: " + par);
    }
});


// Function to analyze the parameters in the URL
// Source: http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
// Author: Virendra
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
