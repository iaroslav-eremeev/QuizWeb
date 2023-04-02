$('#btn-from-internet').click(function() {
    // Check if the checkbox is checked
    var showCorrectAnswers = $('#showCorrectAnswers').prop('checked');
    // Store the checkbox state in local storage
    localStorage.setItem('showCorrectAnswers', showCorrectAnswers);
    // Redirect to loading.html
    window.location.href = 'loading.html';
});
