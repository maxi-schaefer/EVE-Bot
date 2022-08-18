const { Client, ContextMenuCommandBuilder, UserContextMenuCommandInteraction, EmbedBuilder, ApplicationCommandType } = require('discord.js')

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Avatar')
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
        .setAuthor({name: "Open Avatar", iconURL: target.user.displayAvatarURL(), url: target.user.avatarURL()})
        .setImage(target.user.displayAvatarURL({size: 512}))

        interaction.reply({embeds: [Response], ephemeral: true})

    }
}

