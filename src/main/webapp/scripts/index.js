$('#btn-from-internet').click(function() {
    // Check if the checkbox is checked
    var showCorrectAnswers = $('#showCorrectAnswers').prop('checked');
    // Store the checkbox state in local storage
    localStorage.setItem('showCorrectAnswers', showCorrectAnswers);
    // Redirect to loading.html
    window.location.href = 'loading.html';
});

$(document).ready(function() {
    // Store the state of the checkbox in local storage when clicked
    $('#showCorrectAnswers').click(function() {
        var checked = $(this).is(':checked');
        localStorage.setItem('showCorrectAnswers', checked);
    });
    // Load file on click
    $('#btn-from-file').click(function() {
        // Get the last directory path from local storage or set it to user root if not present
        var lastDirPath = localStorage.getItem('dirPath') || "";
        // Open a file chooser dialog and set the initial directory
        $('<input type="file">').change(function() {
            var file = this.files[0];
            if (file) {
                // Store the new directory path in local storage
                localStorage.setItem('dirPath', file.path || "");
                var fileExt = file.name.split('.').pop().toLowerCase();
                // If JSON file chosen
                if (fileExt === 'json') {
                    var reader = new FileReader();
                    reader.onload = function() {
                        var quiz = JSON.parse(reader.result);
                        // Decrypt questions using the unique key stored in local storage
                        var decryptKey = parseInt(localStorage.getItem('decryptKey')) || 0;
                        quiz = decryptQuiz(quiz, decryptKey);
                        // Save the quiz in local storage and go to game page
                        localStorage.setItem('quiz', JSON.stringify(quiz));
                        window.location.href = 'game.html';
                    }
                    reader.readAsText(file);
                    // If CSV file chosen
                } else if (fileExt === 'csv') {
                    var reader = new FileReader();
                    reader.onload = function() {
                        var quiz = parseCsv(reader.result);
                        // Decrypt questions using the unique key stored in local storage
                        var decryptKey = parseInt(localStorage.getItem('decryptKey')) || 0;
                        quiz = decryptQuiz(quiz, decryptKey);
                        // Save the quiz in local storage and go to game page
                        localStorage.setItem('quiz', JSON.stringify(quiz));
                        window.location.href = 'game.html';
                    }
                    reader.readAsText(file);
                } else {
                    alert('Invalid file type. Please choose a JSON or CSV file.');
                }
            }
        }).click();
    });
});

// Function to decrypt the questions in a quiz object
function decryptQuiz(quiz, decryptKey) {
    for (var i = 0; i < quiz.questions.length; i++) {
        var question = quiz.questions[i];
        question.text = decrypt(question.text, decryptKey);
        question.correctAnswer = decrypt(question.correctAnswer, decryptKey);
        for (var j = 0; j < question.incorrectAnswers.length; j++) {
            question.incorrectAnswers[j] = decrypt(question.incorrectAnswers[j], decryptKey);
        }
    }
    return quiz;
}

// Function to decrypt a string using a key
function decrypt(text, key) {
    var result = "";
    for (var i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) - key);
    }
    return result;
}

// Function to parse a CSV string and return a quiz object
function parseCsv(csv) {
    // Split the CSV data into an array of lines
    var lines = csv.trim().split('\n');
    // Extract the headers from the first line
    var headers = lines[0].split(',');
    // Initialize an empty array to store the parsed data
    var data = [];
    // Iterate over the remaining lines and parse each row
    for (var i = 1; i < lines.length; i++) {
        // Split the line into an array of values
        var values = lines[i].split(',');
        // Create an object to store the row data
        var row = {};
        // Iterate over the headers and assign the values to the corresponding properties
        for (var j = 0; j < headers.length; j++) {
            row[headers[j]] = values[j];
        }
        // Add the row object to the data array
        data.push(row);
    }
    // Return the parsed data
    return data;
}

