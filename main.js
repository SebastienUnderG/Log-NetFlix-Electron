// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const {fork} = require("child_process");

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 700,
        height: 700,
        minWidth: 200,
        minHeight: 100,
        maxWidth: 1000,
        maxHeight: 1000,

        /*
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }*/
    });

    // and load the index.html of the app.
    // mainWindow.loadFile('index.html');
    mainWindow.loadURL('http://localhost:3000/');
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

// Menu.setApplicationMenu(null);


// -----------------------------------------------------------------
// const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const appExpress = express();
const port = 3000;

const root = path.resolve(__dirname, '../')

appExpress.use(bodyParser.json({limit: '10mb'}));
appExpress.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));


appExpress.get('/', (req, res) => {
    // res.send('Hello World!' + path.join(__dirname,  'index.html');
    // res.sendFile(path.join(root + '/index.html'));
    res.sendFile(path.join(__dirname, 'index.html'));
    // res.sendFile('index.html');
});


appExpress.get('/dist/index_packed.js.map', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index_packed.js.map'));
});

appExpress.get('/dist/index_packed.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index_packed.js'));
});

appExpress.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

appExpress.get('/bulma.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'bulma.css'));
});

appExpress.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// import { deserialize } from 'bson';
const BSON = require('bson');
appExpress.post('/', function (req, res) {
    response = {
        body: req.body,
    };
    // BSON.deserialize(req.body)
    console.log("response", req.body.length);
    res.send(response);
    // res.end(JSON.stringify(response));
    // return res.send('User has been added successfully');
})

console.log("PRET");
// ------

