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
    var difficultySelect = $("#difficulty");
    difficultySelect.append($("<option></option>").attr("value", "").text("Any Difficulty"));
    difficultySelect.append($("<option></option>").attr("value", "easy").text("Easy"));
    difficultySelect.append($("<option></option>").attr("value", "medium").text("Medium"));
    difficultySelect.append($("<option></option>").attr("value", "hard").text("Hard"));

// Save button click handler
    $("#btn-save").click(function () {
        var numberOfQuestions = $("#numberOfQuestions").val();
        var category = $("#category").val();
        var difficulty = $("#difficulty").val();

        localStorage.setItem("numberOfQuestions", numberOfQuestions);
        localStorage.setItem("category", category);
        localStorage.setItem("difficulty", difficulty);

        alert("Quiz settings saved!");
    });

// Start button click handler
    $("#btn-start").click(function () {
        var numberOfQuestions = localStorage.getItem("numberOfQuestions");
        var category = localStorage.getItem("category");
        var difficulty = localStorage.getItem("difficulty");

        if (numberOfQuestions && category && difficulty) {
            window.location.href = "quiz.html";
        } else {
            alert("Please enter all quiz settings and save them before starting the quiz.");
        }
    });
});
