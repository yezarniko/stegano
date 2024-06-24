export interface IElectronAPI {
  runPython: (script: Array<string>) => Promise<void>
  onPythonResponse: (callback: (response: string) => void) => Promise<Electron.IpcRenderer>
  saveFile: (filename: string) => Promise<void>
}

declare global {
  interface Window {
    context: IElectronAPI
  }
}
