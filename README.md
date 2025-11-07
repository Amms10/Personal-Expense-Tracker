# 💰 Personal Expense Manager - Mobile PWA

A comprehensive Progressive Web App (PWA) for tracking expenses, managing budgets, and achieving savings goals. Works offline and can be installed on mobile devices like a native app.

## ✨ Features

### 📱 Mobile-First Design
- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Works without internet connection
- **Responsive**: Optimized for all screen sizes
- **Touch-Friendly**: Large touch targets and smooth interactions

### 💰 Expense Management
- **Quick Add**: Fast expense entry from dashboard
- **Categories**: Organize expenses by type (Food, Transport, Shopping, etc.)
- **Multi-Currency**: Support for 10+ currencies with auto-conversion
- **Receipt Photos**: Attach photos to expenses
- **Bulk Operations**: Select and delete multiple expenses

### 📊 Budget & Analytics
- **Budget Tracking**: Set monthly budgets by category
- **Visual Analytics**: Charts and graphs for spending patterns
- **Insights**: AI-powered spending insights
- **Trend Analysis**: Track spending over time

### 🎯 Savings Goals
- **Goal Setting**: Create and track savings targets
- **Progress Tracking**: Visual progress bars
- **Deadline Management**: Set target dates for goals
- **Categories**: Vacation, Emergency, Gadgets, etc.

### 🔄 Advanced Features
- **Recurring Expenses**: Auto-add monthly bills
- **Data Export/Import**: CSV and JSON support
- **Dark Mode**: Eye-friendly dark theme
- **Security**: Optional password protection
- **Keyboard Shortcuts**: Power user features

## 🚀 Installation

### Option 1: Install as PWA (Recommended)
1. Open the app in your mobile browser
2. Look for the "Install App" button or browser prompt
3. Tap "Add to Home Screen" or "Install"
4. The app will appear on your home screen like a native app

### Option 2: Local Development
1. Clone or download this repository
2. Open `index.html` in a web browser
3. For full PWA features, serve over HTTPS or localhost

## 📱 Mobile Installation Guide

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Customize the name and tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home screen"
4. Confirm by tapping "Add"

### Android (Other Browsers)
1. Look for "Install" or "Add to Home Screen" option
2. Follow browser-specific prompts

## 🛠️ Setup Instructions

### 1. Generate Icons
1. Open `generate-icons.html` in your browser
2. Click "Generate All Icons"
3. Download each icon with the exact filename shown
4. Place all icons in the `icons/` folder

### 2. Customize
- Edit `manifest.json` to change app name, colors, etc.
- Modify `styles.css` for custom themes
- Update `script.js` for additional features

### 3. Deploy
- Upload all files to your web server
- Ensure HTTPS is enabled for full PWA features
- Test installation on various devices

## 💡 Usage Tips

### Keyboard Shortcuts
- `Ctrl+N` - Add new expense
- `Ctrl+D` - Toggle dark/light mode
- `Esc` - Close modals

### Offline Usage
- Add expenses while offline
- Data syncs automatically when back online
- All features work without internet

### Data Management
- Export data regularly as backup
- Use CSV export for spreadsheet analysis
- Import data from other expense apps

## 🔧 Technical Details

### PWA Features
- **Service Worker**: Enables offline functionality
- **Web App Manifest**: Defines app metadata
- **Responsive Design**: Works on all screen sizes
- **Touch Gestures**: Optimized for mobile interaction

### Browser Support
- **Chrome/Edge**: Full PWA support
- **Safari**: Install via Add to Home Screen
- **Firefox**: Basic PWA support
- **Samsung Internet**: Full support

### Storage
- **Local Storage**: All data stored locally
- **No Server Required**: Fully client-side
- **Privacy First**: Your data never leaves your device

## 🎨 Customization

### Themes
The app supports light and dark themes. You can customize colors in `styles.css`:

```css
:root {
    --primary-color: #36454f;    /* Main brand color */
    --secondary-color: #c0c0c0;  /* Secondary color */
    --success-color: #39ff14;    /* Success messages */
    --error-color: #ff4444;      /* Error messages */
}
```

### Categories
Add new expense categories in `script.js`:

```javascript
const categories = {
    newCategory: '🆕 New Category Name'
};
```

## 📊 Data Format

### Export Format (JSON)
```json
{
    "expenses": [...],
    "budgets": {...},
    "savingsGoals": [...],
    "recurringExpenses": [...],
    "exportDate": "2024-01-01T00:00:00.000Z",
    "version": "1.0"
}
```

## 🔒 Privacy & Security

- **Local Storage Only**: No data sent to external servers
- **Optional Password**: Secure your data with a password
- **No Tracking**: No analytics or tracking scripts
- **Open Source**: Full transparency of code

## 🐛 Troubleshooting

### Installation Issues
- Ensure you're using HTTPS or localhost
- Clear browser cache and try again
- Check if browser supports PWAs

### Offline Issues
- Verify service worker is registered
- Check browser developer tools for errors
- Ensure sufficient storage space

### Performance Issues
- Clear old cached data
- Reduce number of stored photos
- Export and archive old expenses

## 🤝 Contributing

This is an open-source project. Feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For support and questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Test in different browsers
4. Ensure all files are properly uploaded

---

**Enjoy managing your expenses with this powerful PWA! 💰📱**