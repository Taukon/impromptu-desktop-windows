import { BrowserWindow, desktopCapturer, ipcMain } from "electron";
import { CLICheck, CLIOption } from "../../util/type";

export const setInterfaceModeHandler = (
  mainWindow: BrowserWindow,
  option: CLIOption | undefined,
) => {
  if (option != undefined) {
    mainWindow.hide();
  }

  ipcMain.handle("Interface", async (): Promise<CLICheck | undefined> => {
    if (option?.host) {
      const sources = await desktopCapturer.getSources({
        types: ["screen"],
      });
      const sourceId = sources[0].id;

      return {
        host: {
          audio: option.host.audio,
          sourceId: sourceId,
        },
        filePath: option.filePath,
        password: option.password,
        proxyId: option.proxyId,
        proxyPassword: option.proxyPassword,
      };
    } else if (option?.filePath) {
      return {
        filePath: option.filePath,
        password: option.password,
        proxyId: option.proxyId,
        proxyPassword: option.proxyPassword,
      };
    }

    return undefined;
  });

  ipcMain.handle(
    "message",
    async (
      event: Electron.IpcMainInvokeEvent,
      message: string,
    ): Promise<void> => {
      console.log(message);
    },
  );
};

export const checkCLI = (): CLIOption | undefined => {
  // password
  let password: string | undefined;
  const passwordIndex = process.argv.indexOf(`-password`);
  if (passwordIndex != -1 && passwordIndex + 1 <= process.argv.length) {
    password = process.argv[passwordIndex + 1];
  }

  // file share
  let filePath: string | undefined;
  const fileIndex = process.argv.indexOf(`-file`);
  if (fileIndex != -1 && fileIndex + 1 <= process.argv.length) {
    filePath = process.argv[fileIndex + 1];
  }

  // automation proxyID
  let proxyId: string | undefined;
  const proxyIdIndex = process.argv.indexOf(`-proxyId`);
  if (proxyIdIndex != -1 && proxyIdIndex + 1 <= process.argv.length) {
    proxyId = process.argv[proxyIdIndex + 1];
  }

  // automation proxy password
  let proxyPassword: string | undefined;
  const proxyPasswordIndex = process.argv.indexOf(`-proxyPwd`);
  if (
    proxyPasswordIndex != -1 &&
    proxyPasswordIndex + 1 <= process.argv.length
  ) {
    proxyPassword = process.argv[proxyPasswordIndex + 1];
  }

  if (process.argv.indexOf(`-host`) != -1) {
    // audio
    let audio = false;
    const audioIndex = process.argv.indexOf(`-audio`);
    if (audioIndex != -1) {
      audio = true;
    }

    // password
    if (password) {
      const option: CLIOption = {
        host: {
          audio,
        },
        filePath,
        password,
        proxyId,
        proxyPassword,
      };
      return option;
    } else {
      return undefined;
    }
  }

  // password
  if (filePath && password) {
    const option: CLIOption = {
      filePath,
      password,
      proxyId,
      proxyPassword,
    };
    return option;
  }

  return undefined;
};
