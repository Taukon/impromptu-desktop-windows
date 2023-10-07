import { desktopCapturer, ipcMain } from "electron";
import { ControlData, DisplayInfo, KeyJson } from "../../../util/type";
import { winSimulator } from "./win32/win32lib";
import { keySymToWin32Key } from "./win32/convertKey";

export const setShareAppIpcHandler = (): void => {
  ipcMain.handle(
    "getDisplayInfo",
    async (event: Electron.IpcMainInvokeEvent, isDisplay: boolean) => {
      const sources = await desktopCapturer.getSources({
        types: isDisplay ? ["screen"] : ["window"],
      });
      const info: DisplayInfo[] = [];
      if (isDisplay) {
        info.push({ name: sources[0].name, id: sources[0].id });
      } else {
        for (const source of sources) {
          info.push({ name: source.name, id: source.id });
        }
      }

      return info;
    },
  );

  ipcMain.handle(
    "control",
    (
      event: Electron.IpcMainInvokeEvent,
      windowId: number,
      data: ControlData,
    ) => {
      if (
        data.move?.x != undefined &&
        data.move?.y != undefined &&
        data.move.cw != undefined &&
        data.move.ch != undefined
      ) {
        try {
          // console.log("try: "+data.move.x +" :"+ data.move.y);
          winSimulator.motionEvent(
            data.move.x,
            data.move.y,
            data.move.cw,
            data.move.ch,
            windowId,
          );
        } catch (error) {
          console.error(error);
        }
      } else if (
        data.button?.buttonMask != undefined &&
        data.button.down != undefined
      ) {
        try {
          // console.log("try: " + data.button.buttonMask + " : " + data.button.down);
          winSimulator.buttonEvent(data.button.buttonMask, data.button.down);
        } catch (error) {
          console.error(error);
        }
      } else if (data.key?.down != undefined) {
        try {
          const key = keySymToWin32Key(data as KeyJson);
          if (key) {
            winSimulator.keyEvent(key.code, key.down);
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
  );

  ipcMain.handle(
    "controlWID",
    (
      event: Electron.IpcMainInvokeEvent,
      windowId: number,
      data: ControlData,
    ) => {
      // console.log(`windowId ${windowId}`);
      if (
        data.move?.x != undefined &&
        data.move?.y != undefined &&
        data.move.cw != undefined &&
        data.move.ch != undefined
      ) {
        try {
          // console.log("try: "+data.move.x +" :"+ data.move.y);
          winSimulator.motionEventWID(
            data.move.x,
            data.move.y,
            data.move.cw,
            data.move.ch,
            windowId,
          );
        } catch (error) {
          console.error(error);
        }
      } else if (
        data.button?.buttonMask != undefined &&
        data.button.down != undefined
      ) {
        try {
          // console.log("try: " + data.button.buttonMask + " : " + data.button.down);
          winSimulator.buttonEvent(data.button.buttonMask, data.button.down);
        } catch (error) {
          console.error(error);
        }
      } else if (data.key?.down != undefined) {
        try {
          const key = keySymToWin32Key(data as KeyJson);
          if (key) {
            // console.log(`keyCode: ${keyCode}`);
            winSimulator.keyEvent(key.code, key.down);
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
  );
};
