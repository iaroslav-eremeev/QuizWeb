class Question {
    constructor(categoryName, type, difficulty, question, correct_answer, incorrect_answers) {
        this.categoryName = categoryName;
        this.type = type;
        this.difficulty = difficulty;
        this.question = question;
        this.correct_answer = correct_answer;
        this.incorrect_answers = incorrect_answers;
    }

    getCategory() {
        return this.categoryName;
    }

    setCategory(category) {
        this.categoryName = category;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    getDifficulty() {
        return this.difficulty;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    getQuestion() {
        return this.question;
    }

    setQuestion(question) {
        this.question = question;
    }

    getCorrect_answer() {
        return this.correct_answer;
    }

    setCorrect_answer(correct_answer) {
        this.correct_answer = correct_answer;
    }

    getIncorrect_answers() {
        return this.incorrect_answers;
    }

    setIncorrect_answers(incorrect_answers) {
        this.incorrect_answers = incorrect_answers;
    }

    toString() {
        return `Question {
            category: ${this.categoryName},
            type: ${this.type},
            difficulty: ${this.difficulty},
            question: ${this.question},
            correct_answer: ${this.correct_answer},
            incorrect_answers: ${JSON.stringify(this.incorrect_answers)}
        }`;
    }
}

class QuestionRepository {
    async downloadQuestions({ numberOfQuestions, category, difficulty }) {
        const url = `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category.getId()}&difficulty=${difficulty.toLowerCase()}&type=multiple`;
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            return new Promise((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status !== 200) {
                        reject(new Error(`HTTP error! status: ${xhr.status}`));
                    } else {
                        const responseResult = JSON.parse(xhr.responseText);
                        const { response_code, results } = responseResult;
                        if (response_code !== 0 || !Array.isArray(results)) {
                            reject(new Error(`Failed to download questions: unexpected response format`));
                        } else {
                            const questions = results.map(result => {
                                return new Question(result.category, result.type, result.difficulty,
                                    result.question, result.correct_answer, result.incorrect_answers);
                            });
                            resolve(questions);
                        }
                    }
                };
                xhr.onerror = () => {
                    reject(new Error(`Failed to download questions: network error`));
                };
                xhr.send();
            });
        } catch (error) {
            throw new Error(`Failed to download questions: ${error.message}`);
        }
    }
}

export { Question, QuestionRepository };