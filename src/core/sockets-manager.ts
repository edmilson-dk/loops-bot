import { Socket } from "socket.io-client";

import { SOCKET_EVENTS } from "../constants";
import { logger } from "../helpers/logger";
import { MusicInfoType, MusicRemovedInfos } from "../types";
import { ManagerSystem } from "./manager-system";

export class SocketsManager {
  private readonly socket: Socket;
  private readonly managerSystem: ManagerSystem;

  constructor(socket: Socket, managerSystem: ManagerSystem) {
    this.socket = socket;
    this.managerSystem = managerSystem;
  }

  private onAddedNewMusic(data: MusicInfoType) {
    logger.info(`New music added [${data.name}]`);
    this.managerSystem.onMusicAdd(data);
  }

  private onRemovedMusic(data: MusicRemovedInfos) {
    logger.info(`Music removed [${data.name}]`);
    this.managerSystem.onMusicRemoved(data);
  }

  onEvents() {
    this.socket.on(SOCKET_EVENTS.addedNewMusic, this.onAddedNewMusic.bind(this));
    this.socket.on(SOCKET_EVENTS.droppedMusic, this.onRemovedMusic.bind(this));
  }
}
