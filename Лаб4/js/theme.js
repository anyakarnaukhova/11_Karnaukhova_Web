document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️ Светлая тема';
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            themeToggle.textContent = '☀️ Светлая тема';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙 Тёмная тема';
            localStorage.setItem('theme', 'light');
        }
    });
});