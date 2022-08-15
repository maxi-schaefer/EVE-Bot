const { Client, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute a muted Member")
    .addUserOption(
        option => 
        option.setName("user")
        .setDescription("The user you want to unmute.")
        .setRequired(true))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild } = interaction;

        const mutedRole = guild.roles.cache.find(role => role.name === "muted");
        const Target = options.getMember('user');

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({name: '🔈 Mute System', iconURL: guild.iconURL()})
        .setTimestamp(Date.now());

        if(mutedRole && Target.roles.cache.get(mutedRole.id)) {
            Target.roles.remove(mutedRole.id);
            Response.setDescription(`Successfully unmuted ${Target}.`);
        } else {
            Response.setDescription(`${Target} is currently not muted.`);
        }

        interaction.reply({embeds: [Response]});
    }
}