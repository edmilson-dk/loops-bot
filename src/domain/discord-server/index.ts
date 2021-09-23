import { DiscordServerType } from "../../types";

export class DiscordServer {
  public servers: DiscordServerType[] = [];

  private makeServer(id: string) {
    const server: DiscordServerType = {
      id: id,
      name: "",
      isPlaying: false,
      isStopped: false,
      voiceConnect: null,
    };

    return server;
  }

  public addServer(server: DiscordServerType) {
    this.servers.push(server);
    return this;
  }

  private findServerIndex(id: string) {
    return this.servers.findIndex((server) => server.id === id);
  }

  public getOrCreateServer(id: string) {
    const index = this.findServerIndex(id);

    if (index >= 0) return this.servers[index];

    const server = this.makeServer(id);
    this.addServer(server);

    return server;
  }
}
