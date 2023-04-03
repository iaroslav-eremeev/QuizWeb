export class Question {
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
