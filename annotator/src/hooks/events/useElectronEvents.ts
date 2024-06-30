import { useEffect } from "react";
import { ipcRenderer } from "electron";

function useElectronEvents<T>(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: T[]) => void) {
  useEffect(() => {
    ipcRenderer.on(channel, listener);

    return () => {
      ipcRenderer.removeListener(channel, listener);
    };
  }, [channel, listener]);
}

export default useElectronEvents;
