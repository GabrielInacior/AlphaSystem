import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { initDB, createTables, checkAndUpdateDatabase } from './database'
import { electronApp, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Database } from 'sqlite3'
import { registerIpcHandlers } from './ipcHandlers'

let db: Database

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    fullscreen: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.openDevTools();

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Aqui você escuta o evento para fechar a janela
  ipcMain.on('close-window', () => {
    mainWindow.close() // Fecha a janela quando o evento é disparado
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  db = initDB() // Inicia o banco de dados
  createTables(db) // Cria as tabelas, caso não existam
  checkAndUpdateDatabase(db) // Verifica e atualiza a estrutura do banco de dados

  registerIpcHandlers(db) // Registra os IPC handlers

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.close() // Fecha o banco de dados corretamente ao fechar o app
    app.quit()
  }
})
