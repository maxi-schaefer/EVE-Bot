const { ButtonBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const suggestDB = require('../../../models/SuggestSystem')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Suggest')
    .addStringOption(
        option =>
        option.setName('type')
        .setDescription('Select an option.')
        .setRequired(true)
        .addChoices(
            { name: 'Command', value: 'command' },
            { name: 'System', value: 'system' },
            { name: 'Other', value: 'other' }))
    .addStringOption(
        option =>
        option.setName('suggestion')
        .setDescription('Your suggestion')
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName('description')
        .setDescription('Describe your suggestion.')
        .setMinLength(20)
        .setRequired(true)),
    developer: true,
    category: 'developer',
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guildId, member, user } = interaction;

        const type = options.getString('type')
        const suggestion = options.getString('description')
        const title = options.getString('suggestion')

        const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`Suggestion: ${title}`)
        .setDescription(`\`${suggestion}\``)
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .addFields([
            { name: "Type", value: type, inline: true },
            { name: "Status", value: "Pending...", inline: true }
        ])
        .setTimestamp(Date.now());

        const Buttons = new ActionRowBuilder();
        Buttons.addComponents(
            new ButtonBuilder()
            .setCustomId('suggest-accept')
            .setLabel('✅ Accept')
            .setStyle(ButtonStyle.Success)
        ).addComponents(
            new ButtonBuilder()
            .setCustomId('suggest-decline')
            .setLabel('❌ Decline')
            .setStyle(ButtonStyle.Danger)
        )

        try {

            await interaction.reply({ embeds: [Embed], components: [Buttons], fetchReply: true }).then(async (msg) => {
                await suggestDB.create({ GuildID: guildId, MessageID: msg.id , Details: [
                    { 
                        MemberID: member.id,
                        Type: type,
                        Suggestion: suggestion
                    }
                ]})
            })


            
        } catch (error) {
            console.log(error);
        }
    }
}