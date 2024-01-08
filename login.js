
function login() {
    var uname = document.getElementById('user').value;
    var password = document.getElementById('pass').value;
    if (uname == "Aditya" && password == 'adi2002') {
        alert('Successfully Verified');
        $('.input-submit').on('click', function(event) {
            event.preventDefault(); 
            var url = $(this).data('target');
            location.replace('https://stackoverflow.com/questions/2238368/how-to-make-a-button-redirect-to-another-page-using-jquery-or-just-javascript');
        });
        return true;
    } else {
        alert('Enter Your Details');
        
        return false;
    }
}

var showPasswordIcon = document.getElementById('show-password');
var passwordField = document.getElementById('pass');

showPasswordIcon.addEventListener('click', function () {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
    // Add blinking class to the icon for animation
    showPasswordIcon.classList.add('blinking');

    // Remove blinking class after 1 second (1000 milliseconds)
    setTimeout(function() {
        showPasswordIcon.classList.remove('blinking');
    }, 1000);
});

$("document").ready(function(){
    $(".input-submit").click(function(){

        login();
    })

})