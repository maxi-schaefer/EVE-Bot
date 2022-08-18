const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get Information about a user!")
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
        const { options, member } = interaction;

        const user = options.getMember("user")

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp(Date.now())
        .setAuthor({name: user.user.tag, iconURL: user.user.displayAvatarURL()})
        .setThumbnail(user.user.displayAvatarURL())
        .addFields([
            {
                name: 'ID', value: `${user.user.id}`, inline: true
            },
            {
                name: "Roles", value: `${user.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}`, inline: false
            },
            {
                name: "Member Since", value: `<t:${parseInt(user.joinedTimestamp / 1000)}:R>`, inline: true
            },
            {
                name: "Discord User Since", value: `<t:${parseInt(user.user.createdTimestamp / 1000)}:R>`, inline: true
            }
        ])

        interaction.reply({embeds: [Response], ephemeral: true});
    }
}