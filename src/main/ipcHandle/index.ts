import { BrowserWindow, ipcMain } from "electron";
import { setShareFileIpcHandler } from "./shareFile";
import { setShareAppIpcHandler } from "./shareApp";
import { setInterfaceModeHandler } from "./interface";
import { CLIOption } from "../../util/type";

export const initIpcHandler = (
  mainWindow: BrowserWindow,
  cli: CLIOption | undefined,
): void => {
  setInterfaceModeHandler(mainWindow, cli);

  setShareAppIpcHandler();
  setShareFileIpcHandler(mainWindow);

  ipcMain.handle("getBasePath", () => {
    return `${__dirname}`;
  });
};
