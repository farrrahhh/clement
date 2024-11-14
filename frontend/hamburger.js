function toggleNav() {
    const nav = document.querySelector('nav');
    const hamburger = document.querySelectorAll('.hamburger i');
    nav.classList.toggle('active');
    hamburger.forEach(icon => {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}