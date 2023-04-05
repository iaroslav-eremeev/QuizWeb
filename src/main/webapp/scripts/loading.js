import { Quiz } from "./model/quiz.js";
$(document).ready(function () {
// Populate category dropdown
    $.ajax({
        url: "https://opentdb.com/api_category.php",
        type: "GET",
        success: function (data) {
            let categorySelect = $("#category");
            categorySelect.append($("<option></option>").attr("value", "").text("Any Category"));
            $.each(data.trivia_categories, function (key, value) {
                categorySelect.append($("<option></option>").attr("value", value.id).text(value.name));
            });
        },
        error: function (xhr, status, error) {
            console.log("Error: " + error);
        }
    });

    // Populate difficulty dropdown
    let difficultySelect = $("#difficulty");
    difficultySelect.append($("<option></option>").attr("value", "").text("Any Difficulty"));
    difficultySelect.append($("<option></option>").attr("value", "easy").text("Easy"));
    difficultySelect.append($("<option></option>").attr("value", "medium").text("Medium"));
    difficultySelect.append($("<option></option>").attr("value", "hard").text("Hard"));

// Save button click handler
    $("#btn-save").click(async function () {
        const numberOfQuestions = $("#numberOfQuestions").val();
        const category = $("#category").val();
        const difficulty = $("#difficulty").val();
        const quiz = new Quiz(numberOfQuestions, category, difficulty);
        await quiz.getQuizQuestions();

        const extension = $("#extension").val(); // get the file extension from a dropdown list
        let data = "";
        if (extension === 'json') {
            data = JSON.stringify(quiz); // generate the appropriate file data
        }
        else if (extension === 'csv') {
            const header = ['numberOfQuestions', 'category', 'difficulty', 'question', 'correct_answer', 'incorrect_answers'];
            const rows = [header];
            quiz.getQuestions().forEach(function(question) {
                const row = [quiz.getNumberOfQuestions(), quiz.getCategory().getName(), quiz.getDifficulty().toString(), question.getQuestion(), question.getCorrect_answer(), question.getIncorrect_answers().join('|')];
                rows.push(row);
            });
            data = rows.map(e => e.join(',')).join('\n');
        }
        const blob = new Blob([data], {type: (extension === 'json') ? 'application/json' : 'text/csv'}); // create a blob from the data

        const fileSaver = document.createElement('a');
        fileSaver.href = URL.createObjectURL(blob);
        fileSaver.download = `quiz.${extension}`; // provide a default file name

        document.body.appendChild(fileSaver); // append the link to the document body
        fileSaver.click(); // trigger the save dialog

        document.body.removeChild(fileSaver); // remove the link from the document body
        URL.revokeObjectURL(fileSaver.href); // clean up the object URL after the file has been saved
    });



// Start button click handler
    $("#btn-start").click(function () {
        const numberOfQuestions = $("#numberOfQuestions").val();
        const category = $("#category").val();
        const difficulty = $("#difficulty").val();
        if (numberOfQuestions && category && difficulty) {
            localStorage.setItem("numberOfQuestions", numberOfQuestions);
            localStorage.setItem("category", category);
            localStorage.setItem("difficulty", difficulty);
            window.location.href = "game.html";
        } else {
            alert("Please enter all quiz settings and save them before starting the quiz.");
        }
    });
});
