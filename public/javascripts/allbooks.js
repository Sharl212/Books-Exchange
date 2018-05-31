$(document).ready(function () {
    $('.sidenav').sidenav();
});


$(function () {
    $.ajax({
        url: '/allbooks',
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',
        data: JSON.stringify(),
        success: (data) => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
            document.getElementById('result').innerHTML += `
                <div class="card col 6">
                <span class="card-author author-user col s12">Added by: ${data[i]._creator.username}</span>
                
                <div class="card-image">
                  <img id='image' name='file' src="${data[i].BookThumbnail}">
                </div>
                <div class="card-content">
                <span class="card-title">${data[i].BookTitle}</span>
                </div>
                <form class='interested'>
                <input type='text' class='bookId' value='${data[i]._id}'/>
                <button class="btn waves-effect waves-light" type="submit" name="action">Interested
                <i class="material-icons right">send</i>
                </form>
              </button>
              </div>
                `
                $('.interested').submit((e) => {
                    e.preventDefault();

                    let id = e.target[0].value; // book id value.
                    console.log(id);
                    interestedToExchange(id);
                });
            }
        },
        error: (err) => {
            console.error(err);
        }
    });
});

function interestedToExchange(id) {
    $.ajax({
        url: '/exchange/' + id,
        dataType: 'json',
        type: 'patch',
        contentType: 'application/json',
        data: JSON.stringify(),
        success: (data) => {
            console.log(data);
            // window.location.reload();
        },
        error: (err) => {
            console.error(err);
        }
    });
}