import axios from "axios";
import fs from "fs";
import http from "http";

import { MusicInfoType } from "../types";

export class FetchApi {
  private readonly baseUrl: string = process.env.BASE_URL_API as string;
  private readonly API = axios.create({
    baseURL: this.baseUrl,
  });

  public async getMusicsList(): Promise<MusicInfoType[]> {
    const { data } = await this.API.get<{ musics: MusicInfoType[] }>("/musics/list");
    return data.musics;
  }

  public downloadMusic(id: string, saveFrom: string): string {
    const writeFileStream = fs.createWriteStream(`${saveFrom}/${id}.mp3`);

    const request = http.get(`${this.baseUrl}/musics/download/${id}`, (response) => {
      response.pipe(writeFileStream);
      response.on("end", () => {
        request.end();
      });
    });

    return id;
  }
}
