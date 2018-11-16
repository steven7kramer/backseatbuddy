var getUrl = getURLParameter('id3');

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

var questionUrlLoader = ['kruispunt_zoeterwoude','universiteit_rotterdam','nhh_bergen'];
var questionArray = ['Tussen welke wegen wissel je op deze plek?','Langs welke universiteit rijd je nu?','Hoe heet Universiteit NHH in het Noors?'];
var answerArray = [
['A4 en N206','A1 en N207','N11 en A3','E3 en N201'],
['Universiteit van Eindhoven','Technische Universiteit','Erasmus Universiteit','Universiteit van Rotterdam'],
['Bedriftsadministrasjon','Norges Handels Høyskolen','Universitøt']
];
var rightAnswersArray = [0,2,1];

var quizContainer = document.getElementById('quiz');
var resultsContainer = document.getElementById('results');
var submitButton = document.getElementById('submit');

let quizesPlayed = [];//has to be replaced by saving what quizzes has been played in database

const questionToLoad = questionUrlLoader.findIndex(question => {
	return question === getUrl;
});

generateQuiz(getUrl, questionUrlLoader, questionArray, answerArray, rightAnswersArray, quizContainer, resultsContainer, submitButton);


function generateQuiz(getUrl, questionUrlLoader, questionArray, answerArray, rightAnswersArray, quizContainer, resultsContainer, submitButton){

	//controle wanneer geen van de questionUrlLoader gelijk is aan getUrl
	if(questionToLoad == -1){
			quizContainer.innerHTML = 'Er is iets misgegaan met het inladen van de quiz. <a href="https://caswognum.nl/">Ga terug naar de map</a> en probeer het nog een keer!';
			submitButton.parentNode.removeChild(submitButton);
	}else{
		if(quizesPlayed.includes(questionToLoad)){//controle of de vraag die geladen wordt niet al een keer gespeeld is
			quizContainer.innerHTML = 'Deze quiz heb je al gespeeld. <a href="https://caswognum.nl/">Ga terug naar de map</a> en probeer het nog een keer!';
			submitButton.parentNode.removeChild(submitButton);
		}else{
			showQuestions(questionArray,quizContainer, questionToLoad);
		}
	}

	function showQuestions(questionArray, quizContainer){
		// we'll need a place to store the output and the answer choices
		var output = [];
		var question = questionArray[questionToLoad];
		var answers = [];

		for(let j=0; j<answerArray[questionToLoad].length; j++){
			answers.push(
				'<div id="quizAnswer">'
					+ '<label>'
					+ '<input type="radio" name="answer">'
					+  answerArray[questionToLoad][j]
					+ '</label>'
					+ '</div>'
			);
		}

			// add this question and its answers to the output
			output.push(
				'<div class="question">' + question + '</div>'
				+ '<div class="answers">' + answers.join("") + '</div>'
			);

		// finally combine our output list into one string of html and put it on the page
		quizContainer.innerHTML = output.join('');
	}

	submitButton.onclick = function(){
		showResults(answerArray, rightAnswersArray, quizContainer, resultsContainer);
	}

	function showResults(answerArray, rightAnswersArray, quizContainer, resultsContainer){
		var userAnswer = document.getElementsByName('answer');
		var pickedRight = undefined;

		resultsContainer.innerHTML = 'Kies één van de opties!';

		for (var i = 0, length = userAnswer.length; i < length; i++) {
    		if (userAnswer[i].checked) {
        		if(i == rightAnswersArray[questionToLoad]){
					pickedRight = true;

				}else{
					pickedRight = false;
				}
				designResultWindow(pickedRight);
        		break;
    		}
		}


	}
}

function designResultWindow(pickedRight){
		quizContainer.innerHTML = '';
		submitButton.parentNode.removeChild(submitButton);

		let resultHtml = '';

		if(pickedRight){
			resultHtml += '<h3>Dat is het juiste antwoord!</h3>';
			resultHtml += '<p>Hiermee heb je 200 BackseatCoins bij elkaar gespeeld</p>'
			resultHtml += '<img src="../../images/other/bsbCoin200.png" style="width:100px;">'

			saveCoins(200);

		}else{
			resultHtml += '<h3>Dat is helaas niet juist</h3>';
		}

		if(questionToLoad == 0){
			resultHtml += '<p> Je wisselt hier tussen de A4 en de N206. Je had dit kunnen weten door buiten op de groene bordjes langs de weg te kijken, door op de blauwe borden te kijken boven de weg, of door op de kaart te kijken van Backseat Buddy!</p>'
			resultHtml += '<img src="../../images/POI/quiz/afslagResult.jpg" style="width:300px; margin:0 auto;">'
		}else if(questionToLoad == 1){
			resultHtml += '<p> Hier staat de prestigieuze Erasmus Universiteit! Je had dit kunnen zien op het gebouw in de onderstaande afbeelding, of op de blauwe borden boven de weg.</p>'
			resultHtml += '<img src="../../images/POI/quiz/uniRotResult.jpg" style="width:300px; margin:0 auto;">'
		}else if(questionToLoad == 2){
			resultHtml += '<p> De letters NHH staan voor de eerste letters van Norges Handels Høyskolen, wat "Noorse hogeschool voor de handel" betekend.</p>'
			resultHtml += '<img src="../../images/POI/quiz/uniBergenResult.jpg" style="width:300px; margin:0 auto;">'
		}

		resultHtml += '<div id="backToMap"><a href="https://caswognum.nl/"><i class="fa fa-map-o"></i>Terug naar de map</a></div>'

		resultsContainer.innerHTML = resultHtml;

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
