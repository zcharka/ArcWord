const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

let mainWindow = null
let pendingFilePath = null

function extractFileArg(argv) {
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i]
    if (arg && !arg.startsWith('-') && !arg.startsWith('--') && (arg.endsWith('.docx') || arg.endsWith('.doc') || arg.endsWith('.html') || arg.endsWith('.htm') || arg.endsWith('.txt'))) {
      return arg
    }
  }
  return null
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 840,
    minWidth: 980,
    minHeight: 640,
    frame: false,
    backgroundColor: '#1f1f1f',
    icon: path.join(__dirname, '../public/favicon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  Menu.setApplicationMenu(null)

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Handle window states
  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize()
  })

  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
    }
  })

  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close()
  })

  ipcMain.handle('window-is-maximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false
  })

  ipcMain.handle('install-update', async (event, downloadUrl) => {
    try {
      if (!downloadUrl) throw new Error('Brak adresu URL do pobrania aktualizacji.')

      const tempDir = app.getPath('temp')
      const tempFilePath = path.join(tempDir, 'ArcWord-Setup-Update.exe')

      const response = await fetch(downloadUrl, { redirect: 'follow' })
      if (!response.ok) {
        throw new Error(`Błąd pobierania pliku: ${response.status} ${response.statusText}`)
      }

      const totalBytes = Number(response.headers.get('content-length')) || 0
      let receivedBytes = 0

      const fileStream = fs.createWriteStream(tempFilePath)
      const reader = response.body.getReader()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        receivedBytes += value.length
        fileStream.write(Buffer.from(value))

        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('update-progress', {
            percent: totalBytes > 0 ? Math.round((receivedBytes / totalBytes) * 100) : 0,
            transferred: receivedBytes,
            total: totalBytes,
            status: 'downloading',
          })
        }
      }

      await new Promise((resolve, reject) => {
        fileStream.end((err) => {
          if (err) reject(err)
          else resolve()
        })
      })

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('update-progress', {
          percent: 100,
          transferred: receivedBytes,
          total: totalBytes,
          status: 'installing',
        })
      }

      setTimeout(() => {
        const child = spawn(tempFilePath, ['/SILENT'], {
          detached: true,
          stdio: 'ignore',
        })
        child.unref()
        app.quit()
      }, 1500)

      return { success: true }
    } catch (err) {
      console.error('Update error:', err)
      return { success: false, error: err.message || String(err) }
    }
  })

  ipcMain.handle('save-file-dialog', async (event, options = {}) => {
    try {
      const result = await dialog.showSaveDialog(mainWindow, {
        title: options.title || 'Zapisz jako',
        defaultPath: options.defaultPath || 'Dokument1.docx',
        filters: options.filters || [
          { name: 'Dokument programu Word (*.docx)', extensions: ['docx'] },
          { name: 'Dokument PDF (*.pdf)', extensions: ['pdf'] },
          { name: 'Wszystkie pliki (*.*)', extensions: ['*'] },
        ],
      })
      return result
    } catch (err) {
      console.error('Save dialog error:', err)
      return { canceled: true, error: err.message }
    }
  })

  ipcMain.handle('write-file-buffer', async (event, { filePath, buffer }) => {
    try {
      if (!filePath) throw new Error('Brak ścieżki do zapisu')
      fs.writeFileSync(filePath, Buffer.from(buffer))
      return { success: true }
    } catch (err) {
      console.error('Write file error:', err)
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('export-pdf-native', async (event, { filePath }) => {
    try {
      if (!mainWindow) throw new Error('Brak okna')
      const pdfData = await mainWindow.webContents.printToPDF({
        marginsType: 0,
        printBackground: true,
        pageSize: 'A4',
      })
      fs.writeFileSync(filePath, pdfData)
      return { success: true }
    } catch (err) {
      console.error('PDF export error:', err)
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('get-installer-username', async () => {
    try {
      // 1. Check user_config.json in app dir or exe dir
      const appDirPath = path.dirname(app.getPath('exe'))
      const candidates = [
        path.join(appDirPath, 'user_config.json'),
        path.join(app.getAppPath(), 'user_config.json'),
        path.join(app.getPath('userData'), 'user_config.json'),
      ]
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          const content = fs.readFileSync(p, 'utf8')
          const parsed = JSON.parse(content)
          if (parsed.userName && parsed.userName.trim()) {
            return parsed.userName.trim()
          }
        }
      }
    } catch (e) {
      console.warn('Error reading user config:', e)
    }

    return process.env.USERNAME || ''
  })

  // Native open dialog
  ipcMain.handle('show-open-dialog', async (event, options = {}) => {
    try {
      const result = await dialog.showOpenDialog(mainWindow, {
        title: options.title || 'Otwórz dokument',
        filters: options.filters || [
          { name: 'Dokument programu Word (*.docx;*.doc)', extensions: ['docx', 'doc'] },
          { name: 'Pliki tekstowe (*.txt)', extensions: ['txt'] },
          { name: 'Pliki HTML (*.html;*.htm)', extensions: ['html', 'htm'] },
          { name: 'Wszystkie pliki (*.*)', extensions: ['*'] },
        ],
        properties: ['openFile'],
      })
      return result
    } catch (err) {
      console.error('Open dialog error:', err)
      return { canceled: true, error: err.message }
    }
  })

  // Read file as buffer (for docx import)
  ipcMain.handle('read-file-as-buffer', async (event, filePath) => {
    try {
      const buf = fs.readFileSync(filePath)
      return { success: true, buffer: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), fileName: path.basename(filePath) }
    } catch (err) {
      console.error('Read file error:', err)
      return { success: false, error: err.message }
    }
  })

  // Send pending file path to renderer once it's ready
  ipcMain.handle('get-pending-file', () => {
    const fp = pendingFilePath
    pendingFilePath = null
    return fp
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, argv) => {
    const filePath = extractFileArg(argv)
    if (filePath && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('open-file-from-system', filePath)
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // Check for file path in initial launch args
  pendingFilePath = extractFileArg(process.argv)

  app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
