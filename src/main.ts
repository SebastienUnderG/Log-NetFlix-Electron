// Modules to control application life and create native browser window
import {app, BrowserWindow, ipcMain, Menu, MessageChannelMain} from 'electron';
import {GetIP} from '../../Export-Log-NetFlix-Chrome/src/getIP';
import {Appdata} from '../../Export-Log-NetFlix-Chrome/src/appdata';
import {ConfigFile} from '../../Export-Log-NetFlix-Chrome/src/configFile';
import {IoJson} from '../../Export-Log-NetFlix-Chrome/src/ioJson';
import {Cloud} from '../../Export-Log-NetFlix-Chrome/src/cloud';
import {each} from 'async';

let path = require('path');
let mainWindow: Electron.BrowserWindow = undefined;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 1000,
        minWidth: 500,
        minHeight: 100,
        maxWidth: 1200,
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

ipcMain.handle('checkFormatsInterface', async (event: Electron.IpcMainInvokeEvent, url) => {

    return IoJson.loadURL(url).then((file: any) => {
        GetIP.checkFormatsInterface(file[0],
            null,
            () => {
                console.log("GEO");
                thisAppdata.get(GetIP.checkFormatsInterface(file[0]))
                    .then((fileLocal: any) => {
                        console.log("->", Object.keys(fileLocal).length, Object.keys(file[0]).length);
                    }).catch((e) => {
                    console.error("-> ERREUR", Object.keys(file[0]).length);
                });
            },
            null,
            null,
            null,
            null
        );

        return GetIP.checkFormatsInterface(file[0]);
    });
});

ipcMain.handle('appdata', async (event: Electron.IpcMainInvokeEvent) => {
    return thisAppdata.pathAppData;
});

ipcMain.handle('pathAppData', async (event: Electron.IpcMainInvokeEvent) => {
    return IoJson.listUrlFromDirLength(thisAppdata.pathAppData + '/data/').then((files: Record<string, number>) => {
        console.log('pathAppData', files);
        return files;

    });
});

const thisAppdata: Appdata = new Appdata(app);
let config: ConfigFile;
thisAppdata.getConfig().then((configThen) => {
    config = configThen;
});

ipcMain.handle('config', async (event: Electron.IpcMainInvokeEvent) => {
    return thisAppdata.getConfig();
});

// const cloud: Cloud = new Cloud();
let cloud: Cloud = null;

ipcMain.handle('majCloud', async (event: Electron.IpcMainInvokeEvent, bouton) => {
    console.log("BOUTON MAIN", bouton, cloud);
    if (!cloud && config.serviceAccount) {
        cloud = new Cloud(config.serviceAccount);
        IoJson.listUrlFromDir(thisAppdata.pathAppData + '/data/')
            .then((files: string[]) => {
                if (files.length > 0) {
                    return true;
                }
            });
    }
    if (cloud && bouton) {
        console.log("BOUTON MAIN");
        IoJson.listUrlFromDir(thisAppdata.pathAppData + '/data/')
            .then((files: string[]) => {
                // console.log('pathAppData', files);
                each(files, (url) => {
                    cloud.getDocument('ip', url).then((document: { id: any; data: () => any; }) => {
                        const data: any = document.data();
                        console.log('getDocument', data);
                        if (data) {
                            IoJson.saveFile(IoJson.resolvePath(
                                    thisAppdata.pathAppData + '/data/' + url),
                                JSON.stringify(document)
                            ).then(() => {
                                console.log('OK');
                                return true;
                            });
                        }
                    });
                });
            });
    }

    // return false;
});

ipcMain.handle('actionBtn', async (event: Electron.IpcMainInvokeEvent, url: string) => {
    return IoJson.loadURL(url).then((file: any) => {
        return GetIP.checkFormatsInterface(file[0],
            () => {
                console.log("netflix");
                config.directoryOrFilePath = thisAppdata.pathAppData + '/data/';
                GetIP.getIP(file[0],
                    config.directoryOrFilePath,
                    config); // them

                config.lastExecution = new Date();
                return thisAppdata.setConfig(config).then((configThen) => {
                    mainWindow.webContents.send('updateAppData');
                    return true;
                });

            },
            () => {
                console.log("GEO");
                return thisAppdata.set(GetIP.checkFormatsInterface(file[0]), file[0], 'data')
                    .then(() => {
                        console.log("GEO OK");
                        // Update
                        return true;
                    });
            },
            null, null, null, null,
            () => {
                console.log("CONFIG");
                config.serviceAccount = file[0];
                return thisAppdata.setConfig(config).then((configThen) => {
                    return true;
                });
            },
        );
    });
});


console.log('PRET');