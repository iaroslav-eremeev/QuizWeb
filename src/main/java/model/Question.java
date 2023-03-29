package model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @OneToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @Column(name = "type")
    private String type;
    @Column(name = "difficulty", nullable = false)
    private Difficulty difficulty;
    @Column(name = "question", nullable = false)
    private String question;
    @Column(name = "correct_answer", nullable = false)
    private String correct_answer;
    @ElementCollection(targetClass = String.class)
    @CollectionTable(name = "incorrect_answers", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "answer")
    @NonNull
    private List<String> incorrectAnswers;
}
