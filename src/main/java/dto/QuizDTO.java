package dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import modelDB.Category;
import modelDB.Difficulty;

import java.util.Date;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {
    private int id;
    private int numberOfQuestions;
    private Category category;
    private Difficulty difficulty;
    private List<QuestionDTO> questions;
    private Date date;
    private int userId;
}