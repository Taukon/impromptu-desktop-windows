import { Socket, io } from "socket.io-client";
import { initShareFile, initShareHostApp, setAuth } from "./desktop";
import { signalingAddress } from "./config";
import { CLICheck } from "../util/type";

let mode = true;

const signalingInfo: HTMLDivElement = <HTMLDivElement>(
  document.getElementById("signalingInfo")
);
const desktopOption: HTMLDivElement = <HTMLDivElement>(
  document.getElementById("desktopOption")
);
const screen = document.getElementById("screen");

const signalingConnect = () => {
  // password
  const pwdForm = document.createElement("p");
  signalingInfo.appendChild(pwdForm);
  pwdForm.appendChild(document.createTextNode(" password: "));
  const inputPwd = document.createElement("input");
  inputPwd.value = "impromptu";
  pwdForm.appendChild(inputPwd);

  const connect = document.createElement("button");
  signalingInfo.appendChild(connect);
  connect.textContent = "connect";
  connect.onclick = async () => {
    connect.disabled = true;

    //
    const socket = io(signalingAddress, {
      secure: true,
      rejectUnauthorized: false,
    });
    //

    socket.once("desktopId", async (msg) => {
      if (typeof msg === "string") {
        const desktopId = msg;
        setAuth(msg, socket, inputPwd.value);

        // show desktopId
        const idInfo = document.createElement("p");
        signalingInfo.appendChild(idInfo);
        idInfo.textContent = `Desktop ID: ${msg}`;

        // fileShare
        setFileShare(desktopOption, desktopId, socket);

        // screen mode
        const modeForm = document.createElement("p");
        desktopOption.append(modeForm);
        const screenMode = document.createElement("button");
        modeForm.appendChild(screenMode);
        screenMode.textContent = "Screen Mode";

        screenMode.onclick = async () => {
          mode = !mode;
          if (mode) {
            screenMode.disabled = true;
            await userMediaMode(desktopOption, screenMode, desktopId, socket);
            screenMode.disabled = false;
          } else {
            screenMode.disabled = true;
            // xvfbMode(desktopOption, screenMode, desktopId, socket);
            screenMode.disabled = false;
          }
        };

        if (mode) {
          screenMode.disabled = true;
          userMediaMode(desktopOption, screenMode, desktopId, socket).then(
            () => {
              screenMode.disabled = false;
            },
          );
        } else {
          screenMode.disabled = true;
          // xvfbMode(desktopOption, screenMode, desktopId, socket);
          screenMode.disabled = false;
        }
      }
    });
  };
};

const userMediaMode = async (
  parentNode: HTMLDivElement,
  screenMode: HTMLButtonElement,
  desktopId: string,
  socket: Socket,
) => {
  (<HTMLDivElement>document.getElementById("userMediaOption"))?.remove();
  (<HTMLDivElement>document.getElementById("xvfbOption"))?.remove();
  const userMediaOption = document.createElement("div");
  userMediaOption.id = "userMediaOption";
  parentNode.append(userMediaOption);

  // audio
  const audioForm = document.createElement("p");
  audioForm.textContent = "audio enable: ";
  userMediaOption.appendChild(audioForm);
  const audio = document.createElement("input");
  audio.setAttribute("type", "radio");
  audioForm.appendChild(audio);

  // onControlDisplay
  const controlForm = document.createElement("p");
  controlForm.textContent = "control from this window: ";
  userMediaOption.appendChild(controlForm);
  const control = document.createElement("input");
  control.setAttribute("type", "radio");
  controlForm.appendChild(control);

  // use dataChannel
  const dataChannelForm = document.createElement("p");
  dataChannelForm.textContent = "use dataChannel: ";
  userMediaOption.appendChild(dataChannelForm);
  const dataChannel = document.createElement("input");
  dataChannel.setAttribute("type", "radio");
  dataChannelForm.appendChild(dataChannel);

  // screen
  const screenForm = document.createElement("p");

  const screenInfo = await window.shareApp.getDisplayInfo(true);
  for (const item of screenInfo) {
    const button = document.createElement("button");
    button.textContent = `${item.name} | ${item.id}`;
    button.addEventListener("click", async () => {
      screenMode.disabled = true;
      if (
        await startUserMedia(
          desktopId,
          socket,
          item.id,
          true,
          audio.checked,
          dataChannel.checked,
          control.checked,
        )
      ) {
        userMediaOption.remove();
      } else {
        screenMode.disabled = false;
      }
    });
    screenForm.appendChild(button);
    screenForm.appendChild(document.createElement("br"));
  }

  const windowInfo = await window.shareApp.getDisplayInfo(false);
  for (const item of windowInfo) {
    const button = document.createElement("button");
    button.textContent = `${item.name} | ${item.id}`;
    button.addEventListener("click", async () => {
      screenMode.disabled = true;
      if (
        await startUserMedia(
          desktopId,
          socket,
          item.id,
          false,
          audio.checked,
          dataChannel.checked,
          control.checked,
        )
      ) {
        userMediaOption.remove();
      } else {
        screenMode.disabled = false;
      }
    });
    screenForm.appendChild(button);
    screenForm.appendChild(document.createElement("br"));
  }
  userMediaOption.appendChild(screenForm);
};

