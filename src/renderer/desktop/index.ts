import { Socket } from "socket.io-client";
import { listenAuth } from "./signaling";
import { ShareHostApp } from "./shareApp/host";
import { ShareFile } from "./shareFile";

export const setAuth = (
  desktopId: string,
  socket: Socket,
  password: string,
): void => {
  listenAuth(socket, desktopId, password);
};

export const initShareHostApp = async (
  desktopId: string,
  socket: Socket,
  rtcConfiguration: RTCConfiguration,
  sourceId: string,
  isDesktop: boolean,
  useScreenChannel: boolean,
  onControlDisplay: boolean,
  audio: boolean,
): Promise<ShareHostApp | undefined> => {
  const stream: MediaStream =
    await // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator.mediaDevices as any).getUserMedia({
      audio: audio
        ? {
            mandatory: {
              chromeMediaSource: "desktop",
            },
          }
        : false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: sourceId,
        },
      },
    });
  const regex = /:(\d+):/;
  const match = sourceId.match(regex);
  if (match && match[1] && desktopId && socket) {
    const windowId = parseInt(match[1], 10);

    const shareHostApp = new ShareHostApp(
      windowId, //sourceId
      isDesktop,
      desktopId,
      socket,
      rtcConfiguration,
      stream,
      useScreenChannel,
      onControlDisplay,
    );

    return shareHostApp;
  }
  return undefined;
};

export const initShareFile = (
  desktopId: string,
  socket: Socket,
  rtcConfiguration: RTCConfiguration,
): ShareFile => {
  return new ShareFile(desktopId, socket, rtcConfiguration);
};
