import { Message, PartialMessage, VoiceConnection } from "discord.js";
import ytdl from "ytdl-core";

import { ServerType } from "../types";

export function playMusic(
  connection: VoiceConnection,
  message: Message | PartialMessage,
  servers: ServerType,
  url: string,
) {
  const server = servers[message.guild?.id as string];

  if (!server.queue[0]) {
    message.channel?.send("Queue is empty");
    return;
  }

  let actualSongIndex = server.queue.findIndex((song) => song === url);
  const stream = ytdl(url, { filter: "audioonly" });
  const dispatcher = connection.play(stream);

  dispatcher.on("start", () => {
    console.log(url, " is now playing!");
  });

  dispatcher.on("finish", () => {
    console.log(url, "has finished playing!");

    if (server.queue[actualSongIndex + 1]) {
      playMusic(connection, message, servers, server.queue[actualSongIndex + 1]);
    } else {
      playMusic(connection, message, servers, server.queue[0]);
    }
  });
}
