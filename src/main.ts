// Modules to control application life and create native browser window
import {app, BrowserWindow, ipcMain, Menu} from 'electron';
import {GetIP} from '../../Export-Log-NetFlix-Chrome/src/getIP';
import {Appdata} from '../../Export-Log-NetFlix-Chrome/src/appdata';

let path = require('path');

// const root = path.resolve(__dirname, '../');

function createWindow() {
    // Create the browser window.

    const mainWindow = new BrowserWindow({
        width: 700,
        height: 700,
        minWidth: 500,
        minHeight: 100,
        maxWidth: 700,
        maxHeight: 1000,
        icon: path.join(__dirname, '../icons/icon128.png'),
        frame: false,
        // titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');
    mainWindow.focus();

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

Menu.setApplicationMenu(null);

ipcMain.on('listurl', (event) => {
    const port = event.ports[0];


    port.on('message', (event) => {
        const data = event.data
        console.log(data);
        setTimeout(() => {
            port.postMessage({test: 21})
        }, 1000);
    })

    // MessagePortMain queues messages until the .start() method has been called.
    port.start()
});


ipcMain.handle('checkFormatsInterface', async (event: Electron.IpcMainInvokeEvent, url) => {
    return GetIP.loadURL(url).then((file: any) => {
        return GetIP.checkFormatsInterface(file[0]);
    })
})



const thisAppdata: Appdata = new Appdata(app);

thisAppdata.getConfig().then((config) => {
    
});

console.log('PRET');


