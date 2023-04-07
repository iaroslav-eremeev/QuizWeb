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
        const tabs = document.querySelector('.tabs');
        const tabContents = document.querySelector('.tab-contents');
        quiz.questions.forEach((question, index) => {
            shuffleArray(question.incorrect_answers);
            question.answers = [question.correct_answer, ...question.incorrect_answers];
            shuffleArray(question.answers);

            const tab = document.createElement('div');
            const input = document.createElement('input');
            const label = document.createElement('label');
            const tabContent = document.createElement('div');
            const questionText = document.createElement('p');

            tab.className = 'tab';
            input.id = `tab-${index + 1}`;
            input.type = 'radio';
            input.name = 'tabs';
            if (index === 0) input.checked = true;
            label.htmlFor = `tab-${index + 1}`;
            label.textContent = `Question ${index + 1}`;
            tabContent.className = 'tab-content';
            questionText.textContent = question.question;

            tab.appendChild(input);
            tab.appendChild(label);
            tabContents.appendChild(tabContent);
            tabContent.appendChild(questionText);

            question.answers.forEach(answer => {
                const answerLabel = document.createElement('label');
                const answerInput = document.createElement('input');
                answerInput.type = 'radio';
                answerInput.name = `question-${index}`;
                answerInput.value = answer;
                answerLabel.textContent = answer;
                tabContent.appendChild(answerInput);
                tabContent.appendChild(answerLabel);
            });
        });

        const checkButton = document.createElement('button');
        checkButton.textContent = 'Check';
        checkButton.addEventListener('click', checkAnswers);
        tabs.appendChild(checkButton);
    }

    function checkAnswers() {
        const result = quiz.questions.map((question, index) => {
            const checkedInput = document.querySelector(`input[name="question-${index}"]:checked`);
            const isCorrect = checkedInput.value === question.correct_answer;
            const answerText = isCorrect ? '+' : '-';
            const answerLabel = isCorrect ? '' : ` Correct answer: ${question.correct_answer}`;
            return `Q${index + 1}: ${answerText}${showCorrectAnswers ? answerLabel : ''}`;
        });
        const correctAnswers = result.filter(answer => answer.includes('+')).length;
        const total = quiz.questions.length;
        const percentage = ((correctAnswers / total) * 100).toFixed(1);
        result.push(`Total: ${correctAnswers}/${total} (${percentage}%)`);
        const resultText = result.join('\n');
        alert(resultText);
    }

    showQuestions();
});