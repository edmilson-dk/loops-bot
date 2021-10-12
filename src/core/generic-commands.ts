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
          name: "!loop",
          value: "Envie este comando para iniciar o bot em seu chat de voz.",
        },
        {
          name: "!stop",
          value: "Envie este comando quando você desejar parar o bot em seu chat de voz.",
        },
        {
          name: "!music",
          value: "Envie este comando para visualizar informações da música que está tocando.",
        },
        {
          name: "!help",
          value: "Quando precisar de ajuda, envie um !help.",
        },
      ])
      .setTimestamp()
      .setFooter("Tenha uma boa experiência!");

    channel.send(msg);
  }
}
