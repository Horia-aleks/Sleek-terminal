const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const pty = require('node-pty');
const path = require('path');
const os = require('os');

let mainWindow;
let ptyProcess;
const shell = '/bin/zsh';
// Determine shell based on platform

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 600,
    minHeight: 400,
    titleBarStyle: 'hiddenInset', // macOS native title bar
    vibrancy: 'under-window', // macOS blur effect
    backgroundColor: '#00000000', // Transparent
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    frame: true,
    transparent: false,
    hasShadow: true
  });

  mainWindow.loadFile('index.html');

  // Inside createWindow(), after mainWindow.loadFile():
  mainWindow.webContents.on('before-input-event', (event, input) => {
  if (input.control && input.key.toLowerCase() === 'p') {
    event.preventDefault();
    mainWindow.webContents.send('clear-terminal');
    }
  });

  

  // Create application menu
  const template = [
    {
      label: 'Sleek Terminal',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

  



app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle terminal creation
ipcMain.on('create-terminal', (event) => {
  // Spawn terminal process
  ptyProcess = pty.spawn('/bin/zsh', [], {
  name: 'xterm-256color',
  cols: 80,
  rows: 30,
  cwd: os.homedir(),
  env: process.env
});

  // Send terminal output to renderer
  ptyProcess.onData((data) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('terminal-output', data);
  }
});

  // Send initial message
  event.sender.send('terminal-ready');
});

// Handle terminal input
ipcMain.on('terminal-input', (event, data) => {
  if (ptyProcess) {
    ptyProcess.write(data);
  }
});

// Handle terminal resize
ipcMain.on('terminal-resize', (event, cols, rows) => {
  if (ptyProcess) {
    ptyProcess.resize(cols, rows);
  }
});

// Cleanup on quit
app.on('before-quit', () => {
  if (ptyProcess) {
    ptyProcess.kill();
  }
});
