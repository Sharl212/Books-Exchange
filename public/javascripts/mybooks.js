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

            if (data.length > 0) {

                for (let i = 0; i < data.length; i++) {
                    document.getElementById('result').innerHTML += `
                 <div class="card col 6">
                   <form class='deleteBook'>
                    <input type='text' class='bookId' value='${data[i]._id}'>
                    <button type='submit' id='deletebutton'><i class="small material-icons">delete_forever</i></button>
                    </form>
                    
                    <div class="card-image">
                      <img id='image' name='file' src="${data[i].BookThumbnail}">
                    </div>
                    <div class="card-content">
                      <span class="card-title">${data[i].BookTitle}</span>               
                    </div>
                  </div>
                    `
                };

                $('.deleteBook').submit((e) => {
                    e.preventDefault();

                    let id = e.target[0].value; // book id value.
                    console.log(id);
                    PopUp(id);
                });

            } else {
                document.getElementById('result').innerHTML = "<h4>you dont have any books yet.<br/> <a href='/newbook'>add a book</a></h4>";
            }
        },
        error: (err) => {
            window.location = '/login';
            console.error(err);
        }
    });
});


function PopUp(id) { // asks whether the user is sure to procceed this action.

    document.getElementById('dialog-confirm').innerHTML = '<p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>This book will be permanently deleted from your collection, Are you sure? </p>';

    $("#dialog-confirm").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Delete": function () {
                DeleteBookById(id);
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
};

function DeleteBookById(id) {
    $.ajax({
        url: '/deletebook/' + id,
        dataType: 'json',
        type: 'delete',
        contentType: 'application/json',
        data: JSON.stringify(),
        success: (data) => {
            console.log(data)
            window.location.reload();
        },
        error: (err) => {
            console.error(err);
        }
    });
};