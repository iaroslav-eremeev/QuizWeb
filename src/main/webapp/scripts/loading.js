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
        await quiz.encryptQuestions(parseInt(localStorage.getItem('decryptKey')));
        let extension = '';
        let filename = '';
        await Swal.fire({
            title: "Saving quiz to a file",
            html: `<input type="text" id="fileName" class="swal2-input" placeholder="Filename">`,
            text: "Please select a file format:",
            confirmButtonText: 'JSON',
            background: '#000',
            showDenyButton: true,
            denyButtonText: 'CSV',
            customClass: {
                confirmButton: 'btn btn-primary',
                confirmButtonColor: '#0275d8',
                denyButton: 'btn btn-warning',
                denyButtonColor: '#f0ad4e',
                popup: 'bg-dark',
                content: 'text-white'
            },
            focusConfirm: false,
            preConfirm: () => {
                const fileName = Swal.getPopup().querySelector('#fileName').value
                if (!fileName) {
                    Swal.showValidationMessage(`Please enter file name`)
                }
                return { fileName: fileName }
            },
            preDeny: () => {
                const fileName = Swal.getPopup().querySelector('#fileName').value
                if (!fileName) {
                    Swal.showValidationMessage(`Please enter file name`)
                }
                return { fileName: fileName }
            }
        }).then((result) => {
            filename = result.value.fileName;
            if (result.isConfirmed) {
                extension = 'json';
            }
            else if (result.isDenied) {
                extension = 'csv';
            }
        });

        let data = '';
        if (extension === 'json') {
            data = JSON.stringify(quiz);
        } else if (extension === 'csv') {
            // Create CSV data
            const header = ['numberOfQuestions', 'category', 'difficulty', 'questions'];
            const rows = [header];
            quiz.getQuestions().forEach(function(question) {
                const combinedAnswers = [question.getCorrect_answer(), ...question.getIncorrect_answers()].join('|');
                const row = [quiz.getNumberOfQuestions(), quiz.getCategory().getName(), quiz.getDifficulty().toString(), `${question.getQuestion()}|${combinedAnswers}`];
                rows.push(row);
            });
            const data = rows.map(e => e.join(',')).join('\n');
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
    $("#btn-start").click(async function () {
        const numberOfQuestions = $("#numberOfQuestions").val();
        const category = $("#category").val();
        const difficulty = $("#difficulty").val();
        if (numberOfQuestions && category && difficulty) {
            const quiz = new Quiz(numberOfQuestions, category, difficulty);
            await quiz.getQuizQuestions();
            localStorage.setItem("quiz", JSON.stringify(quiz));
            window.location.href = "game.html";
        } else {
            alert("Please enter all quiz settings and save them before starting the quiz.");
        }
    });
});
