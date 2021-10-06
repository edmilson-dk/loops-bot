import axios from "axios";
import fs from "fs";
import https from "https";
import http from "http";

import { logger } from "../helpers/logger";
import { MusicInfoType } from "../types";

export class FetchApi {
  private readonly baseUrl: string = process.env.BASE_URL_API as string;
  private readonly httpsOrHttp = process.env.NODE_ENV === "production" ? https : http;

  private readonly API = axios.create({
    baseURL: this.baseUrl,
  });

  public async getMusicsList(): Promise<MusicInfoType[]> {
    const { data } = await this.API.get<{ musics: MusicInfoType[] }>("/musics/list");
    return data.musics;
  }

  public downloadMusic(id: string, saveFrom: string, saveName: string | number): string {
    const writeFileStream = fs.createWriteStream(`${saveFrom}/${saveName}.mp3`);

    const request = this.httpsOrHttp.get(`${this.baseUrl}/musics/download/${id}`, (response) => {
      response.pipe(writeFileStream);
      response.on("end", () => {
        logger.info(`${saveName} downloaded`);
        request.end();
      });
    });

    return id;
  }

  public async emitUpdateMusicList() {
    await this.API.get("/update");
  }
}
