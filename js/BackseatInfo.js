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

jQuery(document).ready(function(){
  var contentID = getURLParameter('id');

  jQuery.ajax({
      type: "POST",
      url: "../../php/BackseatDB.php",
      datatype: 'json',
      data: {functionname: 'infoPointLoader', ipID:contentID},

      success: function(data) {
          if (!('error' in data)) {
              showInfo(data);
              console.log(data);
          }
      }
  });
});

var infoContainer = document.getElementById('infoContainer');

function showInfo(data){
		// we'll need a place to store all separate elements and the eventual output
		var output = [];
    var headerImg = [];
    var h1Title = [];
    var pDescr = [];

    //add right image per page
		for(let i=0; i<data.infoPoints.length; i++){
			headerImg.push(
				data.infoPoints[i].isImg
			);
		}

    //add right title per page
		for(let j=0; j<data.infoPoints.length; j++){
			h1Title.push(
				data.infoPoints[j].isTitle
			);
		}

    //add right description per page
		for(let k=0; k<data.infoPoints.length; k++){
			pDescr.push(
				data.infoPoints[k].isDescr
			);
		}

			// add this question and its answers to the output
      // titleArray is used, but it could have been any array, it's only the length that matters
      output.push('<div class="responsive contentHeight">');
      var imageUrl = "'../../images/POI/infowindow" + (data.infoPoints[0].ipID) + '/' + (data.infoPoints[0].ipBgImg) + "'";

      for(let l=0; l<data.infoPoints.length; l++){
        output.push(
          '<div class="slickContent">'
          +  '<div class="slickBgInfo" style="background-image:url(' + imageUrl + ')">'
          +    '<img src="../../images/POI/infowindow' + (data.infoPoints[0].ipID) + '/' + headerImg[l] + '" />'
          +  '</div>'
          +  '<div class="slickText">'
          +    '<h1>' + h1Title[l] + '</h1>'
          +    '<p>' + pDescr[l] + '</p>'
  			);
        if(l==0){//voeg swipeImage toe op eerste pagina
          output.push('<img src="../../images/tutorial/swipeLeft.png" class="swipeImg" />');
        }
        if(l==(data.infoPoints.length-1)){ //voeg naar kaart button toe op laatste pagina
          output.push('<div id="slickEnd"><a href="../../index.php"><i class="fa fa-map-o"></i>Terug naar de kaart</a></div>');
        }
        output.push(
        '</div>'
        +'</div>'
        )

      }

  output.push('</div>');
  // finally combine our output list into one string of html and put it on the page
  infoContainer.innerHTML = output.join('');

//load slick.js
    console.log("Reached b");
  $('.responsive').slick({
      dots: true,
      infinite: false,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      });
}



function saveCoins(coins){
	jQuery.ajax({
		        type: "POST",
		        url: "../../php/BackseatDB.php",
		        datatype: 'json',
		        data: {functionname: 'addCoins', coins:coins},

		        success: function(obj, textstatus) {
		            if (!('error' in obj)) {
		                console.log("Saved " + coins + " coins in the database" );
		            } else {
		                console.error("Failed to save " + coins + " coins in the database" );
		            }
		        }
		    });
}