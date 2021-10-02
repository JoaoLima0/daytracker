const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

class WindowModel {

  constructor(filePath, params) {
    this.window = new BrowserWindow(params);

    this.window.loadURL(url.format({
        pathname: path.join(__dirname, filePath),
        protocol: 'file:',
        slashes: true
    }));

    this.window.on('close', () => {
      this.window = null;
    });
  }

}

module.exports = WindowModel;
