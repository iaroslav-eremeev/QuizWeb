package servlets;

import DAO.DAO;
import com.google.gson.Gson;
import modelDB.QuizDB;
import modelDB.UserDB;
import util.Difficulty;
import util.Unicode;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
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
            UserDB userDB = (UserDB) DAO.getObjectById(Integer.parseInt(userIdStr), UserDB.class);
            try {
                QuizDB quizDB = new QuizDB();
                quizDB.setNumberOfQuestions(numberOfQuestions);
                quizDB.setCategory(category);
                quizDB.setDifficulty(Difficulty.valueOf(difficulty));
                quizDB.setSuccessRate(successRate);
                quizDB.setUser(userDB);
                DAO.addObject(quizDB);
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
                List<QuizDB> quizzes = DAO.getObjectsByParam("user.id", Long.parseLong(userId), QuizDB.class);
                resp.setContentType("application/json");
                resp.getWriter().write(new Gson().toJson(quizzes));
            } catch (Exception e) {
                resp.setStatus(400);
                resp.getWriter().println(e.getMessage());
            }
        }
    }
}
