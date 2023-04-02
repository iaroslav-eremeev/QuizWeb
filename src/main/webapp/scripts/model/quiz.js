import {Question} from './question.js';
import {Difficulty} from './difficulty.js';
import {QuestionRepository} from '../repositories/questionRepository.js';
import {Encrypt} from '../util/encrypt.js';
import he from 'he';
import {Category} from './category.js';

class Quiz {
    constructor(numberOfQuestions, category, difficulty, questions) {
        this.numberOfQuestions = numberOfQuestions;
        this.category = new Category(category);
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
        this.category = new Category(category);
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
            const unescapedQuestion = he.decode(question.getQuestion());
            question.setQuestion(unescapedQuestion);
            const unescapedCorrectAnswer = he.decode(question.getCorrect_answer());
            question.setCorrect_answer(unescapedCorrectAnswer);
            const unescapedIncorrectAnswers = new Array(question.getIncorrect_answers().length);
            for (let j = 0; j < question.getIncorrect_answers().length; j++) {
                unescapedIncorrectAnswers[j] = he.decode(question.getIncorrect_answers()[j]);
            }
            question.setIncorrect_answers(unescapedIncorrectAnswers);
        }
    }

    encryptQuestions(shift) {
        const encryptedQuestions = [];
        for (let i = 0; i < this.questions.length; i++) {
            const encryptedQuestion = Encrypt.encryptQuestion(this.questions[i], shift);
            encryptedQuestions.push(encryptedQuestion);
        }
        this.questions = encryptedQuestions;
    }

    decryptQuestions(shift) {
        const decryptedQuestions = [];
        for (let i = 0; i < this.questions.length; i++) {
            const decryptedQuestion = Encrypt.decryptQuestion(this.questions[i], shift);
            decryptedQuestions.push(decryptedQuestion);
        }
        this.questions = decryptedQuestions;
    }

    toString() {
        return `Quiz{ numberOfQuestions=${this.numberOfQuestions}, 
        category=${this.category.getName()}, difficulty=${this.difficulty}, 
        questions=${JSON.stringify(this.questions)} }`;
    }

}

export { Quiz };
