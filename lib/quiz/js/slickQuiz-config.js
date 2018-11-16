// Setup your quiz text and questions here

// NOTE: pay attention to commas, IE struggles with those bad boys

var quizJSON = {
    "info": {
        "name":    "Afslag Quiz",
        "main":    "<p>Tip: kijk naar de bordjes buiten of vraag het aan je medereizigers!</p>" // no comma here
    },
    "questions": [
        { // Question 1 - Multiple Choice, Single True Answer
            "q": "Tussen welke 2 grote wegen wordt hier gewisseld?",
            "a": [
                {"option": "A4 en N112",      "correct": false},
                {"option": "A6 en B3",     "correct": false},
                {"option": "Noorwegen en Brabant",      "correct": true},
                {"option": "B",     "correct": false} // no comma here
            ],
            "correct": "<p><span>Sterk!</span> Hier wissel je inderdaad van Noorwegen naar Brabant!</p>",
            "incorrect": "<p><span>Pff.</span> niet eens in de buurt</p>" // no comma here
        }
    ]
};
