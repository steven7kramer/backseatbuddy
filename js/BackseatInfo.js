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
      data: {functionname: 'infoPointLoader', isID:contentID},

      success: function(data) {
          if !('error' in data) {
              showInfo(data);
          }
      }
  });
});

/*
    var infoUrlLoader = ['valkenburg','brittenburg'];
    var infoHeaderBG = ['landen.jpg','brittenburg.jpg'];
    var titleArray = [
    ['Hoi!','Tweede Wereldoorlog','Toch proberen te landen...','Omleiding','Wat is er nu?'],
    ['Hoi!','De Limes','Onderzoek','De Restanten'],
    ];

    var imageArray = [
    ['sofieTulp2.png','wo2.jpg','landen2.jpg','vliegtuigen.jpg','soldaatoranje.jpg'],
    ['sofieTulp2.png','limes.png','tekening.jpg','resten.jpg'],
    ];

    var descrArray = [
    ['Welkom bij Vliegveld Valkenburg. Dit kleine tweebaans vliegveld kent een bijzondere geschiedenis na de bouw in 1939. Swipe naar links om deze te ontdekken!','Tijdens de Tweede Wereldoorlog is dit vliegveld in handen gevallen van de Duitsers. Dit vliegveld was alleen helemaal nog niet voltooid! Hier waren de Duitsers niet van op de hoogte en gingen dit vliegveld alsnog gebruiken voor transport van mensen en materialen...','Het landen van de zware vliegtuigen op de nog onvoltooide landingsbaan ging niet volgens plan. Doordat de grond te zacht was strandde het eerste vliegtuig al halverwege de landingsbaan. Het tweede vliegtuig volgde door een druk tijdschema al snel, zonder te weten dat er nog een vliegtuig vast stond op de landingsbaan. Deze botsten dus op grote snelheid, evenals een aantal van de volgende vliegtuigen. Dit ging niet helemaal lekker dus!','Toen de Duitsers er eindelijk achterkwamen dat de landingsbaan nog niet geschikt was om op te landen, besloten ze de missie nog niet af te lasten. Het was namelijk erg belangrijk voor ze om snel het kabinet in Den Haag gevangen te nemen om zo de belangrijkste invloeden binnen Nederland onschadelijk te maken. Daarom maakten de aankomende vliegtuigen een noodlanding op het strand van Scheveningen.','Het vliegveld is tijdens en na de oorlog veelvuldig gebruikt. Momenteel zijn de landingsbanen al sinds 2010 buiten gebruik en wordt een hangar gebruikt voor een musical. Vanaf 2020 zal dit vliegveld verdwijnen en zullen er woonwijken voor in de plaats komen.'],
    ['Welkom bij Brittenburg, de Romeinse ruïne van een limesvesting. Swipe naar links om hier meer over te weten te komen!','De limes (Latijn voor "grens") is de aanduiding van de grens en verdedigingszone van het Romeinse Rijk, hoofdzakelijk gebouwd in de periode 40 na Chr - ca 250 na Chr. Deze liep van de atlantische kust in Noord- Engeland via de Noordzee langs de toenmalige hoofdstroom van de Rijn en Donau naar de Zwarte Zee.','Recent archeologisch onderzoek op de plaats waar de Brittenburg volgens recente gegevens kan liggen heeft niets opgeleverd. Wel zijn in 1982 bij het uitgraven van de huidige Uitwateringssluizen duidelijke aanwijzingen gevonden voor een Romeinse nederzetting, die mogelijk verband houdt met Lugdunum Batavorum.','De resten van dit castellum liggen tegenwoordig, door het terugwijken van de kustlijn, in zee. Nog tot in de twintigste eeuw zouden er bij extreem laag water resten van dit castellum (vanaf de zestiende eeuw de Brittenburg genoemd) te zien zijn geweest. De zee heeft waarschijnlijk de laatste resten weggespoeld, en wie tegenwoordig over het strand van Noordwijk naar de uitwatering bij Katwijk loopt zal zich moeilijk kunnen voorstellen dat daar ergens in zee ooit het eindpunt lag van de Romeinse limes, het imposante castellum Lugdunum.'],
    ];
*/


var infoContainer = document.getElementById('infoContainer');

function showInfo(data){
		// we'll need a place to store all separate elements and the eventual output
		var output = [];
    var headerImg = [];
    var h1Title = [];
    var pDescr = [];

    //add right image per page
		for(let i=0; i<imageArray[infoToLoad].length; i++){
			headerImg.push(
				imageArray[infoToLoad][i]
			);
		}

    //add right title per page
		for(let j=0; j<titleArray[infoToLoad].length; j++){
			h1Title.push(
				titleArray[infoToLoad][j]
			);
		}

    //add right description per page
		for(let k=0; k<descrArray[infoToLoad].length; k++){
			pDescr.push(
				descrArray[infoToLoad][k]
			);
		}

			// add this question and its answers to the output
      // titleArray is used, but it could have been any array, it's only the length that matters
      output.push('<div class="responsive contentHeight">');
      var imageUrl = "'../../images/POI/infowindow" + (infoToLoad + 1) + '/' + infoHeaderBG[infoToLoad] + "'";

      for(let l=0; l<titleArray[infoToLoad].length; l++){
        output.push(
          '<div class="slickContent">'
          +  '<div class="slickBgInfo" style="background-image:url(' + imageUrl + ')">'
          +    '<img src="../../images/POI/infowindow' + (infoToLoad + 1) + '/' + headerImg[l] + '" />'
          +  '</div>'
          +  '<div class="slickText">'
          +    '<h1>' + h1Title[l] + '</h1>'
          +    '<p>' + pDescr[l] + '</p>'
  			);
        if(l==0){//voeg swipeImage toe op eerste pagina
          output.push('<img src="../../images/tutorial/swipeLeft.png" class="swipeImg" />');
        }
        if(l==(titleArray[infoToLoad].length-1)){ //voeg naar kaart button toe op laatste pagina
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
  console.log("reached A");
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

var checkIfLoaded = true;
