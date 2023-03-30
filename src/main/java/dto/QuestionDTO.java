package dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import model.Difficulty;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class QuestionDTO {
    private int id;
    private CategoryDTO category;
    private String type;
    private Difficulty difficulty;
    private String question;
    private String correct_answer;
    @NonNull
    private List<String> incorrectAnswers;
    private QuizDTO quiz;

    public QuestionDTO(int id, CategoryDTO category, String type, Difficulty difficulty, String question, String correct_answer, List<String> incorrectAnswers, QuizDTO quiz) {
        this.id = id;
        this.category = category;
        this.type = type;
        this.difficulty = difficulty;
        this.question = question;
        this.correct_answer = correct_answer;
        this.incorrectAnswers = incorrectAnswers;
        this.quiz = quiz;
    }
}
