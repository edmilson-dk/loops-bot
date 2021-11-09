import Discord, { TextChannel } from "discord.js";

export class GenericCommands {
  private readonly messageEmbed = new Discord.MessageEmbed();

  public sendCommandsHelp(channel: TextChannel) {
    const msg = this.messageEmbed
      .setColor("#2ecc71")
      .setTitle("Comandos disponíveis")
      .setDescription("Comandos e suas funções no bot.")
      .addFields([
        {
          name: "!tocar",
          value: "Envie este comando para iniciar o bot em seu chat de voz.",
        },
        {
          name: "!parar",
          value: "Envie este comando quando você desejar parar o bot em seu chat de voz.",
        },
        {
          name: "!musica",
          value: "Envie este comando para visualizar informações da música que está tocando.",
        },
        {
          name: "!ajuda",
          value: "Quando precisar de ajuda, envie um !help.",
        },
      ])
      .setTimestamp()
      .setFooter("Tenha uma boa experiência!");

    channel.send(msg);
  }
}
