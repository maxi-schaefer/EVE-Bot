const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Embed, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Information about the server!')
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { guild } = interaction;

        const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({name: guild.name, iconURL: guild.iconURL()})
        .setThumbnail(guild.iconURL())
        .setTimestamp(Date.now())
        .addFields([
        { name: "💬 │ GENERAL", 
          value: 
          `
          🪧 Name: ${guild.name}
          🕰️ Created: <t:${parseInt(guild.createdTimestamp / 1000)}:R>
          👑 Owner: <@${guild.ownerId}>

          📃 Description: ${guild.description || "None"}    
          ` 
        },
        {
            name: "📱 │ CHANNELS ",
            value:
            `
            📝 Text: ${guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size}
            🔊 Voice: ${guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size}
            📜 Threads: ${guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildPublicThread && ChannelType.GuildPrivateThread && ChannelType.GuildNewsThread).size}
            📇 Categories: ${guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildCategory).size}

            🎁 Total: ${guild.channels.cache.size}
            `
        },
        {
            name: "😀 | EMOJIS & STICKERS",
            value:
            `
            🎞️ Animated: ${guild.emojis.cache.filter((emoji) => emoji.animated).size}
            🖇️ Static: ${guild.emojis.cache.filter((emoji) => !emoji.animated).size}
            💗 Stickers: ${guild.stickers.cache.size}

            😮 Total: ${guild.emojis.cache.size + guild.stickers.cache.size}
            `
        }
        ])

        await interaction.reply({embeds: [Embed]})
    }
}