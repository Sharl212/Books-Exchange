console.log('Connected..');

$(document).ready(function () {
    $('.sidenav').sidenav();
});

$(function () {
    $('.register').submit(function (e) {
        e.preventDefault(e);
        $.ajax({
            url: "/register",
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                username: $('#Username').val(),
                password: $('#password').val()
            }),
            success: function (user) {
                console.log(user);
                window.location = '/';
            },
            error: function (err, status, xhr) {
                console.log(err);
            }
        });
    });
});

$(function () {
    $('.login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "/login",
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                username: $('#Username').val(),
                password: $('#password').val()
            }),
            success: function (user) {
                console.log(user);
                window.location = '/';
            },
            error: function (err, status, xhr) {
                console.log(err);
            }
        });
    });
});
