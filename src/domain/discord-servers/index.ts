import { DiscordServerType } from "../../types";

export class DiscordServers {
  private servers: DiscordServerType[] = [];

  private makeServer(id: string, name: string) {
    const server: DiscordServerType = {
      id,
      name,
      isPlaying: false,
      isStopped: false,
      voiceConnect: null,
    };

    return server;
  }

  private addServer(server: DiscordServerType) {
    this.servers.push(server);
    return this;
  }

  private findServerIndex(id: string) {
    return this.servers.findIndex((server) => server.id === id);
  }

  public createServer(id: string, name: string) {
    const index = this.findServerIndex(id);

    if (index >= 0) return this.servers[index];

    const server = this.makeServer(id, name);
    this.addServer(server);

    return server;
  }

  public getServer(id: string): DiscordServerType | null {
    const index = this.findServerIndex(id);

    if (index >= 0) return this.servers[index];

    return null;
  }
}
