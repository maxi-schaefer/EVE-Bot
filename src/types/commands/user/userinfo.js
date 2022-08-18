const { Client, ContextMenuCommandBuilder, UserContextMenuCommandInteraction, EmbedBuilder, ApplicationCommandType } = require('discord.js')

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Userinfo')
    .setDMPermission(false)
    .setType(ApplicationCommandType.User),
    /**
     * 
     * @param {UserContextMenuCommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const target = await interaction.guild.members.fetch(interaction.targetId);

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp(Date.now())
        .setAuthor({name: target.user.tag, iconURL: target.user.displayAvatarURL()})
        .setThumbnail(target.user.displayAvatarURL())
        .addFields([
            {
                name: 'ID', value: `${target.user.id}`, inline: true
            },
            {
                name: "Roles", value: `${target.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}`, inline: false
            },
            {
                name: "Member Since", value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true
            },
            {
                name: "Discord User Since", value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, inline: true
            }
        ])

        interaction.reply({embeds: [Response], ephemeral: true})

    }
}

