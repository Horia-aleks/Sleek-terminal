const { ipcRenderer } = require('electron');
const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');
const { WebLinksAddon } = require('xterm-addon-web-links');
const { SearchAddon } = require('xterm-addon-search');

// Initialize terminal
const term = new Terminal({
  cursorBlink: true,
  cursorStyle: 'block',
  fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Cascadia Code", "Consolas", monospace',
  fontSize: 14,
  lineHeight: 1.4,
  letterSpacing: 0.5,
  theme: {
    background: 'transparent',
    foreground: '#e5e7eb',
    cursor: '#6366f1',
    cursorAccent: '#1a1a2e',
    selectionBackground: '#6366f144',
    black: '#1a1a2e',
    red: '#ef4444',
    green: '#10b981',
    yellow: '#f59e0b',
    blue: '#3b82f6',
    magenta: '#a855f7',
    cyan: '#06b6d4',
    white: '#e5e7eb',
    brightBlack: '#4b5563',
    brightRed: '#f87171',
    brightGreen: '#34d399',
    brightYellow: '#fbbf24',
    brightBlue: '#60a5fa',
    brightMagenta: '#c084fc',
    brightCyan: '#22d3ee',
    brightWhite: '#f9fafb'
  },
  scrollback: 10000,
  allowTransparency: true,
  minimumContrastRatio: 4.5
});

// Add addons
const fitAddon = new FitAddon();
const webLinksAddon = new WebLinksAddon();
const searchAddon = new SearchAddon();

term.loadAddon(fitAddon);
term.loadAddon(webLinksAddon);
term.loadAddon(searchAddon);

// Open terminal in DOM
term.open(document.getElementById('terminal'));

// Fit terminal to container
fitAddon.fit();

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    fitAddon.fit();
    const dims = term.getDimensions();
    if (dims) {
      ipcRenderer.send('terminal-resize', term.cols, term.rows);
      updateDimensions(term.cols, term.rows);
    }
  }, 100);
});

// Create terminal backend
ipcRenderer.send('create-terminal');

// Handle terminal ready
ipcRenderer.on('terminal-ready', () => {
  term.focus();
  
  // Send initial resize
  const dims = term.getDimensions();
  if (dims) {
    ipcRenderer.send('terminal-resize', term.cols, term.rows);
    updateDimensions(term.cols, term.rows);
  }
});

// Handle terminal output
ipcRenderer.on('terminal-output', (event, data) => {
  term.write(data);
});

// Handle terminal input
term.onData((data) => {
  ipcRenderer.send('terminal-input', data);
});

// Update dimensions display
function updateDimensions(cols, rows) {
  const dimensionsEl = document.getElementById('dimensions');
  if (dimensionsEl) {
    dimensionsEl.textContent = `${cols}×${rows}`;
  }
}

// Button handlers
document.getElementById('new-tab').addEventListener('click', () => {
  // TODO: Implement tab creation
  console.log('New tab clicked');
});

document.getElementById('split-pane').addEventListener('click', () => {
  // TODO: Implement pane splitting
  console.log('Split pane clicked');
});

document.getElementById('settings').addEventListener('click', () => {
  // TODO: Implement settings panel
  console.log('Settings clicked');
});

// Tab management
const tabBar = document.querySelector('.tab-bar');
let tabCounter = 1;

document.querySelector('.tab-new').addEventListener('click', () => {
  tabCounter++;
  const newTab = document.createElement('div');
  newTab.className = 'tab';
  newTab.dataset.tab = tabCounter;
  newTab.innerHTML = `
    <span class="tab-title">zsh ${tabCounter}</span>
    <button class="tab-close">×</button>
  `;
  
  // Remove active class from all tabs
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  
  // Add active class to new tab
  newTab.classList.add('active');
  
  // Insert before the new tab button
  tabBar.insertBefore(newTab, document.querySelector('.tab-new'));
  
  // Add close handler
  newTab.querySelector('.tab-close').addEventListener('click', (e) => {
    e.stopPropagation();
    if (document.querySelectorAll('.tab').length > 1) {
      newTab.remove();
    }
  });
  
  // Add click handler
  newTab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    newTab.classList.add('active');
  });
});

// Handle tab close
document.querySelectorAll('.tab-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (document.querySelectorAll('.tab').length > 1) {
      btn.closest('.tab').remove();
    }
  });
});

// Handle tab switch
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Cmd+T: New tab
  if (e.metaKey && e.key === 't') {
    e.preventDefault();
    document.querySelector('.tab-new').click();
  }
  
  // Cmd+W: Close tab
  if (e.metaKey && e.key === 'w') {
    e.preventDefault();
    const activeTab = document.querySelector('.tab.active');
    if (activeTab && document.querySelectorAll('.tab').length > 1) {
      activeTab.querySelector('.tab-close').click();
    }
  }
  
  // Cmd+F: Search
  if (e.metaKey && e.key === 'f') {
    e.preventDefault();
    // TODO: Implement search UI
    console.log('Search triggered');
  }
  
  // Cmd+K: Clear from cursor to end of line
if (e.ctrlKey && e.key === 'k') {
  e.preventDefault();
  ipcRenderer.send('terminal-input', String.fromCharCode(11));
}
});
// Focus terminal on load
setTimeout(() => {
  term.focus();
}, 100);
