import {Question} from "../model/question";

class QuestionRepository {
    async downloadQuestions({ numberOfQuestions, category, difficulty }) {
        const url = `https://opentdb.com/api.php?amount=${numberOfQuestions}
                    &category=${category.getId()}
                    &difficulty=${difficulty.toLowerCase()}&type=multiple`;
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = () => {
                if (xhr.status !== 200) {
                    throw new Error(`HTTP error! status: ${xhr.status}`);
                }
                const responseResult = JSON.parse(xhr.responseText);
                const { response_code, results } = responseResult;
                // Add error handling to check if the returned data has the expected structure
                if (response_code !== 0 || !Array.isArray(results)) {
                    throw new Error(`Failed to download questions: unexpected response format`);
                }
                this.questions = results.map(result => {
                    return new Question(result.category, result.type, result.difficulty,
                        result.question, result.correct_answer, result.incorrect_answers);
                });
                return this.questions;
            };
            xhr.send();
        } catch (error) {
            throw new Error(`Failed to download questions: ${error.message}`);
        }
    }

}

export { QuestionRepository };
