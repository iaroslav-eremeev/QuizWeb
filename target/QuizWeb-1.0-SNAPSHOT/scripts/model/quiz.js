import { Encrypt } from '../util/encrypt.js';
import { Category } from './category.js';
import { Question, QuestionRepository } from './question.js';

class Quiz {
    constructor(numberOfQuestions, category, difficulty, questions = []) {
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

    async getQuizQuestions() {
        const questionRepository = new QuestionRepository();
        this.questions = await questionRepository.downloadQuestions(this);
        for (let question of this.questions) {
            const unescapedQuestion = this.decodeHtmlEntities(question.getQuestion());
            question.setQuestion(unescapedQuestion);
            const unescapedCorrectAnswer = this.decodeHtmlEntities(question.getCorrect_answer());
            question.setCorrect_answer(unescapedCorrectAnswer);
            const unescapedIncorrectAnswers = question.getIncorrect_answers().map(answer => this.decodeHtmlEntities(answer));
            question.setIncorrect_answers(unescapedIncorrectAnswers);
        }
    }

    decodeHtmlEntities(text) {
        const entities = [    ['amp', '&'],
            ['apos', '\''],
            ['#x27', '\''],
            ['#x2F', '/'],
            ['#39', '\''],
            ['#47', '/'],
            ['lt', '<'],
            ['gt', '>'],
            ['nbsp', ' '],
            ['ldquo', '"'],
            ['rdquo', '"'],
            ['lsquo', '\''],
            ['rsquo', '\''],
            ['hellip', '...'],
            ['ndash', '-'],
            ['mdash', '-'],
            ['iexcl', '¡'],
            ['iquest', '¿']
        ];

        for (let i = 0, max = entities.length; i < max; ++i) {
            text = text.replace(new RegExp(`&${entities[i][0]};`, 'g'), entities[i][1]);
        }
        return text;
    }


    encryptQuestions(shift) {
        const encryptedQuestions = this.questions.map(question => Encrypt.encryptQuestion(question, shift));
        this.questions = encryptedQuestions;
    }

    decryptQuestions(shift) {
        const decryptedQuestions = this.questions.map(question => Encrypt.decryptQuestion(question, shift));
        this.questions = decryptedQuestions;
    }


    toString() {
        return `Quiz{ numberOfQuestions=${this.numberOfQuestions}, category=${this.category.getName()}, difficulty=${this.difficulty.getDifficulty()}, questions=${JSON.stringify(this.questions)} }`;
    }

}

export { Quiz };
