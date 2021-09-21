import dotenv from "dotenv";
import { Client } from "discord.js";
dotenv.config();

import { getBotCommandArgs, isValidCommand } from "./helpers/parserCommands";

const TOKEN = process.env.BOT_SECRET_TOKEN;

const client = new Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  const { args, command } = getBotCommandArgs(message.content || "");
  const isValid = isValidCommand(command);

  if (message.author?.bot) {
    return;
  }

  if (!isValid) {
    message.channel?.send("Invalid command, use !loop or !stop command");
    return;
  }

  if (args.length === 0) {
    message.channel?.send("You need to provide a music link");
    return;
  }

  if (!message.member?.voice.channel) {
    message.channel?.send("You need to be in a voice channel to use this command!");
    return;
  } else {
    message.member?.voice.channel?.join();
  }
});

client.login(TOKEN);
