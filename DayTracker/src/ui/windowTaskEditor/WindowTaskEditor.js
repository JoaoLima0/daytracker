const WindowModel = require('../WindowModel.js');

const { ipcMain } = require('electron');
const path = require('path');

const daoHandler = require('../../dao/DayTrackerDAOHandler.js').getInstance();

class WindowTaskEditor extends WindowModel {

  constructor() {
    super('windowTaskEditor/windowTaskEditor.html', {
      height: 600,
      width: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, "..", "preload.js")
      }
    });


    //Listener para receber solicitação de saveTask da página e encaminhá-la para o DAOHandler
    // ipcMain.on('windowTaskEditor:saveTask', (e, data) => {
    //   daoHandler.saveTask(data, () => {
    //     this.window.webContents.send('saveTask:success')
    //   }, () => {
    //     this.window.webContents.send('saveTask:failed')
    //   })
    // });
  }

}

module.exports = WindowTaskEditor;
