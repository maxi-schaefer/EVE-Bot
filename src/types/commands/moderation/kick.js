const { EmbedBuilder, Client, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server!")
    .addUserOption(
        option =>
        option.setName("user")
        .setDescription("Select a User to kick.")
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName("reason")
        .setDescription("Reason for the kick.")
        .setRequired(false))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member } = interaction;

        const Target = options.getMember("user");
        const Reason = options.getString("reason");

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp(Date.now());

        /* Check if the user is kickable and if not send an error message! */
        if(Target.kickable) {
        
            /* Check if a reason is given */
            if(Reason) {
                await Target.kick(Reason);
                Response.setDescription(`${member} kicked User ${Target}! \n **Reason:** ${Reason}`);
                return interaction.reply({embeds: [Response]});
            } else {
                await Target.kick();
                Response.setDescription(`${member} kicked User ${Target}! \n **Reason:** No Reason given`);
                return interaction.reply({embeds: [Response]});
            }
        
        } else {
            /* Send Error Message */
            Response.setDescription(`❌ Could not kick User ${Target} because of missing Permissions!`)
            return interaction.reply({embeds: [Response]});
        }
    } 
}