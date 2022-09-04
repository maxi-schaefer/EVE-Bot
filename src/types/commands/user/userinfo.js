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
        const { guild, member } = interaction;

        const target = await interaction.guild.members.fetch(interaction.targetId);

        const user = target.user
        const TargetMember = target
        const highestRole = guild.roles.cache.find(role => role.id === TargetMember.roles.highest.id);

        const Response = new EmbedBuilder()
        .setColor(highestRole.color || client.color)
        .setTimestamp(Date.now())
        .setAuthor({name: `${user.username}'s Information`, iconURL: user.displayAvatarURL()})
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`
        **__General Information__**
        **Name:** ${user.username}
        **ID:** ${user.id}
        **Nickname:** ${TargetMember.nickname ? TargetMember.nickname : 'None'}
        **Bot?:** ${user.bot ? '✅ Yes' : '❎ No' }
        **Account Created:** <t:${parseInt(user.createdTimestamp / 1000)}:R>
        **Server Joined:** <t:${parseInt(TargetMember.joinedTimestamp / 1000)}:R>

        **__Role Information__**:
        **Highest Role:** ${highestRole}
        **Roles:** ${TargetMember.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}      

        `).setFooter({ text: `Requested by ${member.user.tag}`, iconURL: member.user.displayAvatarURL() });

        interaction.reply({embeds: [Response], ephemeral: true})

    }
}

