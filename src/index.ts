import dotenv from "dotenv";
import { Client } from "discord.js";
dotenv.config();

import { getBotCommandArgs, isValidCommand } from "./helpers/parserCommands";
import { ServerType } from "./types";
import { playMusic } from "./core/discord-music";

const TOKEN = process.env.BOT_SECRET_TOKEN;

const client = new Client({});

const servers: ServerType = {};
const musics = [
  "https://www.youtube.com/watch?v=5jbpMeoO0f8",
  "https://www.youtube.com/watch?v=5JCIHeQsUog",
];

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  const { args, command } = getBotCommandArgs(message.content || "");
  const isValid = isValidCommand(command.toLowerCase());

  if (message.author?.bot) {
    return;
  }

  if (!isValid) {
    message.channel?.send("Invalid command, use !loop or !stop command");
    return;
  }

  if (!message.member?.voice.channel) {
    message.channel?.send("You need to be in a voice channel to use this command!");
    return;
  }

  if (!servers[message.guild?.id || ""]) {
    servers[message.guild?.id || ""] = { queue: musics };
  }

  const server = servers[message.guild?.id || ""];
  console.log({ server, servers });

  message.member?.voice.channel
    ?.join()
    .then((connection) => {
      switch (command) {
        case "!loop":
          playMusic(connection, message, servers, server.queue[0]);
          break;
      }
    })
    .catch((err) => {
      console.log(err);
      message.channel?.send("An unexpected error occurred :( please try again.");
    });
});

client.login(TOKEN);
