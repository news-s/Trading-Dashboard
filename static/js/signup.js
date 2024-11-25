document.addEventListener("DOMContentLoaded", function(){
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    let password = document.querySelector('input[name="password"]').value;
    let repeatedPassword = document.querySelector('input[name="repeted_password"]').value;
    let username = document.querySelector('input[name="username"]').value; // Assuming there's an input for username
    
    if (password !== repeatedPassword) {
        alert('Passwords do not match!');
        document.querySelector('input[name="password"]').value = "";
        document.querySelector('input[name="repeted_password"]').value = "";
        document.querySelector('input[name="username"]').value = "";
    } else {
        fetch('/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password: password})
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == 'ok') {
                alert('Signup successful!');
                window.location.href = '/login'; // Redirect to login page
            }
            else if (data.status == 'repeated') {
                alert('Username already exists!');
                document.querySelector('input[name="username"]').value = "";
            } 
            else {
                alert('Signup failed: ' + data.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    }
})});
