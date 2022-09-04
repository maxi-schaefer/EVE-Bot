const { Client, EmbedBuilder, ButtonInteraction, PermissionFlagsBits } = require('discord.js')
const ticketDB = require('../../../models/Ticket')

module.exports = {
    data: {
        name: 'ticket-lock',
    },
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { member, guildId, channel, guild } = interaction;

        if(!member.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ content: '❌ You do not have permissions to lock this ticket!', ephemeral: true });

        await ticketDB.findOneAndUpdate(
            { GuildID: guildId, ChannelID: channel.id },
            { Locked: true },
            { new: true, upsert: true })

        channel.permissionOverwrites.edit(guild.roles.everyone.id, { SendMessages: false });

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription('🔒 Locked this ticket!')
                .setColor(client.color)
            ]
        })
    }
}