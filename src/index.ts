import dotenv from "dotenv";
import { Client } from "discord.js";
dotenv.config();

import { getBotCommandArgs, isValidCommand } from "./helpers/parserCommands";
import { playMusic } from "./core/discord-music";
import { MUSICS } from "./constants";

const client = new Client({});

const TOKEN = process.env.BOT_SECRET_TOKEN;

client.once("ready", () => {
  console.log("Ready!");
});

const broadcast = client.voice?.createBroadcast();

broadcast?.once("subscribe", () => {
  console.log("Starting player...");
  playMusic(broadcast, MUSICS[0]);
});

broadcast?.on("subscribe", () => {
  console.log("Broadcast playing in...");
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

  if (broadcast) {
    message.member?.voice.channel
      ?.join()
      .then((connection) => {
        switch (command) {
          case "!loop":
            message.channel?.send("Looping music, await...");
            connection.play(broadcast);
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
