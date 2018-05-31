
$(document).ready(function () {
    $('.sidenav').sidenav();
});

$(function () {
    $.ajax({
        url: '/mybooks',
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',
        data: JSON.stringify(),
        success: (data) => {
            console.log(data);

            for (let i = 0; i < data.length; i++) {
                if (data[i].interestedUsers.length > 0) {
                    console.log(data[i]._id)
                    document.getElementById('result').innerHTML += `
                    <div class="card col 6">
                    <span class="card-author author-user col s12">${data[i].interestedUsers[0]} is interested</span>
                    
                    <div class="card-image">
                      <img id='image' name='file' src="${data[i].BookThumbnail}">
                    </div>
                    <div class="card-content">
                    <span class="card-title">${data[i].BookTitle}</span>
                    </div>
                  </button>
                  </div>
                    `
                }
            }
        },
        error: (err) => {
            console.error(err);
        }
    });
});
