const { ButtonInteraction, Client, AttachmentBuilder, EmbedBuilder, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js')
const ticketDB = require('../../../models/Ticket')

module.exports = {
    data: {
        name: "ticket-close"
    },
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { guildId, message, member, guild } = interaction;

        if(member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply(
                { embeds: [
                    new EmbedBuilder()
                    .setDescription('✅ Successfully closed this ticket!')
                    .setColor(client.color)
                ]}
            ).then(async () => {
                setTimeout(async () => {
                    interaction.channel.delete()
                    await ticketDB.findOne({ GuildID: guildId, ChannelID: interaction.channel.id }).deleteMany();
                }, 3*1000)
            })
        } else {
            return interaction.reply(
                { embeds: [
                    new EmbedBuilder()
                    .setTitle('✉️ Ticket System')
                    .setDescription('❌ You do not have permission to close this ticket!')
                    .setColor(client.color)
                    .setTimestamp(Date.now())
                ],
                ephemeral: true
            }
            )
        }
    }
}