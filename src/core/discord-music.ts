import { VoiceBroadcast } from "discord.js";
import fs from "fs";

export function playMusic(broadcast: VoiceBroadcast, musicIndex: number) {
  const actualSongIndex = musicIndex;
  const musicsFiles = fs.readdirSync("./musics");
  const actualSongFile = musicsFiles[actualSongIndex];

  const stream = fs.createReadStream(`./musics/${actualSongFile}`);
  const dispatcher = broadcast.play(stream);

  dispatcher.on("finish", () => {
    console.log(actualSongFile, "has finished playing!");
    const index = musicsFiles[actualSongIndex + 1] ? actualSongIndex + 1 : 0;
    playMusic(broadcast, index);
  });
}
