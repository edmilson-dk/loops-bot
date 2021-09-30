import fs from "fs";

import { MusicInfosDataFileType, MusicInfoType } from "../types";

export class ManagerData {
  private readonly musicsInfosPath: string = "./src/data/musics-infos.json";
  private readonly savedMusicsPath: string = "./musics";
  private musicInfosFile: MusicInfosDataFileType = {} as MusicInfosDataFileType;

  constructor() {
    const file: string = fs.readFileSync(this.musicsInfosPath, "utf8");
    this.musicInfosFile = JSON.parse(file) as MusicInfosDataFileType;
  }

  private updateMusicsFile() {
    const file: string = fs.readFileSync(this.musicsInfosPath, "utf8");
    this.musicInfosFile = JSON.parse(file) as MusicInfosDataFileType;
  }

  private async rewriteMusicsInfos(): Promise<void> {
    await fs.promises.writeFile(this.musicsInfosPath, JSON.stringify(this.musicInfosFile, null, 2));
    this.updateMusicsFile();
  }

  private orderMusicsByPosition(): MusicInfoType[] {
    return this.musicInfosFile.musics.sort((a, b) => a.position - b.position);
  }

  async storeMusicsInfos(musicsInfos: MusicInfoType[]): Promise<void> {
    this.updateMusicsFile();
    this.musicInfosFile.musics = musicsInfos;
    await this.rewriteMusicsInfos();
  }

  async updateMusicsInfos(musicsInfos: MusicInfoType): Promise<void> {
    this.musicInfosFile.musics.push(musicsInfos);
    await this.rewriteMusicsInfos();
  }

  async resetMusicsInfos(musicsInfos: MusicInfoType[]) {
    this.musicInfosFile.musics = musicsInfos;
    await this.rewriteMusicsInfos();
  }

  getMusicsInfos(): MusicInfoType[] {
    this.updateMusicsFile();
    return this.orderMusicsByPosition();
  }

  getMusicsFilesNames(): string[] {
    const musicsFiles = fs.readdirSync(this.savedMusicsPath);
    return musicsFiles.filter((musicFile) => musicFile.endsWith(".mp3"));
  }
}
