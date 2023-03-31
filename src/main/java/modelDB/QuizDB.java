package modelDB;

import lombok.*;
import util.Difficulty;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "quizzes")
@Data
@NoArgsConstructor (force = true)
public class QuizDB {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "number_of_questions", nullable = false)
    private int numberOfQuestions;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "difficulty", nullable = false)
    private Difficulty difficulty;

    @Column(name = "successRate", nullable = false)
    private double successRate;

    @Column(name = "date", nullable = false)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserDB user;
}
