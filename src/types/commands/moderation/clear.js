const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete Messages in a channel")
    .addNumberOption(
        option =>
        option.setName("amount")
        .setDescription("Amount of messages that is gonna be deleted")
        .setRequired(true)
        .setMaxValue(100))
    .addChannelOption(
        option =>
        option.setName("channel")
        .setDescription("Choose a channel.")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, channel } = interaction;

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp(Date.now())
        .setTitle("📰 Messages")

        const target_channel = options.getChannel("channel");
        const amount = options.getNumber("amount");

        if(target_channel) {
            await target_channel.bulkDelete(amount, true).then(async messages => {
                Response.setDescription(`🧹 Deleted ${messages.size} from ${target_channel}.`)
                await interaction.reply({embeds: [Response]}).then(inter => {
                    setTimeout(() => inter.interaction.deleteReply(), 10*1000);
                })
            })
        } else {
            await channel.bulkDelete(amount, true).then(async messages => {
                Response.setDescription(`🧹 Deleted ${messages.size} from ${channel}.`)
                await interaction.reply({embeds: [Response]}).then(inter => {
                    setTimeout(() => inter.interaction.deleteReply(), 10*1000);
                })
            })
        }
    }
}