import { Difficulty } from './difficulty.js';

export class Question {
    constructor(category, type, difficulty, question, correct_answer, incorrect_answers) {
        this.category = category;
        this.type = type;
        this.difficulty = difficulty;
        this.question = question;
        this.correct_answer = correct_answer;
        this.incorrect_answers = incorrect_answers;
    }

    getCategory() {
        return this.category;
    }

    setCategory(category) {
        this.category = category;
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
        return `Question { category: ${this.category}, 
        type: ${this.type}, difficulty: ${this.difficulty}, 
        question: ${this.question}, correct_answer: ${this.correct_answer}, 
        incorrect_answers: ${JSON.stringify(this.incorrect_answers)} }`;
    }
}

export { Question };
