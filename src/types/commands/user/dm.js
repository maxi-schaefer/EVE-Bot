const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Direct Message a Server Member!")
    .addUserOption(
        option => 
        option.setName("user")
        .setDescription("The user you want to message.")
        .setRequired(true))
    .addStringOption(
        option => 
        option.setName("message")
        .setDescription("The message you want to send.")
        .setRequired(true))
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member } = interaction;

        const user = options.getMember("user")
        const message = options.getString("message")

        const Response = new EmbedBuilder()
        .setTitle("✉️ You've got a new Message")
        .setFooter({text: `From ${member.user.tag}`, iconURL: member.user.displayAvatarURL()})
        .setDescription(`**Message:** \n${message}`)
        .setTimestamp(Date.now())
        .setColor(client.color);

        user.send({embeds: [Response]});
        interaction.reply({content: `✅ Successfully sent Message to ${user}!`, ephemeral: true});
    }
}