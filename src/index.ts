import dotenv from "dotenv";
import { Client } from "discord.js";
dotenv.config();

const TOKEN = process.env.BOT_SECRET_TOKEN;

const client = new Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  console.log(message.content);
});

client.login(TOKEN);
