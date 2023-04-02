import { Difficulty } from './difficulty.js';
import { Question } from './question.js';

class Encrypt {
    // Encrypts a string using a Caesar cipher
    static encrypt(input, shift) {
        let encrypted = '';
        for (let i = 0; i < input.length; i++) {
            let c = input.charAt(i);
            if (/[a-zA-Z]/.test(c)) {
                let base = c.toLowerCase() === c ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
                c = String.fromCharCode(base + ((c.charCodeAt(0) - base + shift) % 26));
            } else if (/[0-9]/.test(c)) {
                c = String.fromCharCode('0'.charCodeAt(0) + ((c.charCodeAt(0) - '0'.charCodeAt(0) + shift) % 10));
            }
            encrypted += c;
        }
        return encrypted;
    }

    // Decrypts a string using a Caesar cipher
    static decrypt(input, shift) {
        let decrypted = '';
        for (let i = 0; i < input.length; i++) {
            let c = input.charAt(i);
            if (/[a-zA-Z]/.test(c)) {
                let base = c.toLowerCase() === c ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
                c = String.fromCharCode(base + ((c.charCodeAt(0) - base - shift + 26) % 26));
            } else if (/[0-9]/.test(c)) {
                c = String.fromCharCode('0'.charCodeAt(0) + ((c.charCodeAt(0) - '0'.charCodeAt(0) - shift + 10) % 10));
            }
            decrypted += c;
        }
        return decrypted;
    }

    // Encrypts a question using a Caesar cipher
    static encryptQuestion(question, shift) {
        const { category, type, difficulty } = question;
        const encryptedQuestion = Encrypt.encrypt(question.question, shift);
        const encryptedCorrectAnswer = Encrypt.encrypt(question.correct_answer, shift);
        const encryptedIncorrectAnswers = question.incorrect_answers.map(answer => Encrypt.encrypt(answer, shift));
        return new Question(category, type, Difficulty[difficulty], encryptedQuestion, encryptedCorrectAnswer, encryptedIncorrectAnswers);
    }

    // Decrypts a question using a Caesar cipher
    static decryptQuestion(encryptedQuestion, shift) {
        const decryptedQuestion = Encrypt.decrypt(encryptedQuestion.question, shift);
        const decryptedCorrectAnswer = Encrypt.decrypt(encryptedQuestion.correct_answer, shift);
        const decryptedIncorrectAnswers = encryptedQuestion.incorrect_answers.map(answer => Encrypt.decrypt(answer, shift));
        return new Question(encryptedQuestion.category, encryptedQuestion.type, Difficulty[encryptedQuestion.difficulty], decryptedQuestion, decryptedCorrectAnswer, decryptedIncorrectAnswers);
    }
}

export { Encrypt };
