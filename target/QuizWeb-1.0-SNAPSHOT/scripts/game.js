$(document).ready(function() {
    // Load the quiz data from localStorage
    const quiz = JSON.parse(localStorage.getItem('quiz'));

    // Load the show correct answers option from localStorage
    const showCorrectAnswers = localStorage.getItem('showCorrectAnswers');

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showQuestions() {
        const quizContainer = document.querySelector("#quiz-container");
        const questions = quiz.questions;
        shuffleArray(questions);
        questions.forEach((question, index) => {
            question.answers = [question.correct_answer, ...question.incorrect_answers];
            shuffleArray(question.answers);

            const questionContainer = document.createElement("div");
            questionContainer.className = "question-container";
            questionContainer.innerHTML = `<div class="question">${question.question}</div>`;
            quizContainer.appendChild(questionContainer);

            question.answers.forEach((answer) => {
                const answerLabel = document.createElement("label");
                const answerInput = document.createElement("input");
                answerInput.type = "radio";
                answerInput.name = `question-${index}`;
                answerInput.value = String(answer);
                answerLabel.textContent = String(answer);
                answerLabel.className = "answer-label";
                questionContainer.appendChild(answerInput);
                questionContainer.appendChild(answerLabel);
            });
        });
    }


    showQuestions();
});