import { VoiceConnection } from "discord.js";
import { DiscordServers } from "./discord-servers";
import { DiscordServerType, ServerConnectedType } from "../types";
import { SocketsManager } from "./sockets-manager";

export class ServerEvents {
  private readonly discordServers: DiscordServers;
  private readonly socketsManager: SocketsManager;

  constructor(discordServers: DiscordServers, socketsManager: SocketsManager) {
    this.discordServers = discordServers;
    this.socketsManager = socketsManager;
  }

  public onServersChangeConnection() {
    const serversConnected = this.discordServers.getServersPlaying();
    const formmated: ServerConnectedType[] = serversConnected.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });

    this.socketsManager.emitChangeServersConnected(formmated);
    return this;
  }

  public onServerLoop(server: DiscordServerType, connection: VoiceConnection) {
    server.isPlaying = true;
    server.isStopped = false;
    server.voiceConnect = connection;

    return this;
  }

  public onServerStop(server: DiscordServerType) {
    server.voiceConnect?.disconnect();
    server.isPlaying = false;
    server.isStopped = true;

    return this;
  }
}
