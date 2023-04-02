import {Question} from '../model/question.js';
import fetch from 'node-fetch';

class QuestionRepository {
    constructor() {
        this.questions = [];
    }

    async downloadQuestions(quiz) {
        const url = `https://opentdb.com/api.php?amount=${quiz.getNumberOfQuestions()}
        &category=${quiz.getCategory().getId()}
        &difficulty=${quiz.getDifficulty().toLowerCase()}&type=multiple`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseResult = await response.json();
            const { response_code, results } = responseResult;
            if (response_code !== 0) {
                throw new Error(`There are no questions from this category`);
            }
            this.questions = results.map(result => {
                return new Question(result.category, result.type, result.difficulty,
                    result.question, result.correct_answer, result.incorrect_answers);
            });
            return this.questions;
        } catch (error) {
            throw new Error(`Failed to download questions: ${error}`);
        }
    }

    getQuestions() {
        return this.questions;
    }

    setQuestions(questions) {
        this.questions = questions;
    }
}

export { QuestionRepository };
