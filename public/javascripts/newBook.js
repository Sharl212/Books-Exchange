$(document).ready(function () {
    $('.sidenav').sidenav();
});


$(function () {
    $('.form').on('submit', (e) => {
        e.preventDefault()
        $.ajax({
            url: '/books',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                name: $('#first_name').val()
            }),
            success: (data) => {
                $('#first_name').val("");
                    document.getElementById('result').innerHTML += `
                    <div class="card col 3">
                    <span class="card-author col s12">Author: ${data.author}</span>

                    <div class="card-image">
                      <img id='image' name='file' src="${data.thumbnail}">
                    </div>
                    <div class="card-content">
                    <span class="card-title">${data.title}</span>                
                    </div>
                  </div>
                `
            },
            error: (err) => {
                window.location = '/login';
                console.error(err);
            }
        });
    });
})