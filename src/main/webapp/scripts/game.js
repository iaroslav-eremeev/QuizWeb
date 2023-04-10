$(document).ready(function() {
    // Load the quiz data from localStorage
    const quiz = JSON.parse(localStorage.getItem('quiz'));

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showQuestions() {
        document.querySelector("#quiz-container").innerHTML = "";
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

            const answerContainer = document.createElement("div");
            answerContainer.className = "answer-container";
            question.answers.forEach((answer) => {
                const answerOptionContainer = document.createElement("div");
                answerOptionContainer.className = "answer-option-container";
                answerContainer.appendChild(answerOptionContainer);
                const answerLabel = document.createElement("label");
                const answerInput = document.createElement("input");
                answerInput.type = "radio";
                answerInput.name = `question-${index}`;
                answerInput.value = String(answer);
                answerLabel.textContent = String(answer);
                answerLabel.className = "answer-label";
                answerOptionContainer.appendChild(answerInput);
                answerOptionContainer.appendChild(answerLabel);
            });
            quizContainer.appendChild(answerContainer);
        });

        document.querySelector("#checkButton").addEventListener("click", function () {
            const result = quiz.questions.map((question, index) => {
                const checkedInput = document.querySelector(
                    `input[name="question-${index}"]:checked`
                );
                const isCorrect = checkedInput.value === question.correct_answer;
                const showCorrectAnswers = localStorage.getItem("showCorrectAnswers");
                const answerText = isCorrect ? "+" : "-";
                const answerLabel = isCorrect
                    ? ""
                    : ` Correct answer: ${question.correct_answer}`;
                return `Q${index + 1}: ${
                    answerText}${showCorrectAnswers ? answerLabel : ""
                }<br>`;
            });
            const correctAnswers = result.filter((answer) => answer.includes("+")).length;
            const total = quiz.questions.length;
            const percentage = ((correctAnswers / total) * 100).toFixed(1);
            result.push(
                `Total: ${correctAnswers}/${total} (${percentage}%)`
            );
            const resultText = result.join("<br>");
            Swal.fire({
                title: "Results",
                html: resultText,
                background: "#000",
                confirmButtonText: "Got it",
            });
        });
    }
    showQuestions();
});