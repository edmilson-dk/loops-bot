import { VoiceBroadcast } from "discord.js";
import ytdl from "ytdl-core";

import { MUSICS } from "../constants";

export function playMusic(broadcast: VoiceBroadcast, url: string) {
  const actualSongIndex = MUSICS.findIndex((song) => song === url);
  const stream = ytdl(url, { filter: "audioonly" });

  const dispatcher = broadcast.play(stream);

  dispatcher.on("start", () => {
    console.log(url, " is now playing!");
  });

  dispatcher.on("finish", () => {
    console.log(url, "has finished playing!");
    const index = MUSICS[actualSongIndex + 1] ? actualSongIndex + 1 : 0;
    playMusic(broadcast, MUSICS[index]);
  });
}
