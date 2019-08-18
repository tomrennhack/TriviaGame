// prep for JQUERY

$(document).ready(function () {

    // VARIABLES

    var questionsArray = [
        {
            question: "Which of these are NOT a real NFL football team?",
            choices: ["Arizona Cardinals", "New York Jets", "Atlanta Bulldogs", "Los Angeles Rams"],
            answerIndex: 2,
            picture: "assets/images/atlanta-falcons.png"
        },
        {
            question: "What is the square root of 64?",
            choices: ["6", "7", "8", "9"],
            answerIndex: 2,
            picture: "assets/images/64.gif"
        },
        {
            question: "How do you say 'grapefruit' in French?",
            choices: ["Le grapefruit", "Pamplemousse", "Bonjour, Merci", "Arc de Triomphe"],
            answerIndex: 1,
            picture: "assets/images/pample.jpg"
        },
        {
            question: "Which was the first US State to be admitted or ratified?",
            choices: ["New York", "Pennsylvania", "Maryland", "Delaware"],
            answerIndex: 3,
            picture: "assets/images/delaware.jpg"
        },
        {
            question: "How long ago was 'four score and 7 years ago'?",
            choices: ["87", "107", "67", "407"],
            answerIndex: 0,
            picture: "assets/images/four-score.jpg"
        }
    ];

    // counter variables
    var winCount = 0;
    var lossCount = 0;

    // timer variables
    var timerSeconds = 20; // this was 'number' in class
    var currentTime; // this was 'intervalId' in class

    // HTML variables
    var startBtn = $("#start");
    var restartBtn = $("#restart");
    var questionSection = $("#question-shown");
    var answerSection = $("#answers-shown");
    var timeRemaining = $("#time-remaining");

    // other holders
    var userGuess = ""; // blank var for user's clicked guess
    var isRunning = false; // timer running status
    var pick; // for the question that is randomly selected
    var tempArray = []; // for question picking
    var shownArray = []; // to avoid dupe questions


    // =========================
    // ENTRY POINT
    // =========================

    // game start by hiding the 'restart' button and having user click the 'start' button

    restartBtn.hide();
    startBtn.on("click", function () {
        startBtn.hide(); // hide once clicked
        pickQuestion();
        timerRun();
        for (var i = 0; i < questionsArray.length; i++) { // add selected question to the temp array 
            tempArray.push(questionsArray[i]);
        }
    })
    // FUNCTIONS

    // timer to set interval of decrement function
    function timerRun() {
        if (!isRunning) { // if not running...
            currentTime = setInterval(decrement, 1000); // run decrement every 1 second
            isRunning = true; // ... and change status
        }
    }

    // decrement function to reduce time while user is guessing answer
    function decrement() {
        timeRemaining.text("Time Remaining: " + timerSeconds); // to HTML
        timerSeconds--; // reduce timerSeconds by 1 each interval

        // when time runs out...
        if (timerSeconds === 0) {
            clearInterval(currentTime); // reset interval
            lossCount++; // add to loss Count
            timerStop(); // stop timer
            answerSection.text("Time's Up! The correct answer was: " + pick.choices[pick.answerIndex]); // show correct answer
            endGameCheck(); // check if all questions have been asked
        }
    }

    // timer stop function
    function timerStop() {
        isRunning = false;
        clearInterval(currentTime); // clear the interval
    }

    // to select a question from the array
    function pickQuestion() {
        pick = questionsArray[Math.floor(Math.random() * questionsArray.length)]; // var random question
        questionSection.text(pick.question); // to HTML
        for (var i = 0; i < pick.choices.length; i++) {
            var answerClicked = $("<div>");
            answerClicked.addClass("answers"); // add answers class
            answerClicked.text(pick.choices[i]);
            answerClicked.attr("userGuessValue", i);
            answerSection.append(answerClicked);
        }

        // to check if the guess answer is correct
        $(".answers").on("click", function () {
            // get index position of the guessed answer
            userGuess = parseInt($(this).attr("userGuessValue"));

            // compare user index to the correct answer index
            // if correct...
            if (userGuess === pick.answerIndex) {
                timerStop();
                winCount++;
                userGuess = "";
                answerSection.html("<p style='color: green; font-size: 1.5em;'>That's right! You rock!</p><br>");
                endGameCheck();
            }
            
            // if incorrect...
            else {
                timerStop();
                lossCount++;
                userGuess = "";
                answerSection.html("<p style='color: red; font-size: 1.5em;'>Uh oh! The answer was: " + pick.choices[pick.answerIndex] + "</p><br>");
                endGameCheck();
            }
        })
    }

    function endGameCheck() {
        answerSection.append("<img src=" + pick.picture + " style='height: 200px;'>"); // show picture
        shownArray.push(pick); // add question to shown array to avoid dupes
        questionsArray.splice(questionsArray.length, 1); // push question to the back

        var timedEndGameCheck = setTimeout(function () {
            answerSection.empty(); // remove picture
            timerSeconds = 20; // reset timer to 20 for next scenario

            // end game check
            if (winCount + lossCount === questionsArray.length) {
                questionSection.empty();
                questionSection.text("That's all, Folks! Here is the score: ");
                answerSection.append("Wins: " + winCount);
                answerSection.append("Losses: " + lossCount);
                restartBtn.show();
                winCount = 0;
                lossCount = 0;
            } else {
                timerRun();
                pickQuestion();
            }
        }, 3000);
    }

    restartBtn.on("click", function () {
        restartBtn.hide();
        questionSection.empty();
        answerSection.empty();
        for (var i = 0; i < tempArray.length; i++) {
            questionsArray.push(tempArray[i]);
        }

        timerRun();
        pickQuestion();

    })

})