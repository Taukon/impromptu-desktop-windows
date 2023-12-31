import { ipcRenderer } from "electron";
import { ControlData, DisplayInfo } from "../util/type";

export const shareApp = {
  requestScreenFrame: async (ms: number): Promise<void> => {
    await ipcRenderer.invoke("requestScreenFrame", ms);
  },
  sendScreenFrame: (listener: () => void) => {
    ipcRenderer.on("sendScreenFrame", () => listener());
  },
  getDisplayInfo: async (isDisplay: boolean): Promise<DisplayInfo[]> => {
    return await ipcRenderer.invoke("getDisplayInfo", isDisplay);
  },
  control: async (windowId: number, data: ControlData): Promise<void> => {
    await ipcRenderer.invoke("control", windowId, data);
  },
  controlWID: async (windowId: number, data: ControlData): Promise<void> => {
    await ipcRenderer.invoke("controlWID", windowId, data);
  },
};
