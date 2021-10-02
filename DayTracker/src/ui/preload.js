const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "ipcHandler", {
        send: (channel, data) => {
            /*
            // whitelist channels
            let validChannels = ["openWindow"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
            */
            ipcRenderer.send(channel, data);
        },
        on: (channel, func) => {
            /*
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
            */
            // ipcRenderer.on(channel, (event, ...args) => func(...args));
            ipcRenderer.on(channel, func);
        }
    }
);
