const { addInteractionPoints } = require('../../../utils/warnpoints')
const { Client, ContextMenuCommandBuilder, UserContextMenuCommandInteraction, EmbedBuilder, ApplicationCommandType, PermissionFlagsBits, TextInputStyle } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Warn')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setType(ApplicationCommandType.User),
    /**
     * 
     * @param {UserContextMenuCommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const target = await interaction.guild.members.fetch(interaction.targetId);

        addInteractionPoints(1, interaction, 'No reason given', target, client);
    }
}
