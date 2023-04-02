import { Question } from "./model/question.js";
import { Quiz } from "./model/quiz.js";

$('#btn-from-internet').click(function() {
    // Check if the checkbox is checked
    let showCorrectAnswers = $('#showCorrectAnswers').prop('checked');
    // Store the checkbox state in local storage
    localStorage.setItem('showCorrectAnswers', showCorrectAnswers);
    // Redirect to loading.html
    window.location.href = 'loading.html';
});

// Store the state of the checkbox in local storage when clicked
$('#showCorrectAnswers').click(function() {
    const checked = $(this).is(':checked');
    localStorage.setItem('showCorrectAnswers', checked);
});

// Load file on click
$('#btn-from-file').click(function() {
    // Get the last directory path from local storage or set it to user root
    const lastDirPath = localStorage.getItem('dirPath') || "";
    // Open a file chooser dialog and set the initial directory
    $('<input type="file">').change(function() {
        const file = this.files[0];
        if (file) {
    // Store the new directory path in local storage
            localStorage.setItem('dirPath', file.webkitRelativePath || "");
            const fileExt = file.name.split('.').pop().toLowerCase();
            // If JSON file chosen
            if (fileExt === 'json') {
                const reader = new FileReader();
                reader.onload = function() {
                    let quiz;
                    if (typeof reader.result === 'string') {
                        quiz = JSON.parse(reader.result);
                    } else if (reader.result instanceof ArrayBuffer) {
                        const decoder = new TextDecoder();
                        const decodedData = decoder.decode(reader.result);
                        quiz = JSON.parse(decodedData);
                    }
                    // Decrypt questions using the unique key stored in local storage
                    const decryptKey = parseInt(localStorage.getItem('decryptKey')) || 0;
                    const decryptedQuiz = decryptQuiz(quiz, decryptKey);
                    // Save the quiz in local storage and go to game page
                    localStorage.setItem('quiz', JSON.stringify(decryptedQuiz));
                    window.location.href = 'game.html';
                }
                reader.readAsArrayBuffer(file);
                // If CSV file chosen
            } else if (fileExt === 'csv') {
                const reader = new FileReader();
                reader.onload = function() {
                    const quiz = parseCsv(reader.result);
                    // Decrypt questions using the unique key stored in local storage
                    const decryptKey = parseInt(localStorage.getItem('decryptKey')) || 0;
                    const decryptedQuiz = decryptQuiz(quiz, decryptKey);
                    // Save the quiz in local storage and go to game page
                    localStorage.setItem('quiz', JSON.stringify(decryptedQuiz));
                    window.location.href = 'game.html';
                }
                reader.readAsText(file);
            } else {
                alert('Invalid file type. Please choose a JSON or CSV file.');
            }
        }
    }).click();
});

// Function to decrypt the questions in a quiz object
function decryptQuiz(quiz, decryptKey) {
    for (let i = 0; i < quiz.questions.length; i++) {
        let question = quiz.questions[i];
        question.text = decrypt(question.text, decryptKey);
        question.correctAnswer = decrypt(question.correctAnswer, decryptKey);
        for (let j = 0; j < question.incorrect_answers.length; j++) {
            question.incorrect_answers[j] = decrypt(question.incorrect_answers[j], decryptKey);
        }
    }
    return quiz;
}
// Function to decrypt a string using a key
function decrypt(text, key) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) - key);
    }
    return result;
}

// Function to parse a CSV string and return a quiz object
function parseCsv(csv) {
    // Split the CSV data into an array of lines
    const lines = csv.trim().split('\n');
    // Extract the headers from the first line
    const headers = lines[0].split(',');
    // Initialize an empty array to store the parsed data
    const data = [];
    // Iterate over the remaining lines and parse each row
    for (let i = 1; i < lines.length; i++) {
        // Split the line into an array of values
        const values = lines[i].split(',');
        // Create an object to store the row data
        const row = {};
        // Iterate over the headers and assign the values to the corresponding properties
        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = values[j];
        }
        // Add the row object to the data array
        data.push(row);
    }
    // Return the parsed data
    return data;
}


