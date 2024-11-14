document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('username').textContent = username;
    } else {
        window.location.href = 'login.html'; // Redirect to login if not logged in
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('username');
        window.location.href = '/index.html'; // Redirect to home page after logout
    });

    document.getElementById('change-pass').addEventListener('click', () => {
        window.location.href = 'change-password.html'; // Redirect to home page after logout
    });
});