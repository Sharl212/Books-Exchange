function logout() {
    console.log('fired');
    $.ajax({
        url: "/logout",
        type: 'delete',
        dataType: 'json',
        contentType: 'application/json',
        success: function (user) {
            // console.log(user);
            window.location = '/';
        },
        error: function (err, status, xhr) {
            console.log(err);
        }
    });
};