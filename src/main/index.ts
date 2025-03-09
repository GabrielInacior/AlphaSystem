/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { initDB, createTables, queryDatabase } from './database' // Importação da função queryDatabase
import { electronApp, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Database } from 'sqlite3' // Importando o tipo Database do sqlite3

let db: Database // Tipando a variável db

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// IPC handler para consulta ao banco de dados
ipcMain.handle('query-database', async (_event, query: string, params: any[]) => {
  try {
    return await queryDatabase(db, query, params) // Executando a query no banco
  } catch (error) {
    console.error('Erro ao consultar o banco:', error)
    throw error
  }
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  db = initDB() // Inicia o banco de dados
  createTables(db) // Cria as tabelas, caso não existam

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
