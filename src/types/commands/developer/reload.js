const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, PermissionFlagsBits, } = require('discord.js')
const { loadCommands } = require('../../../handlers/CommandHandler')
const { loadEvents } = require('../../../handlers/EventHandler')
const { loadComponents } = require('../../../handlers/ComponentHandler')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload my commands/components/events')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption(
        option =>
        option.setName('type')
        .setDescription('Choose a type')
        .addChoices(
            { name: 'Commands', value: 'commands' },
            { name: 'Events', value: 'events' },
            { name: 'Components', value: 'components' },
        ).setRequired(true)
    ),
    category: 'developer',
    developer: true,
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Response = new EmbedBuilder()
        .setTitle('⌚ Reload')
        .setTimestamp(Date.now())
        .setColor(client.color)

        switch(options.getString('type')) {

            case 'commands': {
                loadCommands(client);

                Response.setDescription('Reloaded the **Commands**')
            } break;

            case 'events': {
                loadEvents(client);

                Response.setDescription('Reloaded the **Events**')
            } break;

            case 'components': {
                loadComponents(client);

                Response.setDescription('Reloaded the **Components**')
            } break;

        }

        return interaction.reply({embeds: [Response]});
    }
}