const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Get Link to our support server!'),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const button = new ButtonBuilder()
        .setLabel("Support Server")
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.supportServer)

        const Response = new EmbedBuilder()
        .setTitle('⛑️ Support')
        .setColor(client.color)
        .setDescription('If you need support or the bot is not working just create a ticket in the support Server!')
        .setFooter({ text: `${client.user.username} © 2022`, iconURL: client.user.displayAvatarURL()})

        interaction.reply({ embeds: [Response], components: [new ActionRowBuilder().addComponents(button)], ephemeral: true })
    }
}