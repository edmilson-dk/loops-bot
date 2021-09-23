import dotenv from "dotenv";
import { Client } from "discord.js";
dotenv.config();

import { getBotCommandArgs, isValidCommand } from "./helpers/parserCommands";
import { playMusic } from "./core/discord-music";
import { MUSICS } from "./constants";
import { DiscordServerType } from "./types";

const client = new Client({});

const TOKEN = process.env.BOT_SECRET_TOKEN;
const servers: DiscordServerType[] = [];

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

broadcast?.on("unsubscribe", (dis) => {
  console.log(dis.broadcast?.client.toJSON());
  console.log("Unsubscribed from broadcast!");
});

client.on("message", async (message) => {
  const { args, command } = getBotCommandArgs(message.content || "");
  const isValid = isValidCommand(command.toLowerCase());

  if (message.author?.bot) return;

  const existsServer = servers.findIndex((server) => server.id === message.guild?.id);
  const server =
    existsServer >= 0
      ? servers[existsServer]
      : ({
          id: message.guild?.id || "",
          name: message.guild?.name || "",
          isPlaying: false,
          isStopped: false,
          voiceConnect: null,
        } as DiscordServerType);

  if (existsServer < 0) servers.push(server);

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

              server.isPlaying = true;
              server.isStopped = false;
              server.voiceConnect = connection;
            }
          }
          break;
        case "!stop":
          message.channel?.send("Parando a festa! 🏃‍♂️");

          server.voiceConnect?.disconnect();
          server.isPlaying = false;
          server.isStopped = true;
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
