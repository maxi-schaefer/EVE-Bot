const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Need help, use this command!')
    .addStringOption(
        option =>
        option.setName('command')
        .setDescription('Get information about a command!')
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member } = interaction;

        const command = options.getString('command');

        const helpEmbed = new EmbedBuilder()
        .setTitle('📬 Need help? Here are all of my commands')
        .setDescription('Use ``/help`` followed by a command name to get more additional information on a command. For example ``/help afk``')
        .setColor(client.color)
        .setFooter({ text: `Requested by ${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
        .setTimestamp(Date.now())

        if(command) {
            if(client.commands.get(command)) {
                const commandInformation = client.commands.get(command)

                helpEmbed.setTitle(command).setDescription(commandInformation.data.description);
                return interaction.reply({ embeds: [helpEmbed], ephemeral: true })
            } else {
                return interaction.reply({ content: `\`\`${command}\`\` is not a valid command!`, ephemeral: true });
            }
        } else {
            helpEmbed.addFields([
                { name: '👑 OWNER', value: '``announce``' },
                { name: '⚙️ CONFIG', value: '``setup`` ``chatfilter`` ``reactionroles``' },
                { name: '🎉 GIVEAWAY', value: '``giveaway``' },
                { name: '📖 MODERATION', value: '``ban`` ``kick`` ``mute`` ``checkwarns`` ``warn`` ``unmute`` ``lock`` ``slowmode`` ``timeout`` ``unban`` ' },
                { name: '🗣️ USER', value: '``afk`` ``avatar`` ``dm`` ``help`` ``invite`` ``membercount`` ``serverinfo`` ``userinfo`` ``temp`` ' },
                { name: '🤡 FUN', value: '``together`` ``weather`` ``anime`` ``meme`` ``translate`` ``confession`` ' },
            ])
            
            return interaction.reply({ embeds: [helpEmbed] })
        }
    }
}