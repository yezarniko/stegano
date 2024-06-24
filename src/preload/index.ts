import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    runPython: (script) => ipcRenderer.send('runPython', script),
    onPythonResponse: (callback) => ipcRenderer.on('python-response', (_, arg) => callback(arg)),
    saveFile: (filename) => ipcRenderer.send('saveFile', filename)
  })
} catch (err) {
  console.log('🚀 ~ file: index.ts:12 ~ err:', err)
}
