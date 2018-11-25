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

  //make array to store all question ID's
  var totalQuestionArray = [];

  //fill array with all question ID's
  for(let i=0;i<data.quizQuestion.length;i++){
    totalQuestionArray.push(data.quizQuestion[i].questionID);
  }

  //find the length of the array when it only contains unique VALUES
  //in other words; find the total amount of questions
  var totalQuestions = totalQuestionArray.unique().length;

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
  					+ '<input class="answerinput" type="radio" name="question' + questionNo + '" value="'+ data.quizQuestion[i].rightAnswer + '">'
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
      showResults(data, quizContainer, resultsContainer, totalQuestions);
	}

	function showResults(data, quizContainer, resultsContainer){

    //make a variable to store all possible answers
    var answerInputList = [];
    //find and store all possible answers
    for(let i=0; i<totalQuestions; i++){
        answerInputList.push(document.getElementsByName('question' + totalQuestionArray[i]));
    }
    //make a variable to store the given answer values
    var answerInput = [];

    //find and store the given answer values
    for(let i=0; i<totalQuestions;i++){
      for (let j = 0; j<answerInputList[i].length; j++){
         if(answerInputList[i][j].checked){
          answerInput.push(answerInputList[i][j].value);
         }
      }
    }

    if(answerInput.length < totalQuestions){
      resultsContainer.innerHTML = 'Je hebt nog niet alle vragen beantwoord!';
    }else{
      getResults(data, answerInput);
    }
	}
}

function getResults(data, answerInput){
  let rightAnswers = 0;
  let totalAnswers = answerInput.length;

  for(let i=0; i<answerInput.length;i++){
    if(answerInput[i]==1){
      rightAnswers++;
    }
  }

  designResultWindow(data, rightAnswers, totalAnswers);

}

function designResultWindow(data, rightAnswers, totalAnswers){
		quizContainer.innerHTML = '';
		submitButton.parentNode.removeChild(submitButton);

    //make var to store the resulting text
		let resultHtml = '';
    let coinAmount = (rightAnswers*data.quizQuestion[0].coinAmount);

		if(rightAnswers){
			resultHtml += '<h3>Heel goed gedaan!</h3>';
      resultHtml += 'Je hebt ' + rightAnswers + ' van de ' + totalAnswers + ' vragen goed beantwoord!';
			resultHtml += '<p>Hiermee heb je ' + coinAmount + ' BackseatCoins bij elkaar gespeeld</p>'
      resultHtml += '<div id="coinDisplayContainer"><div id="coinDisplay"><img src="../../images/other/bsbCoin.png"></div> + ' + coinAmount + '</div>';
			saveCoins(coinAmount);
		}else{
			resultHtml += '<h3>Helaas!</h3>';
      resultHtml += 'Je hebt geen van de vragen juist beantwoord, en dus geen munten verdiend!';
		}

    resultHtml += '<p>' + data.quizQuestion[0].resultText + '</p>';
    resultHtml += '<img class="resultImg" src="../../images/POI/quiz/' + data.quizQuestion[0].resultImage + '">';
		resultHtml += '<div id="backToMap"><a href="https://caswognum.nl/"><i class="fa fa-map-o"></i>Terug naar de map</a></div>'

		resultsContainer.innerHTML = resultHtml;
}

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.includes(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
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
