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

        let extension = '';
        const isJson = confirm('Do you want to save the quiz as a JSON file?');
        if (isJson) {
            extension = 'json';
        } else {
            const isCsv = confirm('Do you want to save the quiz as a CSV file?');
            if (isCsv) {
                extension = 'csv';
            }
            else {
                // If the user didn't choose a file format, we can't save the file
                alert('You must choose a file format to save the quiz!');
                return;
            }
        }

        const filename = prompt('Please enter a filename (without extension) for your quiz:');
        if (!filename) {
            // If the user didn't provide a filename, we can't save the file
            return;
        }

        let data = '';
        if (extension === 'json') {
            data = JSON.stringify(quiz);
        } else if (extension === 'csv') {
            // Create CSV data
            const header = ['numberOfQuestions', 'category', 'difficulty', 'question', 'correct_answer', 'incorrect_answers'];
            const rows = [header];
            quiz.getQuestions().forEach(function(question) {
                const row = [quiz.getNumberOfQuestions(), quiz.getCategory().getName(), quiz.getDifficulty().toString(), question.getQuestion(), question.getCorrect_answer(), question.getIncorrect_answers().join('|')];
                rows.push(row);
            });
            data = rows.map(e => e.join(',')).join('\n');
        }

        // Create a blob and open the save dialog
        const blob = new Blob([data], {type: (extension === 'json') ? 'application/json' : 'text/csv'});
        const fileSaver = document.createElement('a');
        fileSaver.href = URL.createObjectURL(blob);
        fileSaver.download = `${filename}.${extension}`; // Use the filename and extension provided by the user
        fileSaver.dispatchEvent(new MouseEvent('click'));
        URL.revokeObjectURL(fileSaver.href);
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
