import { VoiceBroadcast } from "discord.js";
import fs from "fs";

import { ManagerData } from "./manager-data";

export class DiscordMusic {
  private readonly managerData: ManagerData = new ManagerData();

  getMusics() {
    return this.managerData.getMusicsInfos();
  }

  getActualMusicFile(actualIndex: number): string {
    const musics = this.getMusics();
    const musicsFiles = this.managerData.getMusicsFilesNames();
    const actualMusic = musics[actualIndex];

    const actualSongFile =
      musicsFiles.find((music) => music === `${actualMusic.id}.mp3`) || `${actualMusic.id}.mp3`;

    return actualSongFile;
  }

  playMusic(broadcast: VoiceBroadcast, musicIndex: number) {
    const actualSongFile = this.getActualMusicFile(musicIndex);

    console.log(`Playing ${actualSongFile}`);

    const stream = fs.createReadStream(`./musics/${actualSongFile}`);
    const dispatcher = broadcast.play(stream);

    dispatcher.on("finish", () => {
      console.log(actualSongFile, "has finished playing!");
      const musics = this.getMusics();
      const index = musics[musicIndex + 1] ? musicIndex + 1 : 0;

      this.playMusic(broadcast, index);
    });
  }
}
