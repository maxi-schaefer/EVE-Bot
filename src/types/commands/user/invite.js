const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Invite me to your Discord Server😀'),
    /**
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {
        const link = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`[💌 Invite Me](${link})`)
        .setFooter({text: client.user.username, iconURL: client.user.avatarURL()})
        .setTimestamp(Date.now())

        interaction.reply({embeds: [Response]})
    }
}