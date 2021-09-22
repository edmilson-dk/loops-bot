import { VoiceConnection } from "discord.js";

export type DiscordServerType = {
  id: string;
  name: string;
  isPlaying: boolean;
  isStopped: boolean;
  voiceConnect: VoiceConnection | null;
};
