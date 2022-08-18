const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announce Embed.')
    .addStringOption(
        option =>
        option.setName('title')
        .setDescription('Title of your announcement')
        .setRequired(true)
        .setMinLength(1))
    .addStringOption(
        option =>
        option.setName('description')
        .setDescription('Description of your announcement')
        .setRequired(true)
        .setMinLength(1))
    .addChannelOption(
        option =>
        option.setName('channel')
        .setDescription('Channel you want to send the announcement!')
        .addChannelTypes(ChannelType.GuildText))
    .addRoleOption(
        option =>
        option.setName('notify_role')
        .setDescription('The notify role of your server.'))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member } = interaction;

        const title = options.getString('title');
        const description = options.getString('description');
        const channel = options.getChannel('channel')
        const role = options.getRole('notify_role')

        const NewsEmbed = new EmbedBuilder()
        .setTitle(`📢 ${title}`)
        .setDescription(description)
        .setColor(client.color)
        .setTimestamp(Date.now())
        .setFooter({ text: `Created by ${member.user.tag}`, iconURL: member.user.displayAvatarURL() });

        const Response = new EmbedBuilder()
        .setDescription('✅ Successfully sent Announcement!')
        .setColor(client.color)
        .setTimestamp(Date.now())

        if(channel) {
            if(role) {
                channel.send({embeds: [NewsEmbed], content: `<@&${role.id}>`})
                interaction.reply({embeds: [Response], ephemeral: true})
            } else {
                channel.send({embeds: [NewsEmbed]})
                interaction.reply({embeds: [Response], ephemeral: true})
            }
        } else {
            if(role) {
                interaction.channel.send({embeds: [NewsEmbed], content: `<@&${role.id}>`})
                interaction.reply({embeds: [Response], ephemeral: true})
            } else {
                interaction.channel.send({embeds: [NewsEmbed]})
                interaction.reply({embeds: [Response], ephemeral: true})
            }
        }
    }
}