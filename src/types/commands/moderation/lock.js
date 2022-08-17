const { Client, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock or unlock a Channel of your choice")
    .addStringOption(
        option =>
        option.setName("type")
        .setDescription('Lock or Unlock')
        .setRequired(true)
        .addChoices(
            { name: '🔒 Lock', value: 'lock' },
            { name: '🔓 Unlock', value: 'unlock' },
        )
    )
    .addChannelOption(
        option =>
        option.setName("channel")
        .setDescription("The channel you want to lock!")
        .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildText)
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild } = interaction;

        const channel = options.getChannel("channel")
        const type = options.getString('type');

        const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle('🔒 Lock')
        .setTimestamp(Date.now());

        switch(type) {
            
            case "lock": {
                try {
                    if(channel) {
                        channel.permissionOverwrites.edit(guild.roles.everyone.id, { SendMessages: false, Connect: false });
                        Embed.setTitle('🔒 Lock').setDescription(`Successfully locked ${channel}`)
                    } else {
                        interaction.channel.permissionOverwrites.edit(guild.roles.everyone.id, { SendMessages: false, Connect: false });
                        Embed.setTitle('🔒 Lock').setDescription(`Successfully locked ${interaction.channel}`)
                    }
                } catch (error) {
                    console.log(error)
                }
            } break;

            case "unlock": {
                try {
                    if(channel) {
                        channel.permissionOverwrites.edit(guild.roles.everyone.id, { SendMessages: false, Connect: false });
                        Embed.setTitle('🔓 Unlock').setDescription(`Successfully unlocked ${channel}`)
                    } else {
                        interaction.channel.permissionOverwrites.edit(guild.roles.everyone.id, { SendMessages: false, Connect: false });
                        Embed.setTitle('🔓 Unlock').setDescription(`Successfully unlocked ${interaction.channel}`)
                    }
                } catch (error) {
                    console.log(error)
                }
            } break;
        }

        return interaction.reply({embeds: [Embed], ephemeral: true})
    }
}