const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  installUpdate: (url) => ipcRenderer.invoke('install-update', url),
  showSaveDialog: (options) => ipcRenderer.invoke('save-file-dialog', options),
  writeFileBuffer: (data) => ipcRenderer.invoke('write-file-buffer', data),
  exportPdfNative: (data) => ipcRenderer.invoke('export-pdf-native', data),
  getInstallerUsername: () => ipcRenderer.invoke('get-installer-username'),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  readFileAsBuffer: (filePath) => ipcRenderer.invoke('read-file-as-buffer', filePath),
  getPendingFile: () => ipcRenderer.invoke('get-pending-file'),
  onUpdateProgress: (callback) => {
    const handler = (_event, data) => callback(data)
    ipcRenderer.on('update-progress', handler)
    return () => ipcRenderer.removeListener('update-progress', handler)
  },
  onOpenFileFromSystem: (callback) => {
    const handler = (_event, filePath) => callback(filePath)
    ipcRenderer.on('open-file-from-system', handler)
    return () => ipcRenderer.removeListener('open-file-from-system', handler)
  },
})
