import dotenv from "dotenv";
import { Client } from "discord.js";
dotenv.config();

import { getBotCommandArgs, isValidCommand } from "./helpers/parserCommands";
import { DiscordMusic } from "./core/discord-music";
import { DiscordServers } from "./domain/discord-servers";
import { ServerEvents } from "./core/server-events";
import { logger } from "./helpers/logger";
import { ManagerSystem } from "./core/manager-system";
import { socket } from "./sockets";
import { MusicInfoType, MusicRemovedInfos } from "./types";
import { SOCKET_EVENTS } from "./constants";

const client = new Client({
  retryLimit: 3,
});

const TOKEN = process.env.BOT_SECRET_TOKEN;

const discordServers = new DiscordServers();
const serverEvents = new ServerEvents();
const managerSystem = new ManagerSystem();
const discordMusic = new DiscordMusic();

socket.on(SOCKET_EVENTS.addedNewMusic, (data: MusicInfoType) => {
  console.log("addNewMusic", data);
  managerSystem.onMusicAdd(data);
});

socket.on(SOCKET_EVENTS.droppedMusic, (data: MusicRemovedInfos) => {
  console.log("addNewMusic", data);
  managerSystem.onMusicRemoved(data);
});

client.once("ready", () => {
  console.log("Ready!");
  managerSystem.onBotStart();
});

const broadcast = client.voice?.createBroadcast();

broadcast?.once("subscribe", (dispatch) => {
  logger.info("Starting player...");

  discordMusic.playMusic(broadcast, 0);
});

broadcast?.on("error", (err) => {
  logger.error("Error on broadcast! " + err.message);
});

broadcast?.on("subscribe", (dispatch) => {
  const client = dispatch.broadcast?.client;
  if (client) {
    discordServers.updateConnections(client);
  }

  logger.info("Subscribed to new broadcast!");
});

client.on("message", async (message) => {
  discordServers.updateConnections(client);

  const { command } = getBotCommandArgs(message.content || "");
  const isValid = isValidCommand(command.toLowerCase());

  if (message.author?.bot || message.channel?.type === "dm") return;
  const targetServerId = message.guild?.id as string;

  const server = discordServers.createServer(targetServerId, message.guild?.name || "");
  const hasServer = discordServers.hasServer(targetServerId);
  const hasConnection = discordServers.hasConnection(targetServerId);

  if (hasServer && !hasConnection) {
    if (!server?.isStopped) {
      logger.warn(`${server.name} is stopped connection`);
      serverEvents.onServerStop(server);
    }
  }

  if (!isValid && !server?.isStopped && !server?.isPlaying) {
    message.channel?.send("Comando inválido!, envie o comando !loop ou !stop");
    return;
  }

  if (isValid && !message.member?.voice.channel && !server?.isPlaying) {
    message.channel?.send("Você precisa estar em um canal de voz para usar este comando!");
    return;
  }

  if (broadcast) {
    try {
      switch (command) {
        case "!loop":
          if (!server?.isPlaying) {
            const connection = await message.member?.voice.channel?.join();

            logger.info(`New play started in server "${server.name}"`);
            message.channel?.send("Iniciando a festa! 🎼");

            if (connection) {
              connection.play(broadcast);
              serverEvents.onServerLoop(server, connection);
            }
          }
          break;
        case "!stop":
          message.channel?.send("Parando a festa! 🏃‍♂️");
          serverEvents.onServerStop(server);
          break;
        default:
          break;
      }
    } catch (error) {
      message.channel?.send("Ops! Algo deu errado, tente novamente!");
    }
  }
});

client.login(TOKEN);
