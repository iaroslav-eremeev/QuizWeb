package model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @OneToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @Column(name = "type", nullable = true)
    @NonNull
    private String type;
    @Column(name = "difficulty", nullable = false)
    @NonNull
    private Difficulty difficulty;
    @Column(name = "question", nullable = false)
    @NonNull
    private String question;
    @Column(name = "correct_answer", nullable = false)
    @NonNull
    private String correct_answer;
    @Column(name = "incorrect_answers", nullable = false)
    @ElementCollection(targetClass = String.class)
    @NonNull
    private List<String> incorrectAnswers;

    public Question(Category category, String type, Difficulty difficulty, String question,
                    String correct_answer, List<String> incorrect_answers) {
        this.category = category;
        this.type = type;
        this.difficulty = difficulty;
        this.question = question;
        this.correct_answer = correct_answer;
        this.incorrect_answers = incorrect_answers;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getCorrect_answer() {
        return correct_answer;
    }

    public void setCorrect_answer(String correct_answer) {
        this.correct_answer = correct_answer;
    }

    public String[] getIncorrect_answers() {
        return incorrect_answers;
    }

    public void setIncorrect_answers(String[] incorrect_answers) {
        this.incorrect_answers = incorrect_answers;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Question question1 = (Question) o;
        return Objects.equals(category, question1.category) && Objects.equals(type, question1.type) && difficulty == question1.difficulty && Objects.equals(question, question1.question) && Objects.equals(correct_answer, question1.correct_answer) && Arrays.equals(incorrect_answers, question1.incorrect_answers);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(category, type, difficulty, question, correct_answer);
        result = 31 * result + Arrays.hashCode(incorrect_answers);
        return result;
    }

    @Override
    public String toString() {
        return "Question{" +
                "category=" + category +
                ", type='" + type + '\'' +
                ", difficulty=" + difficulty +
                ", question='" + question + '\'' +
                ", correct_answer='" + correct_answer + '\'' +
                ", incorrect_answers=" + Arrays.toString(incorrect_answers) +
                '}';
    }
}
