package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.Cascade;
import util.Encrypt;
import org.apache.commons.text.StringEscapeUtils;
import repositories.QuestionRepository;

import javax.persistence.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Data
@NoArgsConstructor
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "number_of_questions", nullable = false)
    private int numberOfQuestions;
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @Column(name = "difficulty", nullable = false)
    private Difficulty difficulty;
    @ToString.Exclude
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "quiz")
    @Cascade(value = org.hibernate.annotations.CascadeType.DELETE)
    private List<Question> questions;
    @Column(name = "date")
    private Date date;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public void downloadQuestions() throws IOException {
        QuestionRepository questionRepository = new QuestionRepository();
        this.questions = questionRepository.downloadQuestions(this);
        for (Question question : questions) {
            String unescapedQuestion = StringEscapeUtils.unescapeHtml4(question.getQuestion());
            question.setQuestion(unescapedQuestion);
            String unescapedCorrectAnswer = StringEscapeUtils.unescapeHtml4(question.getCorrect_answer());
            question.setCorrect_answer(unescapedCorrectAnswer);
            String[] unescapedIncorrectAnswers = new String[question.getIncorrect_answers().length];
            for (int j = 0; j < question.getIncorrect_answers().length; j++) {
                unescapedIncorrectAnswers[j] = StringEscapeUtils.unescapeHtml4(question.getIncorrect_answers()[j]);
            }
            question.setIncorrect_answers(unescapedIncorrectAnswers);
        }
    }

    // Encrypt questions from the quiz
    public void encryptQuestions(int shift){
        ArrayList<Question> encryptedQuestions = new ArrayList<>();
        for (int i = 0; i < questions.size(); i++) {
            Question encryptedQuestion = Encrypt.encryptQuestion(questions.get(i), shift);
            encryptedQuestions.add(encryptedQuestion);
        }
        this.questions = encryptedQuestions;
    }

    // Decrypt questions from the quiz
    public void decryptQuestions(int shift){
        ArrayList<Question> decryptedQuestions = new ArrayList<>();
        for (int i = 0; i < questions.size(); i++) {
            Question decryptedQuestion = Encrypt.decryptQuestion(questions.get(i), shift);
            decryptedQuestions.add(decryptedQuestion);
        }
        this.questions = decryptedQuestions;
    }
}
