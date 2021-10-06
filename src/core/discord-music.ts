import Discord, { VoiceBroadcast } from "discord.js";
import fs from "fs";
import { logger } from "../helpers/logger";
import { socket } from "../sockets";
import { MusicInfoType } from "../types";

import { ManagerData } from "./manager-data";

export class DiscordMusic {
  private readonly managerData: ManagerData = new ManagerData();
  private readonly messageEmbed = new Discord.MessageEmbed();
  private actualMusic: MusicInfoType = {} as MusicInfoType;

  getMusics() {
    return this.managerData.getMusicsInfos();
  }

  getActualMusicFile(actualIndex: number): string {
    const musics = this.getMusics();
    const musicsFiles = this.managerData.getMusicsFilesNames();
    const actualMusic = musics[actualIndex];
    this.actualMusic = actualMusic;

    const actualSongFile =
      musicsFiles.find((music) => music === `${actualMusic.id}.mp3`) || `${actualMusic.id}.mp3`;

    return actualSongFile;
  }

  playMusic(broadcast: VoiceBroadcast, musicIndex: number) {
    const actualSongFile = this.getActualMusicFile(musicIndex);

    logger.info(`Playing ${actualSongFile}`);

    const stream = fs.createReadStream(`./musics/${actualSongFile}`);
    const dispatcher = broadcast.play(stream);

    dispatcher.on("finish", () => {
      logger.info(actualSongFile + "has finished playing!");
      const musics = this.getMusics();
      const index = musics[musicIndex + 1] ? musicIndex + 1 : 0;

      // if (index === musics.length - 1) {
      //   socket.emit("updated_musics", index);
      // }

      this.playMusic(broadcast, index);
    });
  }

  sendMusicEmbed(): Discord.MessageEmbed {
    const { artist, name, url } = this.actualMusic;

    const msg = this.messageEmbed
      .setColor("#0099ff")
      .setTitle(`Tocando: ${name}`)
      .setURL(url)
      .setAuthor(`Artista: ${artist}`)
      .setTimestamp()
      .setFooter(`Aproveite a música!`);

    return msg;
  }
}
