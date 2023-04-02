package servlets;

import DAO.DAO;
import com.google.gson.Gson;
import model.Quiz;
import model.User;
import util.Difficulty;
import util.Unicode;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/quiz")
public class QuizServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Unicode.setUnicode(req, resp);
        String numberOfQuestionsStr = req.getParameter("numberOfQuestions");
        String category = req.getParameter("category");
        String difficulty = req.getParameter("difficulty");
        String successRateStr = req.getParameter("successRate");
        String userIdStr = req.getParameter("userId");
        if (numberOfQuestionsStr != null && category != null && difficulty != null
                && successRateStr != null && userIdStr != null) {
            int numberOfQuestions = Integer.parseInt(numberOfQuestionsStr);
            double successRate = Double.parseDouble(successRateStr);
            User user = (User) DAO.getObjectById(Integer.parseInt(userIdStr), User.class);
            try {
                Quiz quiz = new Quiz();
                quiz.setNumberOfQuestions(numberOfQuestions);
                quiz.setCategory(category);
                quiz.setDifficulty(Difficulty.valueOf(difficulty));
                quiz.setSuccessRate(successRate);
                quiz.setUser(user);
                DAO.addObject(quiz);
                resp.setStatus(200);
            } catch (Exception e) {
                resp.setStatus(400);
                resp.getWriter().println(e.getMessage());
            }
        } else {
            resp.setStatus(400);
            resp.getWriter().println("Missing parameters");
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Unicode.setUnicode(req, resp);
        String userId = req.getParameter("user_id");
        if (userId != null) {
            try {
                List<Quiz> quizzes = DAO.getObjectsByParam("user.id", Long.parseLong(userId), Quiz.class);
                resp.setContentType("application/json");
                resp.getWriter().write(new Gson().toJson(quizzes));
            } catch (Exception e) {
                resp.setStatus(400);
                resp.getWriter().println(e.getMessage());
            }
        }
    }
}
