import dotenv from "dotenv";
import { Client } from "discord.js";
dotenv.config();

import { getBotCommandArgs, isValidCommand } from "./helpers/parserCommands";
import { playMusic } from "./core/discord-music";
import { MUSICS } from "./constants";
import { DiscordServers } from "./domain/discord-servers";
import { ServerEvents } from "./core/server-events";

const client = new Client({});

const TOKEN = process.env.BOT_SECRET_TOKEN;

const discordServers = new DiscordServers();
const serverEvents = new ServerEvents();

client.once("ready", () => {
  console.log("Ready!");
});

const broadcast = client.voice?.createBroadcast();

broadcast?.once("subscribe", () => {
  console.log("Starting player...");
  playMusic(broadcast, MUSICS[0]);
});

broadcast?.on("subscribe", () => {
  console.log("Subscribed to new broadcast!");
});

/*
broadcast?.on("unsubscribe", (dis) => {
  const client = dis.broadcast?.client;

  if (client) {
    client.guilds.cache.forEach((guild) => {
      const server = discordServers.getServer(guild.id);
      if (server) serverEvents.onServerStop(server);

      console.log(`Unsubscribed from ${guild.name}`);
    });
  }
});
*/

client.on("message", async (message) => {
  const { command } = getBotCommandArgs(message.content || "");
  const isValid = isValidCommand(command.toLowerCase());

  if (message.author?.bot || message.channel?.type === "dm") return;

  const server = discordServers.createServer(message.guild?.id || "", message.guild?.name || "");

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

            console.log(`New play started in server *${server.name}*`);
            message.channel?.send("Iniciando a festa! 🎼");

            if (connection) {
              connection.play(broadcast);
              serverEvents.onServerLoop(server, connection);
            }
          }
          break;
        case "!stop":
          if (!server?.isStopped) {
            message.channel?.send("Parando a festa! 🏃‍♂️");
            serverEvents.onServerStop(server);
          }

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
