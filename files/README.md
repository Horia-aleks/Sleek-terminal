# Sleek Terminal

A modern, sleek terminal emulator for macOS built with Electron and xterm.js.

## Features

✨ **Modern Design**
- Glassmorphism UI with blur effects
- Smooth animations and transitions
- Dark theme optimized for long coding sessions
- Native macOS window controls

🚀 **Powerful Terminal**
- Full shell integration (zsh, bash, fish)
- Multiple tabs support
- Clickable web links
- 10,000 lines scrollback buffer
- Custom color schemes

⌨️ **Keyboard Shortcuts**
- `Cmd+T` - New tab
- `Cmd+W` - Close tab
- `Cmd+K` - Clear terminal
- `Cmd+F` - Search (coming soon)
- `Cmd+D` - Split pane (coming soon)

## Installation

### Prerequisites
- Node.js 18+ and npm
- macOS 11.0+

### Setup

1. **Install dependencies:**
```bash
cd sleek-terminal
npm install
```

2. **Run the app:**
```bash
npm start
```

3. **Build standalone app (optional):**
```bash
npm run build
```

The `.app` bundle will be in the `dist` folder.

## Usage

### Running
```bash
npm start
```

### Development
- Press `Cmd+Option+I` to open DevTools
- Hot reload: restart the app after code changes

### Building for Distribution
```bash
npm run build
```

Creates a `.dmg` installer in the `dist/` folder.

## Customization

### Themes
Edit `renderer.js` to change the color scheme:

```javascript
theme: {
  background: 'transparent',
  foreground: '#e5e7eb',
  cursor: '#6366f1',
  // ... add your colors
}
```

### Font
Change font in `renderer.js`:

```javascript
fontFamily: '"Your Font", monospace',
fontSize: 14,
```

### Window Appearance
Modify `main.js` window options:

```javascript
new BrowserWindow({
  vibrancy: 'under-window', // macOS blur
  backgroundColor: '#00000000',
  // ... other options
})
```

## Architecture

- **main.js** - Electron main process, handles terminal backend (node-pty)
- **renderer.js** - Frontend logic, xterm.js integration
- **index.html** - UI structure
- **styles.css** - Modern styling with CSS variables

## Tech Stack

- **Electron** - Desktop app framework
- **xterm.js** - Terminal emulator component
- **node-pty** - Native terminal backend
- **Glassmorphism** - Modern UI design pattern

## Roadmap

- [ ] Split pane support
- [ ] Custom themes/profiles
- [ ] Search functionality
- [ ] Session restoration
- [ ] GPU acceleration
- [ ] Plugin system
- [ ] SSH integration
- [ ] Command palette

## Known Limitations

- Single terminal instance per tab (multi-terminal coming soon)
- No persistent history between sessions
- Settings stored in memory (not persistent yet)

## Troubleshooting

**Terminal not appearing:**
- Check DevTools console for errors
- Ensure node-pty installed correctly: `npm rebuild node-pty`

**Blurry text:**
- Adjust `devicePixelRatio` in renderer settings
- Try different font sizes (14-16px works best)

**Permission issues:**
- Grant Terminal app full disk access in System Preferences

## License

MIT License - feel free to modify and distribute!

## Credits

Built with:
- [Electron](https://www.electronjs.org/)
- [xterm.js](https://xtermjs.org/)
- [node-pty](https://github.com/microsoft/node-pty)

---

**Enjoy your sleek terminal experience! 🚀**
