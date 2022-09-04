const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get a users avatar!")
    .addUserOption(
        option => 
        option.setName("user")
        .setDescription("The user you want to get information about.")
        .setRequired(true))
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const user = options.getMember("user")

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp(Date.now())
        .setAuthor({name: "Open Avatar", iconURL: user.user.displayAvatarURL(), url: user.user.avatarURL()})
        .setImage(user.user.displayAvatarURL({size: 512}))

        interaction.reply({embeds: [Response], ephemeral: true});
    }
}