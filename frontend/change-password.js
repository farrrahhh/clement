document.getElementById('changePasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const username = localStorage.getItem('username');

    if (newPassword !== confirmPassword) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = 'New passwords do not match.';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, currentPassword, newPassword })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Password changed successfully.');
            window.location.href = 'http://127.0.0.1:5500/profile.html';
        } else {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = result.message || 'Failed to change password.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});