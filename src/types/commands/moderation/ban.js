const { Client, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server!")
    .addUserOption(
        option => 
        option.setName("user")
        .setDescription("Select a user to ban")
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName("reason")
        .setDescription("Reason for the ban")
        .setRequired(false))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    /**
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {
        const { options, member } = interaction;

        const Target = options.getMember("user");
        const Reason = options.getString("reason");

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp(Date.now());

        /* Check if the user is bannable and if not send an error message! */
        if(Target.bannable) {
        
            /* Check if a reason is given */
            if(Reason) {
                await interaction.guild.bans.create(Target, {reason: Reason});
                Response.setDescription(`${member} banned User ${Target}! \n **Reason:** ${Reason}`);
                return interaction.reply({embeds: [Response]});
            } else {
                await interaction.guild.bans.create(Target);
                Response.setDescription(`${member} banned User ${Target}! \n **Reason:** No Reason given`);
                return interaction.reply({embeds: [Response]});
            }
        
        } else {
            /* Send Error Message */
            Response.setDescription(`❌ Could not ban User ${Target} because of missing Permissions!`)
            return interaction.reply({embeds: [Response]});
        }
    }
}