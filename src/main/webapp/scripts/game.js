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
        const accordion = document.querySelector("#accordion");
        const questions = quiz.questions;
        shuffleArray(questions);
        questions.forEach((question, index) => {
            question.answers = [question.correct_answer, ...question.incorrect_answers];
            shuffleArray(question.answers);

            const card = document.createElement("div");
            const cardHeader = document.createElement("div");
            const cardBody = document.createElement("div");
            const questionText = document.createElement("p");

            card.className = "card";
            cardHeader.className = "card-header";
            cardHeader.id = `heading-${index}`;
            cardBody.className = "card-body collapse";
            cardBody.id = `collapse-${index}`;
            cardBody.setAttribute("aria-labelledby", `heading-${index}`);
            cardBody.setAttribute("data-parent", "#accordionExample");

            const button = document.createElement("button");
            button.className = "btn btn-link";
            button.type = "button";
            button.setAttribute("data-toggle", "collapse");
            button.setAttribute("data-target", `#collapse-${index}`);
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-controls", `collapse-${index}`);
            button.textContent = `Question ${index + 1}`;

            cardHeader.appendChild(button);
            card.appendChild(cardHeader);
            card.appendChild(cardBody);
            accordion.appendChild(card);

            const answerInputs = [];

            question.answers.forEach((answer) => {
                const answerLabel = document.createElement("label");
                const answerInput = document.createElement("input");
                answerInput.type = "radio";
                answerInput.name = `question-${index}`;
                answerInput.value = String(answer);
                answerInputs.push(answerInput);
                answerLabel.textContent = String(answer);
                answerLabel.className = "answer-label";
                cardBody.appendChild(answerLabel);
                cardBody.appendChild(answerInput);
            });

            questionText.textContent = question.question;
            questionText.className = "question-text";
            cardBody.insertBefore(questionText, answerInputs[0]);
        });
    }
    console.log(quiz);
    showQuestions();
});