import fs from "fs";

import { MusicInfosDataFileType, MusicInfoType } from "../types";

export class ManagerData {
  private readonly musicsInfosPath: string = "./src/data/musics-infos.json";
  private readonly musicInfosFile: MusicInfosDataFileType = {} as MusicInfosDataFileType;

  constructor() {
    const file: string = fs.readFileSync(this.musicsInfosPath, "utf8");
    this.musicInfosFile = JSON.parse(file) as MusicInfosDataFileType;
  }

  async storeMusicsInfos(musicsInfos: MusicInfoType[]): Promise<void> {
    this.musicInfosFile.musics = musicsInfos;
    await this.rewriteMusicsInfos();
  }

  async updateMusicsInfos(musicsInfos: MusicInfoType): Promise<void> {
    this.musicInfosFile.musics.push(musicsInfos);
    await this.rewriteMusicsInfos();
  }

  private async rewriteMusicsInfos(): Promise<void> {
    await fs.promises.writeFile(this.musicsInfosPath, JSON.stringify(this.musicInfosFile, null, 2));
  }

  getMusicsInfos(): MusicInfoType[] {
    return this.musicInfosFile.musics;
  }
}
