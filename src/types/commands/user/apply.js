const { Modal, TextInputComponent, showModal, TextInputStyles } = require('discord-modals')
const { Client, SlashCommandBuilder, ChatInputCommandInteraction, TextInputStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('apply')
    .setDescription('Apply for a server')
    .setDMPermission(false),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { member, guild } = interaction;
        
        const modal = new Modal()
        .setCustomId('apply-modal')
        .setTitle(`${member.user.username}'s Application`)
        .addComponents(
            new TextInputComponent()
            .setCustomId('application-name')
            .setLabel('Name')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setPlaceholder("What would you like to be called?")
            .setRequired(true),
            new TextInputComponent()
            .setCustomId('application-type')
            .setLabel('Type')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setPlaceholder("What are you applying for?")
            .setRequired(true),
            new TextInputComponent()
            .setCustomId('application-all')
            .setLabel('Application')
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(20)
            .setPlaceholder("Write your application here?")
            .setRequired(true)
        )

        showModal(modal, {
            client: client,
            interaction: interaction
        })
        
    }
}