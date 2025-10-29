// Water Intake Tracker
class WaterIntakeTracker {
    constructor() {
        this.glasses = 0;
        this.target = 16; // 8 full glasses = 16 half glasses
        this.init();
    }

    async init() {
        await this.loadData();
        this.render();
        this.attachEventListeners();
    }

    async loadData() {
        try {
            const response = await fetch('/user/water-intake');
            const data = await response.json();
            this.glasses = data.glasses;
            this.target = data.target;
        } catch (error) {
            console.error('Error loading water intake:', error);
        }
    }

    async addWater(amount) {
        try {
            const response = await fetch('/user/water-intake/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount })
            });

            const data = await response.json();
            
            if (data.success) {
                this.glasses = data.glasses;
                this.render();
                
                // Show achievement notification if goal reached
                if (data.percentage >= 100) {
                    this.showNotification('🎉 Daily water goal achieved!');
                }
            }
        } catch (error) {
            console.error('Error adding water:', error);
        }
    }

    async reset() {
        if (!confirm('Reset today\'s water intake?')) return;
        
        try {
            const response = await fetch('/user/water-intake/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                this.glasses = 0;
                this.render();
            }
        } catch (error) {
            console.error('Error resetting water:', error);
        }
    }

    render() {
        const container = document.getElementById('waterIntakeWidget');
        if (!container) return;

        const percentage = Math.min((this.glasses / this.target) * 100, 100);
        const fullGlasses = Math.floor(this.glasses / 2);
        const hasHalfGlass = this.glasses % 2 === 1;

        let glassesHTML = '';
        for (let i = 0; i < 8; i++) {
            if (i < fullGlasses) {
                glassesHTML += '<div class="water-glass full" data-index="' + i + '"><i class="fas fa-glass-water"></i></div>';
            } else if (i === fullGlasses && hasHalfGlass) {
                glassesHTML += '<div class="water-glass half" data-index="' + i + '"><i class="fas fa-glass-water-droplet"></i></div>';
            } else {
                glassesHTML += '<div class="water-glass empty" data-index="' + i + '"><i class="fas fa-glass-water"></i></div>';
            }
        }

        container.innerHTML = `
            <div class="water-header">
                <h3><i class="fas fa-droplet"></i> Water Intake</h3>
                <button class="btn-icon" onclick="waterTracker.reset()" title="Reset">
                    <i class="fas fa-rotate-right"></i>
                </button>
            </div>
            <div class="water-progress">
                <div class="water-progress-bar">
                    <div class="water-progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="water-progress-text">${fullGlasses + (hasHalfGlass ? 0.5 : 0)} / 8 glasses</div>
            </div>
            <div class="water-glasses-grid">
                ${glassesHTML}
            </div>
            <div class="water-actions">
                <button class="btn-water half" onclick="waterTracker.addWater(0.5)">
                    <i class="fas fa-glass-water-droplet"></i> Half Glass
                </button>
                <button class="btn-water full" onclick="waterTracker.addWater(1)">
                    <i class="fas fa-glass-water"></i> Full Glass
                </button>
            </div>
        `;
    }

    attachEventListeners() {
        // Click on glass to add water
        document.addEventListener('click', (e) => {
            const glass = e.target.closest('.water-glass.empty, .water-glass.half');
            if (glass) {
                const index = parseInt(glass.dataset.index);
                const currentFull = Math.floor(this.glasses / 2);
                
                if (index === currentFull) {
                    // Add half or full glass
                    const isHalf = this.glasses % 2 === 1;
                    this.addWater(isHalf ? 0.5 : 1);
                }
            }
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'water-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize water tracker
let waterTracker;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('waterIntakeWidget')) {
        waterTracker = new WaterIntakeTracker();
    }
});
