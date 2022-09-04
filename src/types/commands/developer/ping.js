const { Client, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        interaction.reply(`🏓 **PONG! Api Ping is:** \`${client.ws.ping}ms\``)
    },
    category: 'developer',
    developer: true
}