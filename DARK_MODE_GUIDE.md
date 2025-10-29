# BiteCount - Dark Mode & Enhanced UI Guide

## ✨ What's New

### 🌓 Dark/Light Mode Toggle
- **Automatic theme persistence** using localStorage
- **Smooth transitions** between themes
- **Toggle button** in all navbars (public, user, admin)
- **System-wide theme support** across all pages

### 🎨 Enhanced Dashboard UI
- **Advanced stats cards** with progress bars and trend indicators
- **Glassmorphism effects** for modern look
- **Animated progress indicators** with shimmer effects
- **Activity feed** with real-time updates
- **Improved charts** with better colors and tooltips
- **Quick action cards** with hover effects
- **Nutrition cards** with icons and better layout

## 📁 New Files Created

### CSS Files
1. **`/public/css/enhanced.css`** - Advanced UI components and dark mode styles
   - Theme toggle button styles
   - Enhanced card designs
   - Glassmorphism effects
   - Advanced stats grid
   - Activity feed components
   - Quick action cards
   - Form enhancements
   - Table improvements
   - Badges and indicators

### JavaScript Files
2. **`/public/js/theme.js`** - Theme management system
   - ThemeManager class
   - Auto-save theme preference
   - Toggle functionality
   - Icon updates

### Template Files
3. **`/views/user/dashboard-enhanced.ejs`** - New advanced dashboard
   - Enhanced stats with trends
   - Better activity feed
   - Improved charts
   - Modern card layouts

## 🎨 Color System

### Light Mode
- **Background Primary**: `#ffffff` (white)
- **Background Secondary**: `#f9fafb` (light gray)
- **Text Primary**: `#1f2937` (dark gray)
- **Text Secondary**: `#6b7280` (medium gray)
- **Border**: `#e5e7eb` (light border)

### Dark Mode
- **Background Primary**: `#1f2937` (dark gray)
- **Background Secondary**: `#111827` (darker gray)
- **Text Primary**: `#f9fafb` (white)
- **Text Secondary**: `#d1d5db` (light gray)
- **Border**: `#374151` (dark border)

### Accent Colors (Same in both modes)
- **Primary**: `#10b981` (green)
- **Secondary**: `#3b82f6` (blue)
- **Accent**: `#f59e0b` (orange)
- **Danger**: `#ef4444` (red)

## 🚀 How to Use

### Theme Toggle
The theme toggle button appears in all navbars:
- **Click** to switch between light and dark mode
- **Preference is saved** automatically
- **Persists** across page reloads and sessions

### Enhanced Dashboard
The new dashboard (`dashboard-enhanced.ejs`) includes:

1. **Advanced Stats Cards**
   - Calories consumed with progress bar
   - Calories burned with workout count
   - Net calories with status indicator
   - Streak with motivational messages

2. **Macronutrient Display**
   - Doughnut chart for visual representation
   - Individual cards for Protein, Carbs, Fats
   - Icons for each macro type

3. **Activity Feed**
   - Real-time activity timeline
   - Food and exercise logs combined
   - Sorted by time (most recent first)
   - Empty state when no activity

4. **Quick Actions**
   - Large, clickable cards
   - Gradient backgrounds
   - Hover animations
   - Direct links to key features

## 🎯 CSS Classes Reference

### Theme-Aware Components
All components automatically adapt to dark mode using CSS variables:

```css
/* Use these variables in your custom styles */
var(--bg-primary)      /* Main background */
var(--bg-secondary)    /* Secondary background */
var(--bg-tertiary)     /* Tertiary background */
var(--text-primary)    /* Main text color */
var(--text-secondary)  /* Secondary text */
var(--border-color)    /* Border color */
var(--shadow)          /* Box shadow */
```

### New Component Classes

#### Stats Cards
```html
<div class="stat-card-advanced">
  <div class="stat-header">
    <div class="stat-icon-advanced">...</div>
    <div class="stat-trend">...</div>
  </div>
  <div class="stat-label-advanced">...</div>
  <div class="stat-value-large">...</div>
  <div class="stat-progress">...</div>
</div>
```

#### Activity Feed
```html
<div class="activity-feed">
  <div class="activity-item-advanced">
    <div class="activity-icon-wrapper">...</div>
    <div class="activity-details-advanced">...</div>
    <div class="activity-time-advanced">...</div>
  </div>
</div>
```

#### Quick Actions
```html
<div class="quick-actions-advanced">
  <a href="#" class="action-card-advanced">
    <div class="action-icon">...</div>
    <h3>...</h3>
    <p>...</p>
  </a>
</div>
```

#### Badges
```html
<div class="badge-advanced badge-success">Success</div>
<div class="badge-advanced badge-warning">Warning</div>
<div class="badge-advanced badge-danger">Danger</div>
<div class="badge-advanced badge-info">Info</div>
```

## 🔧 Customization

### Changing Theme Colors
Edit `/public/css/style.css` and `/public/css/enhanced.css`:

```css
:root {
  --primary-color: #10b981;  /* Change primary color */
  --secondary-color: #3b82f6; /* Change secondary color */
}

[data-theme="dark"] {
  --bg-primary: #1f2937;  /* Change dark mode background */
}
```

### Adding New Components
1. Use CSS variables for colors
2. Add transition properties for smooth theme switching
3. Test in both light and dark modes

### Custom Gradients
```css
--gradient-primary: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
--gradient-secondary: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
--gradient-accent: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
```

## 📱 Responsive Design

All enhanced components are fully responsive:
- **Desktop**: Full grid layouts
- **Tablet**: Adjusted columns
- **Mobile**: Single column, stacked layout

Breakpoints:
- **1024px**: Tablet adjustments
- **768px**: Mobile layout

## 🎭 Animations

### Shimmer Effect
Progress bars include an animated shimmer effect:
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### Hover Effects
- Cards lift on hover (`translateY(-8px)`)
- Shadows intensify
- Borders change color
- Smooth transitions

## 🐛 Troubleshooting

### Theme Not Persisting
- Check browser localStorage is enabled
- Clear cache and reload
- Ensure `/js/theme.js` is loaded

### Dark Mode Colors Wrong
- Verify CSS files are loaded in correct order:
  1. `style.css`
  2. `enhanced.css`
- Check `data-theme` attribute on `<html>` element

### Charts Not Visible in Dark Mode
- Chart.js uses default colors
- Update chart options with theme-aware colors
- Use CSS variables in chart configurations

## 🚀 Future Enhancements

Potential improvements:
- [ ] Auto dark mode based on system preference
- [ ] Custom theme builder
- [ ] More color schemes
- [ ] Accessibility improvements
- [ ] High contrast mode
- [ ] Animation preferences

## 📝 Notes

- All existing pages work with dark mode
- No breaking changes to existing functionality
- Enhanced dashboard is opt-in (can revert to old dashboard)
- Theme preference is user-specific (localStorage)
- Works across all browsers (modern browsers)

---

**Enjoy your new dark mode and enhanced UI!** 🌙✨
