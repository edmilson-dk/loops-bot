import { VoiceConnection } from "discord.js";
import { DiscordServerType } from "../types";

export class ServerEvents {
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
