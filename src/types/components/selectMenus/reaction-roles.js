const { Client, SelectMenuInteraction } = require('discord.js')

module.exports = {
    data: {
        name: 'reaction-roles'
    },
    /**
     * @param {SelectMenuInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const roleID = interaction.values[0];
        const role = interaction.guild.roles.cache.get(roleID);

        const hasRole = interaction.member.roles.cache.has(roleID);

        if(hasRole) {
            interaction.member.roles.remove(roleID);
            interaction.reply({ content: `${role.name} has been removed from you`, ephemeral: true })
        } else {
            interaction.member.roles.add(roleID);
            interaction.reply({ content: `${role.name} has been added to you`, ephemeral: true })
        }
    }
}