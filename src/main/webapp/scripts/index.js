import { Encrypt } from "./util/encrypt.js";
import {Quiz} from "./model/quiz.js";
import {Question} from "./model/question.js";

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
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = function (event) {
        const file = event.target.files[0];
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
                    const quizTemp = parseCsv(reader.result);
                    const quiz = new Quiz(quizTemp[0].numberOfQuestions, 0, quizTemp[0].difficulty);
                    const questions = [];
                    for (let i = 0; i < quizTemp.length; i++) {
                        const quizQuestion = quizTemp[i].question;
                        const quizCorrectAnswer = quizTemp[i].correct_answer;
                        const quizIncorrectAnswers = quizTemp[i].incorrect_answers;
                        const question = new Question("tempCat", "tempType", "tempDiff", quizQuestion, quizCorrectAnswer, quizIncorrectAnswers);
                        questions.push(question);
                    }
                    quiz.setQuestions(questions);
                    console.log(quiz);
                    const decryptKey = parseInt(localStorage.getItem('decryptKey'));
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
    };
    input.click();
});

// Function to decrypt the questions in a quiz object
function decryptQuiz(quiz, decryptKey) {
    for (let i = 0; i < quiz.questions.length; i++) {
        let question = quiz.questions[i];
        question.question = Encrypt.decrypt(question.question, decryptKey);
        question.correct_answer = Encrypt.decrypt(question.correct_answer, decryptKey);
        for (let j = 0; j < question.incorrect_answers.length; j++) {
            question.incorrect_answers[j] = Encrypt.decrypt(question.incorrect_answers[j], decryptKey);
        }
    }
    return quiz;
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
        // If the line contains a comma in the question, the split will result in more than 5 values
        // In this case, we need to combine the values in the question column
        if (values.length > 5) {
            const question = [];
            // Iterate over the values and combine the question values
            for (let j = 0; j < values.length; j++) {
                if (j < 4) {
                    question.push(values[j]);
                } else {
                    question[3] += ',' + values[j];
                }
            }
            // Replace the original values with the combined question value
            lines[i] = question.join(',');
        }
        // Create an object to store the row data
        const row = {};
        // Iterate over the headers and assign the values to the corresponding properties
        for (let j = 0; j < headers.length; j++) {
            if (headers[j] === 'questions') {
                const question = values[j].split('|');
                row['question'] = question[0];
                row['correct_answer'] = question[1];
                row['incorrect_answers'] = question.slice(2);
            } else {
                row[headers[j]] = values[j];
            }
        }
        // Add the row object to the data array
        data.push(row);
    }
    // Return the parsed data
    return data;
}



