const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Display the count of members on the server')
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { guild } = interaction;
        const membercount = guild.memberCount

        const Embed = new EmbedBuilder()
        .setTitle('👥 Membercount')
        .setDescription(`We have ${membercount} members!`)
        .setColor(client.color)
        .setTimestamp(Date.now());

        interaction.reply({embeds: [Embed]});
    }
}