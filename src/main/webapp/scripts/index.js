function load() {
    {
        $.ajax({
            url: 'login',
            method: "GET",
            success: [function (users_from_server) {
                let html_table = "";
                for (let i = 0; i < users_from_server.length; i++) {
                    let user = users_from_server[i];
                    html_table += "<tr>";
                    html_table += `<td><b>${user.id}</b></td>`;
                    html_table += `<td>${user.login}</td>`;
                    html_table += `<td><button class="btn btn-danger" id = "delete-${user.id}">Delete</button></td>`;
                    html_table += "</tr>";
                }
                $('#table-users tbody').html(html_table)
            }],
            error: [function () {
                alert("error!!!")
            }]
        })
    }
}

load();

$('#table-users').on('click', 'button', function () {
    let id = $(this).attr('id');
    $.ajax({
        url: `login?id=${id}`,
        type: "DELETE",
        success: [function () {
            load();
        }],
        error: [function () {
            alert("error!")
        }]
    })
})



