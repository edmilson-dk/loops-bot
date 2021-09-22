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

client.on("message", (message) => {
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
        } as DiscordServerType);

  if (existsServer < 0) servers.push(server);

  if (!isValid && !server?.isStopped) {
    message.channel?.send("Invalid command, use !loop or !stop command");
    return;
  }

  if (isValid && !message.member?.voice.channel && !server?.isPlaying) {
    message.channel?.send("You need to be in a voice channel to use this command!");
    return;
  }

  if (broadcast) {
    message.member?.voice.channel
      ?.join()
      .then((connection) => {
        switch (command) {
          case "!loop":
            if (!server?.isPlaying) {
              console.log(`New play started in server *${server.name}*`);

              message.channel?.send("Starting player...");
              connection.play(broadcast);
              server.isPlaying = true;
            }
            break;
          case "!stop":
            message.channel?.send("Stopping player...");
            connection.disconnect();
            server.isPlaying = false;
            server.isStopped = true;
            break;
        }
      })
      .catch((err) => {
        console.log(err);
        message.channel?.send("An unexpected error occurred :( please try again.");
      });
  }
});

client.login(TOKEN);
