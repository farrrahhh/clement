document.addEventListener('DOMContentLoaded', () => {
    const profileIcon = document.getElementById('profile-icon');
    const loginLink = document.getElementById('login-link');
    const loginButton = document.getElementById('login-button');

    // Check if the user is logged in
    const username = localStorage.getItem('username');

    if (username) {
        // User is logged in
        profileIcon.style.display = 'block';
        if (loginLink) {
            loginLink.style.display = 'none';
        }
        if (loginButton) {
            loginButton.style.display = 'none';
        }
    } else {
        // User is not logged in
        profileIcon.style.display = 'none';
        if (loginLink) {
            loginLink.style.display = 'block';
        }
        if (loginButton) {
            loginButton.style.display = 'block';
        }
    }
});


