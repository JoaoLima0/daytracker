const electron = require('electron');

const { app, ipcMain } = electron;
const WindowManager = require('../ui/windowManager.js').getInstance();
const eventHandler = require('./eventHandler.js');
const phasher = require('../dao/PHasher.js');
 
//Event listener - cria a tela principal quando pronto
app.on('ready', () => {
  WindowManager.createWindow("main");
});




async function hashtests(){
  // var hashed1 = await phasher.hash("password123");
  // var hashed2 = await phasher.hash("password456");
  // var hashed3 = await phasher.hash("admin");
  // var hashed4 = await phasher.hash("test123");
  // console.log("Hashing: ");
  // console.log("password123: "+hashed1);
  // console.log("password456: "+hashed2);
  // console.log("admin: "+hashed3);
  // console.log("test123: "+hashed4);
}

//Event listeners - possibilitam que as páginas (.html) solicitem abrir ou fechar uma tela
// ipcMain.on('openWindow', (e, data) => {
//   WindowManager.createWindow(data.windowName);
// });
//
// ipcMain.on('closeWindow', (e, data) => {
//   // console.log("closeWindow: "+data.windowName);
//   WindowManager.closeWindow(data.windowName);
// });
