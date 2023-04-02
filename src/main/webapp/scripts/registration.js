$('#btn-go-login').click(function () {
        $(location).attr('href', "http://localhost:8080/QuizWeb/login.html");
    }
)


$('#btn-sign-up').click(function () {
        $.ajax({
            url: 'registration',
            method: "POST",
            data: {"login" : $('#login').val(), "password" : $('#password').val()},
            success: [function (data) {
                $('.popup-fade').fadeIn();
                // Generate a random decryptKey and store it in local storage
                var decryptKey = Math.floor(Math.random() * 9) + 1;
                localStorage.setItem('decryptKey', decryptKey);
            }],
            error: [function () {
                alert("This login is already taken!");
            }]
        })
    }
)

$('#btn-ok').click(function () {
    $('.popup-fade').fadeOut();
    $(location).attr('href', "http://localhost:8080/QuizWeb/login.html");
})