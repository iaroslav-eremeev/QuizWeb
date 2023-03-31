package servlets;

import DAO.DAO;
import com.google.gson.Gson;
import modelDB.UserDB;
import util.Encrypt;
import util.Unicode;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/login")
public class UserServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Unicode.setUnicode(req, resp);
        String login = req.getParameter("login");
        String password = req.getParameter("password");
        if (login != null && password != null) {
            try {
                UserDB user = (UserDB) DAO.getObjectByParams(new String[]{"login", "password"}, new Object[]{login, password}, UserDB.class);
                DAO.closeOpenedSession();
                if (user != null) {
                    String hash = Encrypt.generateHash();
                    user.setHash(hash);
                    DAO.updateObject(user);
                    if (hash != null) {
                        Cookie cookie = new Cookie("hash", hash);
                        cookie.setMaxAge(30 * 60);
                        cookie.setPath("/");

                        resp.addCookie(cookie);
                    } else {
                        throw new Exception();
                    }
                }
                else{
                    resp.setStatus(400);
                    resp.getWriter().print("incorrect login or password");
                }
            } catch (Exception e) {
                resp.setStatus(400);
                resp.getWriter().println(e.getMessage());
            }
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Unicode.setUnicode(req, resp);
        resp.setContentType("application/json");
        try {
            resp.getWriter().write(new Gson().toJson(DAO.getAllObjects(UserDB.class)));
        } catch (Exception e) {
            resp.setStatus(200);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Unicode.setUnicode(req, resp);
        String id = req.getParameter("id");
        if (id != null) {
            try {
                DAO.deleteObjectById(Math.toIntExact(Long.parseLong(id)), UserDB.class);
            } catch (Exception e) {
                resp.setStatus(200);
            }
        }
    }
}
