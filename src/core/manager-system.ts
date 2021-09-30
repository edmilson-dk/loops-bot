import { MusicInfoType } from "../types";
import { FetchApi } from "./fetch-api";
import { ManagerData } from "./manager-data";

export class ManagerSystem {
  private readonly managerData: ManagerData = new ManagerData();
  private readonly fetchApi: FetchApi = new FetchApi();
  private readonly saveMusicFrom: string = "./musics";

  async onBotStart() {
    await this.storageMusics();
    return;
  }

  async onMusicAdd(music: MusicInfoType) {
    await this.storeNewMusic(music);
    return;
  }

  private async storageMusics() {
    const musics = await this.fetchApi.getMusicsList();

    musics.forEach((music) => {
      this.fetchApi.downloadMusic(music.id, this.saveMusicFrom);
    });

    await this.managerData.storeMusicsInfos(musics);
  }

  private async storeNewMusic(music: MusicInfoType) {
    this.fetchApi.downloadMusic(music.id, this.saveMusicFrom);
    this.managerData.updateMusicsInfos(music);
  }
}
