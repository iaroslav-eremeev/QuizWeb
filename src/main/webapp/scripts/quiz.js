import {Question} from './question.js';
import {Difficulty} from './difficulty.js';
import {QuestionRepository} from './questionRepository.js';
import {Encrypt} from './encrypt.js';
import {StringEscapeUtils} from 'apache-commons-text';

class Quiz {
    constructor(numberOfQuestions, category, difficulty, questions) {
        this.numberOfQuestions = numberOfQuestions;
        this.category = category;
        this.difficulty = difficulty;
        this.questions = questions;
    }

    setNumberOfQuestions(numberOfQuestions) {
        this.numberOfQuestions = numberOfQuestions;
    }

    getNumberOfQuestions() {
        return this.numberOfQuestions;
    }

    setCategory(category) {
        this.category = category;
    }

    getCategory() {
        return this.category;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    getDifficulty() {
        return this.difficulty;
    }

    setQuestions(questions) {
        this.questions = questions;
    }

    getQuestions() {
        return this.questions;
    }

    async downloadQuestions() {
        const questionRepository = new QuestionRepository();
        this.questions = await questionRepository.downloadQuestions(this);
        for (let question of this.questions) {
            const unescapedQuestion = StringEscapeUtils.unescapeHtml4(question.getQuestion());
            question.setQuestion(unescapedQuestion);
            const unescapedCorrectAnswer = StringEscapeUtils.unescapeHtml4(question.getCorrect_answer());
            question.setCorrect_answer(unescapedCorrectAnswer);
            const unescapedIncorrectAnswers = new Array(question.getIncorrect_answers().length);
            for (let j = 0; j < question.getIncorrect_answers().length; j++) {
                unescapedIncorrectAnswers[j] = StringEscapeUtils.unescapeHtml4(question.getIncorrect_answers()[j]);
            }
            question.setIncorrect_answers(unescapedIncorrectAnswers);
        }
    }

    encryptQuestions(shift) {
        const encryptedQuestions = new Array();
        for (let i = 0; i < this.questions.length; i++) {
            const encryptedQuestion = Encrypt.encryptQuestion(this.questions[i], shift);
            encryptedQuestions.push(encryptedQuestion);
        }
        this.questions = encryptedQuestions;
    }

    decryptQuestions(shift) {
        const decryptedQuestions = new Array();
        for (let i = 0; i < this.questions.length; i++) {
            const decryptedQuestion = Encrypt.decryptQuestion(this.questions[i], shift);
            decryptedQuestions.push(decryptedQuestion);
        }
        this.questions = decryptedQuestions;
    }

    toString() {
        return `Quiz{ numberOfQuestions=${this.numberOfQuestions}, category=${this.category}, difficulty=${this.difficulty}, questions=${JSON.stringify(this.questions)} }`;
    }

}