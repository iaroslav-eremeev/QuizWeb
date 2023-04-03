$(document).ready(function () {
// Populate category dropdown
    $.ajax({
        url: "https://opentdb.com/api_category.php",
        type: "GET",
        success: function (data) {
            // get a reference to the category select element
            let categorySelect = $("#category");
            // add an option for "Any Category"
            categorySelect.append($("<option></option>").attr("value", "").text("Any Category"));
            // iterate through each category and add an option to the select element with its name and ID
            $.each(data.trivia_categories, function (key, value) {
                categorySelect.append($("<option></option>").attr("value", value.id).text(value.name));
            });
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
        await quiz.downloadQuestions();

        const fileChooser = $('<input type="file" />').attr('accept', '.json,.csv').hide();
        $('body').append(fileChooser);
        fileChooser.change(async function() {
            const file = $(this)[0].files[0];
            if (file) {
                const extension = file.name.split('.').pop();
                if (extension === 'json') {
                    const data = JSON.stringify(quiz);
                    const blob = new Blob([data], {type: 'application/json'});
                    const link = document.createElement('a');
                    link.download = file.name;
                    link.href = URL.createObjectURL(blob);
                    link.click();
                } else if (extension === 'csv') {
                    const header = ['numberOfQuestions', 'category', 'difficulty', 'question', 'correct_answer', 'incorrect_answers'];
                    const rows = [header];
                    quiz.getQuestions().forEach(function(question) {
                        const row = [quiz.getNumberOfQuestions(), quiz.getCategory().getName(), quiz.getDifficulty().toString(), question.getQuestion(), question.getCorrect_answer(), question.getIncorrect_answers().join('|')];
                        rows.push(row);
                    });
                    const csvContent = rows.map(e => e.join(',')).join('\n');
                    const blob = new Blob([csvContent], {type: 'text/csv'});
                    const link = document.createElement('a');
                    link.download = file.name;
                    link.href = URL.createObjectURL(blob);
                    link.click();
                }
            }
        });
        fileChooser.click();
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
