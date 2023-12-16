import { Socket, io } from "socket.io-client";
import { initShareFile, initShareHostApp, setAuth } from "./desktop";
import { signalingAddress } from "./config";
import { CLICheck } from "../util/type";
import { reqAutoProxy } from "./desktop/signaling";

let mode = true;

const signalingInfo: HTMLDivElement = <HTMLDivElement>(
  document.getElementById("signalingInfo")
);
const desktopOption: HTMLDivElement = <HTMLDivElement>(
  document.getElementById("desktopOption")
);
const screen = document.getElementById("screen");

const signalingConnect = () => {
  // automation proxy
  const proxyIdForm = document.createElement("p");
  signalingInfo.appendChild(proxyIdForm);
  proxyIdForm.appendChild(document.createTextNode(" ProxyID: "));
  const inputProxyId = document.createElement("input");
  inputProxyId.value = "";
  proxyIdForm.appendChild(inputProxyId);

  const proxyPwdForm = document.createElement("p");
  signalingInfo.appendChild(proxyPwdForm);
  proxyPwdForm.appendChild(document.createTextNode(" Proxy Password: "));
  const inputProxyPwd = document.createElement("input");
  inputProxyPwd.value = "impromptu";
  proxyPwdForm.appendChild(inputProxyPwd);

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

    socket.once(
      "desktopId",
      async (desktopId?: string, rtcConfiguration?: RTCConfiguration) => {
        if (typeof desktopId === "string" && rtcConfiguration) {
          setAuth(desktopId, socket, inputPwd.value);

          if (
            inputPwd.value.length > 0 &&
            inputProxyId.value.length > 0 &&
            inputProxyPwd.value.length > 0
          ) {
            reqAutoProxy(
              socket,
              inputProxyId.value,
              inputProxyPwd.value,
              desktopId,
              inputPwd.value,
            );
          }

          // show desktopId
          const idInfo = document.createElement("p");
          signalingInfo.appendChild(idInfo);
          idInfo.textContent = `Desktop ID: ${desktopId}`;

          // fileShare
          setFileShare(desktopOption, desktopId, socket, rtcConfiguration);

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
              await userMediaMode(
                desktopOption,
                screenMode,
                desktopId,
                socket,
                rtcConfiguration,
              );
              screenMode.disabled = false;
            } else {
              screenMode.disabled = true;
              // xvfbMode(desktopOption, screenMode, desktopId, socket);
              screenMode.disabled = false;
            }
          };

          if (mode) {
            screenMode.disabled = true;
            userMediaMode(
              desktopOption,
              screenMode,
              desktopId,
              socket,
              rtcConfiguration,
            ).then(() => {
              screenMode.disabled = false;
            });
          } else {
            screenMode.disabled = true;
            // xvfbMode(desktopOption, screenMode, desktopId, socket);
            screenMode.disabled = false;
          }
        }
      },
    );

    socket.emit("role", "desktop");
  };
};

const userMediaMode = async (
  parentNode: HTMLDivElement,
  screenMode: HTMLButtonElement,
  desktopId: string,
  socket: Socket,
  rtcConfiguration: RTCConfiguration,
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
          rtcConfiguration,
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
          rtcConfiguration,
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
  desktopId: string,
  socket: Socket,
  rtcConfiguration: RTCConfiguration,
  sourceId: string,
  isDisplay: boolean,
  audio: boolean,
  useScreenChannel: boolean,
  onControlDisplay: boolean,
): Promise<boolean> => {
  try {
    const shareHostApp = await initShareHostApp(
      desktopId,
      socket,
      rtcConfiguration,
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
          rtcConfiguration,
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
  return false;
};

const setFileShare = (
  parentNode: HTMLDivElement,
  desktopId: string,
  socket: Socket,
  rtcConfiguration: RTCConfiguration,
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
      const shareFile = initShareFile(desktopId, socket, rtcConfiguration);
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

  socket.once(
    "desktopId",
    async (desktopId?: string, rtcConfiguration?: RTCConfiguration) => {
      if (typeof desktopId === "string" && check.password && rtcConfiguration) {
        setAuth(desktopId, socket, check.password);
        window.util.sendMessage(`desktopId: ${desktopId}`);

        if (check.proxyId && check.proxyPassword) {
          reqAutoProxy(
            socket,
            check.proxyId,
            check.proxyPassword,
            desktopId,
            check.password,
          );
        }

        if (check.host) {
          initShareHostApp(
            desktopId,
            socket,
            rtcConfiguration,
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
                rtcConfiguration,
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
          const shareFile = initShareFile(desktopId, socket, rtcConfiguration);
          shareFile.loadFile(check.filePath);
        }
      }
    },
  );

  socket.emit("role", "desktop");
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