const startUserMedia = async (
  desktopId: string | undefined,
  socket: Socket | undefined,
  sourceId: string,
  isDisplay: boolean,
  audio: boolean,
  useScreenChannel: boolean,
  onControlDisplay: boolean,
): Promise<boolean> => {
  if (desktopId && socket) {
    try {
      const shareHostApp = await initShareHostApp(
        desktopId,
        socket,
        sourceId,
        isDisplay,
        useScreenChannel,
        onControlDisplay,
        audio,
      );
      if (onControlDisplay && shareHostApp) {
        screen?.appendChild(shareHostApp.screen);
      }
      return shareHostApp ? true : false;
    } catch (error) {
      if (audio) {
        console.log(`maybe not support audio...`);
        try {
          const shareHostApp = await initShareHostApp(
            desktopId,
            socket,
            sourceId,
            isDisplay,
            useScreenChannel,
            onControlDisplay,
            false,
          );
          if (onControlDisplay && shareHostApp) {
            screen?.appendChild(shareHostApp.screen);
          }
          return shareHostApp ? true : false;
        } catch (error) {
          console.log("error. orz");
          console.log(error);
        }
      }
    }
  }
  return false;
};

const setFileShare = (
  parentNode: HTMLDivElement,
  desktopId: string,
  socket: Socket,
) => {
  const form = document.createElement("p");
  form.id = "fileOption";
  parentNode.append(form);
  const fileOption = document.createElement("div");
  // fileOption.id = "fileOption";
  form.appendChild(fileOption);

  if (fileOption) {
    const inputDirPath: HTMLInputElement = document.createElement("input");
    fileOption.appendChild(inputDirPath);
    window.util.getBasePath().then((path) => {
      inputDirPath.value = `${path}`;
    });

    const fileButton: HTMLButtonElement = document.createElement("button");
    fileButton.textContent = "fileShare";
    fileOption.appendChild(fileButton);
    fileButton.onclick = async () => {
      const shareFile = initShareFile(desktopId, socket);
      const dirPath = inputDirPath.value;
      if (dirPath === "") {
        return;
      }
      const fileShareList = document.createElement("div");
      fileOption.appendChild(fileShareList);
      const result = await shareFile.loadFile(dirPath, fileShareList);

      if (result) {
        fileButton.disabled = true;
        fileOption.removeChild(inputDirPath);
        fileOption.removeChild(fileButton);
      }
    };
  }
};

const startCLI = async (check: CLICheck) => {
  const socket = io(signalingAddress, {
    secure: true,
    rejectUnauthorized: false,
  });

  socket.once("desktopId", async (msg) => {
    if (typeof msg === "string" && check.password) {
      const desktopId = msg;
      setAuth(msg, socket, check.password);
      window.util.sendMessage(`desktopId: ${desktopId}`);

      if (check.host) {
        initShareHostApp(
          desktopId,
          socket,
          check.host.sourceId,
          true,
          false,
          false,
          check.host.audio,
        ).catch(() => {
          if (check.host?.audio) {
            initShareHostApp(
              desktopId,
              socket,
              check.host.sourceId,
              true,
              false,
              false,
              false,
            );
          }
        });
      }

      if (check.filePath) {
        const shareFile = initShareFile(desktopId, socket);
        shareFile.loadFile(check.filePath);
      }
    }
  });
};

const start = async () => {
  const check = await window.util.checkInterface();
  if (check) {
    startCLI(check);
  } else {
    signalingConnect();
  }
};

// signalingConnect();
start();
