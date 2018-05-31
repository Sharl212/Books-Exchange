$(document).ready(() => {
    $.ajax({
        url: "/auth",
        type: 'get',
        contentType: 'application/json',
        data: JSON.stringify(),
        success: function (user) {
            let username = user.username;

            let Authenticated = [
                'register',
                'login',
                'signup-banner'
            ];

            removeElement(Authenticated);
            authenticatedUser(username);
        },
        error: function (err, status, xhr) {
            let unAuthenticated = [
                'mybooks',
                'newbook',
                'logout',
                'interested'
            ]

            removeElement(unAuthenticated);
            console.log(err);
        }
    });
});

function removeElement(element) {
    console.log(element[0]);
    for (let i = 0; i <= element.length; i++) {
        $(`.${element[i]}`).remove();
    };
};

function authenticatedUser(username) {
    let banner = document.getElementById('username');
    if (banner) { banner.innerHTML = `<h2 class='welcome'><span class='username'> Welcome, ${username}!</span><br/> Here's some books that you might be interested in</h2>` };

    banner = `<h2 class='welcome'><span class='username'> Welcome, ${username}!</span><br/> Here's some books that you might be interested in</h2>`;
    document.getElementById('username-nav').innerHTML = `<a class='nav-username' href='#'>${username}</a>`;
    document.getElementById('username-sidebar').innerHTML = `<a class='nav-username' href='#'>${username}</a>`;
}