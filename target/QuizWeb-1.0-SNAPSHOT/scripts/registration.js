$('#btn-go-login').click(function () {
        $(location).attr('href', "http://localhost:8080/QuizWeb/login.html");
    }
)


$('#btn-sign-up').click(function () {
        $.ajax({
            url: 'reg',
            method: "POST",
            data: {"login" : $('#email').val(), "password" : $('#password').val()},
            success: [function (data) {
                $('.popup-fade').fadeIn();
            }],
            error: [function () {
                alert("Пользователь с таким логином уже зарегистрирован!!!")
            }]
        })
    }
)

$('#btn-ok').click(function () {
    $('.popup-fade').fadeOut();
    $(location).attr('href', "http://localhost:8080/QuizWeb/login.html");
})