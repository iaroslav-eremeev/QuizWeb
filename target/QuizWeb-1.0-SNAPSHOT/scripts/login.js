$('#btn-go-to-sign-up').click(function () {
        $(location).attr('href', "http://localhost:8080/QuizWeb/registration.html");
    }
)


$('#btn-login').click(function () {
        $.ajax({
            url: 'login',
            method: "POST",
            data: {"login": $('#email').val(), "password": $('#password').val()},
            success: [function (result) {
                $(location).attr('href', "http://localhost:8080/QuizWeb/index.html");
            }],
            error: [function (result) {
                alert("Неверный логин или пароль!!!")
            }]
        })
    }
)