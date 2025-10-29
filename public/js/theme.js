// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.setupToggle();
    }

    applyTheme(theme, withTransition = false) {
        const html = document.documentElement;
        
        // Add transition class if toggling manually
        if (withTransition) {
            html.classList.add('theme-transitioning');
        }
        
        html.setAttribute('data-theme', theme);
        html.style.backgroundColor = theme === 'dark' ? '#111827' : '#ffffff';
        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.updateToggleIcon();
        
        // Remove transition class after animation
        if (withTransition) {
            setTimeout(() => {
                html.classList.remove('theme-transitioning');
            }, 300);
        }
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme, true); // Enable transition for manual toggle
        // Dispatch event for charts to update
        window.dispatchEvent(new Event('themeChanged'));
    }

    setupToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    updateToggleIcon() {
        const icon = document.querySelector('.theme-toggle-slider i');
        if (icon) {
            icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});
