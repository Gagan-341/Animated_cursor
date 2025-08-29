const { app, BrowserWindow, screen, ipcMain } = require('electron');

let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    fullscreen: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  win.webContents.once('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      const { ipcRenderer } = require('electron');
      const toggle = document.getElementById('toggle');
      
      toggle.addEventListener('mouseenter', () => {
        ipcRenderer.send('mouse-enter-toggle');
      });

      toggle.addEventListener('mouseleave', () => {
        ipcRenderer.send('mouse-leave-toggle');
      });
    `);
  });

  // By default, ignore mouse everywhere
  win.setIgnoreMouseEvents(true, { forward: true });
}

app.whenReady().then(createWindow);

ipcMain.on('mouse-enter-toggle', () => {
  win.setIgnoreMouseEvents(false);
});

ipcMain.on('mouse-leave-toggle', () => {
  win.setIgnoreMouseEvents(true, { forward: true });
});

// NEW — when toggle hides, ignore mouse everywhere
ipcMain.on('toggle-hidden', () => {
  win.setIgnoreMouseEvents(true, { forward: true });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

