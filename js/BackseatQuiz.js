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

var quizContainer = document.getElementById('quiz');
var resultsContainer = document.getElementById('results');
var submitButton = document.getElementById('submit');

jQuery(document).ready(function(){
  var contentID = getURLParameter('id');

  jQuery.ajax({
      type: "POST",
      url: "../../php/BackseatDB.php",
      datatype: 'json',
      data: {functionname: 'quizLoader', qID:contentID},

      success: function(data) {
          if (!('error' in data)) {
              generateQuiz(data, quizContainer, resultsContainer, submitButton);
              console.log(data);
          }else{
            quizContainer.innerHTML = 'Er is iets misgegaan met het inladen van de quiz. Ga terug naar de map en probeer het nog een keer! <div id="backToMap"><a href="https://caswognum.nl/"><i class="fa fa-map-o"></i>Terug naar de map</a></div>';
      			submitButton.parentNode.removeChild(submitButton);
          }
      }
  });
});


function generateQuiz(data, quizContainer, resultsContainer, submitButton){

	showQuestions(data, quizContainer);

	function showQuestions(data, quizContainer){
		// we'll need a place to store the output and the answer choices
		var output = [];
		var question = [];
		var answers = [];

    // load right questions into the questionarray
    for(let i=0; i<data.quizQuestion.length; i++){
      if(question.indexOf(data.quizQuestion[i].question) === -1){
        question.push(data.quizQuestion[i].question);
      }else{
        question.push("undefined");
      }
    }


    // load right answer into the answerarray
		for(let i=0; i<data.quizQuestion.length; i++){
        let questionNo = data.quizQuestion[i].questionID;

        answers.push(
  				'<div id="quizAnswer">'
  					+ '<label>'
  					+ '<input class="answerinput" type="radio" name="question' + questionNo + '">'
  					+  data.quizQuestion[i].answer
  					+ '</label>'
  					+ '</div>'
  			);
      }

		// add this question and its answers to the output
    for(let i=0; i<data.quizQuestion.length; i++){

      if(question[i] != "undefined"){
        output.push('<div class="question">' + question[i] + '</div>');
      }

      output.push('<div class="answers">' + answers[i] + '</div>');
    }

		// finally combine our output list into one string of html and put it on the page
		quizContainer.innerHTML = output.join('');
	}

	submitButton.onclick = function(){
      showResults(data, quizContainer, resultsContainer);
	}

	function showResults(data, quizContainer, resultsContainer){

    //make a variable to store all possible answers
    var answerInputList = [];

    //find and store all possible answers
    for(let i=0; i<data.quizQuestion.length; i++){
      answerInputList.push(document.getElementsByName('question' + i));
    }

    //make a variable to store the given answer values
    var answerInput = [];

    //find and store the given answer values
    for(let i=0; i<answerInputList.length;i++){
      for (let j = 0; j<answerInputList[i].length; j++){
         if(answerInputList[i][j].checked){
          answerInput.push(answerInputList[i][j].value);

          //there can only be one answer per question, break out of the for loop if found
          break;
         }
      }
    }

    // check if all questions are answered, if yes, call resultpage
    // if there are not as many inputs as questions, a question is not answered
    if(data.quizQuestion.rightAnswer == 1){
      //resultsContainer.innerHTML = 'Je hebt nog niet op alle vragen antwoord gegeven!';
      //getResults(answerInput);
    }else{
      
    }
	}
}

function getResults(answerInput){
  let rightAnswers = 0;
  let totalAnswers = answerInput.length;

  for(let i=0; i<answerInput.length;i++){
    if(answerInput[i]==rightAnswersArray[questionToLoad][i]){
      rightAnswers++;
    }
  }

  resultsContainer.innerHTML = 'Je hebt ' + rightAnswers + ' van de ' + totalAnswers + ' vragen goed beantwoord!';
  //designResultWindow(rightAnswers, totalAnswers);

}

function designResultWindow(rightAnswers, totalAnswers){
		quizContainer.innerHTML = '';
		submitButton.parentNode.removeChild(submitButton);

    //make var to store the resulting text
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
