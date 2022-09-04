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
        const { options, member, guild } = interaction;

        const user = options.getUser('user')
        const TargetMember = options.getMember('user')
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

        interaction.reply({embeds: [Response], ephemeral: true});
    }
}