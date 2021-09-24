import { Client } from "discord.js";
import { DiscordServerType } from "../../types";

export class DiscordServers {
  private servers: DiscordServerType[] = [];
  private connections: string[] = [];

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

  public getConnections(): string[] {
    return this.connections;
  }

  public updateConnections(client: Client) {
    const joineds = client.voice?.connections.keyArray();
    if (joineds) this.connections = joineds;

    return this.connections;
  }

  public hasConnection(serverId: string): boolean {
    return this.connections.includes(serverId);
  }

  public hasServer(serverId: string): boolean {
    return this.findServerIndex(serverId) >= 0;
  }
}
