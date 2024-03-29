import dotenv from "dotenv";
import { Client, TextChannel } from "discord.js";
dotenv.config();

import { getBotCommandArgs, isValidCommand } from "./helpers/parserCommands";
import { DiscordMusic } from "./core/discord-music";
import { DiscordServers } from "./core/discord-servers";
import { ServerEvents } from "./core/server-events";
import { logger } from "./helpers/logger";
import { ManagerSystem } from "./core/manager-system";
import { SocketsManager } from "./core/sockets-manager";
import { GenericCommands } from "./core/generic-commands";
import { ManagerCronsJobs } from "./core/manager-crons-jobs";
import { ManagerData } from "./core/manager-data";

const client = new Client({
  retryLimit: 3,
});

const TOKEN = process.env.BOT_SECRET_TOKEN;

const discordServers = new DiscordServers();
const managerSystem = new ManagerSystem();
const socketsManager = new SocketsManager(managerSystem);
const genericCommands = new GenericCommands();
const jobsManager = new ManagerCronsJobs();
const managerData = new ManagerData();
const discordMusic = new DiscordMusic(managerData, socketsManager);
const serverEvents = new ServerEvents(discordServers, socketsManager);

client.once("ready", () => {
  console.log("Ready!");
  managerSystem.onBotStart();
  socketsManager.onEvents();
  jobsManager.startUpdatedMusicsJob();
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
  const channel = message.channel as TextChannel;

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
    channel.send("Comando inválido!, envie o comando !tocar ou !parar");
    return;
  }

  if (isValid && !message.member?.voice.channel && !server?.isPlaying) {
    channel.send("Você precisa estar em um canal de voz para usar este comando!");
    return;
  }

  // TODO: Refatorar este código organizando melhor os métodos utilizados

  if (broadcast) {
    try {
      switch (command) {
        case "!tocar":
          if (!server?.isPlaying) {
            const connection = await message.member?.voice.channel?.join();

            logger.info(`New play started in server "${server.name}"`);
            channel.send("Iniciando transmissão da Rede da Legalidade 📻");

            if (connection) {
              connection.play(broadcast);
              serverEvents.onServerLoop(server, connection);
              serverEvents.onServersChangeConnection();
              break;
            }
          }
          break;
        case "!parar":
          channel.send(`
            Poderei ser esmagado. Poderei ser destruído. Poderei ser morto [...] Estaremos aqui para morrer, se necessário. Um dia, nossos filhos e irmãos farão a independência do nosso povo!\n\nUm abraço, meu povo querido! 🇧🇷
          `);
          serverEvents.onServerStop(server);
          serverEvents.onServersChangeConnection();
          break;
        case "!musica":
          const embed = discordMusic.sendMusicEmbed();
          channel.send(embed);
          break;
        case "!ajuda":
          genericCommands.sendCommandsHelp(channel);
          break;
        default:
          break;
      }
    } catch (error) {
      channel.send("Ops! Algo deu errado, tente novamente!");
    }
  }
});

client.login(TOKEN);
