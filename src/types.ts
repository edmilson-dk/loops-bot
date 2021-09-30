import { VoiceConnection } from "discord.js";

export type DiscordServerType = {
  id: string;
  name: string;
  isPlaying: boolean;
  isStopped: boolean;
  voiceConnect: VoiceConnection | null;
};

export type MusicInfoType = {
  id: string;
  name: string;
  artist: string;
  url: string;
  position: number;
};

export type MusicInfosDataFileType = {
  musics: MusicInfoType[];
};
