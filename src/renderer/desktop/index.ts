import { Socket, io } from "socket.io-client";
import { listenAuth, reqAutoProxy } from "./signaling";
import { ShareHostApp } from "./shareApp/host";
import { ShareFile } from "./shareFile";
import { signalingAddress } from "../config";

const setAuth = (desktopId: string, socket: Socket, password: string): void => {
  listenAuth(socket, desktopId, password);
};

const initShareHostApp = async (
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

const initShareFile = (
  desktopId: string,
  socket: Socket,
  rtcConfiguration: RTCConfiguration,
): ShareFile => {
  return new ShareFile(desktopId, socket, rtcConfiguration);
};

export class Impromptu {
  public desktopId?: string;
  private socket: Socket;
  private rtcConfiguration?: RTCConfiguration;
  private shareHostApp?: ShareHostApp;
  private shareFile?: ShareFile;

  constructor() {
    this.socket = io(signalingAddress, {
      secure: true,
      rejectUnauthorized: false,
      autoConnect: false,
    });
  }

  public listenDesktopId(
    callBack: () => void,
    password: string,
    proxy?: { id: string; pwd: string },
  ) {
    this.socket.connect();
    this.socket.once(
      "desktopId",
      async (desktopId?: string, rtcConfiguration?: RTCConfiguration) => {
        if (typeof desktopId === "string" && rtcConfiguration) {
          setAuth(desktopId, this.socket, password);
          this.rtcConfiguration = rtcConfiguration;
          this.desktopId = desktopId;

          if (proxy) {
            reqAutoProxy(this.socket, proxy.id, proxy.pwd, desktopId, password);
          }

          callBack();
        }
      },
    );

    this.socket.emit("role", "desktop");
  }

  public async startHostDisplay(
    isGUI: boolean,
    sourceId: string,
    audio: boolean,
    onControlDisplay: boolean,
    isDisplay: boolean,
    parent?: HTMLDivElement,
  ): Promise<boolean> {
    if (
      this.socket.connected &&
      this.desktopId &&
      this.rtcConfiguration &&
      !this.shareHostApp
    )
      try {
        this.shareHostApp = await initShareHostApp(
          this.desktopId,
          this.socket,
          this.rtcConfiguration,
          sourceId,
          isDisplay,
          true,
          onControlDisplay,
          audio,
        );
        if (isGUI && parent && onControlDisplay && this.shareHostApp) {
          parent.appendChild(this.shareHostApp.screen);
        }
        return this.shareHostApp ? true : false;
      } catch (error) {
        if (audio) {
          if (isGUI) console.log(`maybe not support audio...`);
          try {
            const shareHostApp = await initShareHostApp(
              this.desktopId,
              this.socket,
              this.rtcConfiguration,
              sourceId,
              isDisplay,
              true,
              onControlDisplay,
              false,
            );
            if (isGUI && parent && onControlDisplay && shareHostApp) {
              parent.appendChild(shareHostApp.screen);
            }
            return shareHostApp ? true : false;
          } catch (error) {
            if (isGUI) console.log("error. orz");
            if (isGUI) console.log(error);
          }
        }
      }
    return false;
  }

  public async startFileShare(
    dirPath: string,
    parent?: HTMLDivElement,
  ): Promise<boolean> {
    if (
      dirPath != "" &&
      this.socket.connected &&
      this.desktopId &&
      this.rtcConfiguration &&
      !this.shareFile
    ) {
      this.shareFile = initShareFile(
        this.desktopId,
        this.socket,
        this.rtcConfiguration,
      );

      if (this.shareFile) {
        return await this.shareFile.loadFile(dirPath, parent);
      }
    }
    return false;
  }
}
