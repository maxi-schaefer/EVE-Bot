const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, Embed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user from the server!")
    .addUserOption(
        option => 
        option.setName("user")
        .setDescription("User to timeout.")
        .setRequired(true))
    .addNumberOption(
        option =>
        option.setName("duration")
        .setDescription("The duration of the timeout")
        .setRequired(true)
        .addChoices(
            { name: "60 seconds", value: 60*1000 },
            { name: "5 minutes", value: 5*60*1000 },
            { name: "10 minutes", value: 10*60*1000 },
            { name: "30 minutes", value: 30*60*1000 },
            { name: "1 hour", value: 60*60*1000 },
            { name: "1 day", value: 24*60*60*1000 },
            { name: "1 week", value: 7*24*60*60*1000 } 
        ))
    .addStringOption(
        option =>
        option.setName("reason")
        .setDescription("Reason for the timeout.")
        .setRequired(false))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */    
    async execute(interaction, client) {
        const { options } = interaction
        
        let Target = options.getMember("user")
        let duration = options.getNumber("duration")
        let reason = options.getString("reason") || "No reason given!"

        const Response = new EmbedBuilder()
        .setTimestamp(Date.now())
        .setColor(client.color);

        try {
            await Target.timeout(duration, reason);
            Response.setDescription(`${Target} has been timed out!\n**Reason:** ${reason}`);
            return interaction.reply({embeds: [Response]});
        } catch (error) {
            console.log(error)
        }
    }
}