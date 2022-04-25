const { app, desktopCapturer, ipcMain } = require('electron');
const path = require('path');
const { mouse, Point } = require('@nut-tree/nut-js');

app.whenReady().then(() => {
    const { BrowserWindow } = require('electron');

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, "preload.js") // use a preload script
        }
    });

    win.loadFile('index.html');

    win.webContents.on('did-finish-load', () => {
        desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
            for (const source of sources) {
                if (source.name === 'Screen 1') {
                    win.webContents.send('SET_SOURCE', {sourceId: source.id, sources: sources});
                    return
                }
            }
        })    
    })

    setTimeout(() => {
        mouse.setPosition(new Point(100, 100));
    }, 5000);

})

ipcMain.on('log', (event, message) => console.log(message));