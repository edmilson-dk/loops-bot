import { SOCKET_EVENTS } from "../constants";
import { logger } from "../helpers/logger";
import { socket } from "../sockets";
import { DiscordServerType, MusicInfoType, MusicRemovedInfos } from "../types";
import { ManagerSystem } from "./manager-system";

export class SocketsManager {
  private readonly managerSystem: ManagerSystem;

  constructor(managerSystem: ManagerSystem) {
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

  public emitMusicPlaying(data: MusicInfoType) {
    socket.emit(SOCKET_EVENTS.musicIsPlaying, data);
  }

  public emitChangeServersConnected(data: DiscordServerType[]) {
    socket.emit(SOCKET_EVENTS.changeServersConnected, data);
  }

  onEvents() {
    socket.on(SOCKET_EVENTS.addedNewMusic, this.onAddedNewMusic.bind(this));
    socket.on(SOCKET_EVENTS.droppedMusic, this.onRemovedMusic.bind(this));
  }
}
