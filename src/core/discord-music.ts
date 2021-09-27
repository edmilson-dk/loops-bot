import { VoiceBroadcast } from "discord.js";
import ytdl from "ytdl-core";
import fs from "fs";

import { MUSICS } from "../constants";

export function playMusic(broadcast: VoiceBroadcast, musicIndex: number) {
  const actualSongIndex = musicIndex;
  console.log(actualSongIndex);
  const musicsFiles = fs.readdirSync("./musics");
  const actualSongFile = musicsFiles[actualSongIndex];

  // const saveAudioStream = fs.createWriteStream(`./musics/${actualSongIndex}.mp3`);
  // const stream = ytdl(url, { filter: "audioonly" });
  // const audioReadbleStream = stream.pipe(saveAudioStream);
  // audioReadbleStream.on("pipe", () => {
  //   console.log("downloading file music");
  // });

  // audioReadbleStream.on("finish", () => {
  //   console.log(`Download file - ${actualSongIndex}.mp3`);
  // });

  const stream = fs.createReadStream(`./musics/${actualSongFile}`);
  const dispatcher = broadcast.play(stream);

  dispatcher.on("start", () => {
    console.log(actualSongFile, " is now playing!");
  });

  dispatcher.on("finish", () => {
    console.log(actualSongFile, "has finished playing!");
    const index = musicsFiles[actualSongIndex + 1] ? actualSongIndex + 1 : 0;
    playMusic(broadcast, index);
  });
}
