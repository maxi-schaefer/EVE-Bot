const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ake me anything')
    .addStringOption(option => option.setName('question').setDescription('Ask your question').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member } = interaction;

        const replies = ["Yes.", "No.", "I don't know.", "Ask again later"];
        const result = Math.floor((Math.random() * replies.length))

        const ballEmbed = new EmbedBuilder()
        .setTitle('🎱 Ball')
        .setColor(client.color)
        .setFooter({ text: `Asked by ${member.user.tag}!`, iconURL: member.user.displayAvatarURL() })
        .addFields(
            { name: 'Question', value: options.getString('question') },
            { name: 'Answer', value: replies[result] },
        )

        interaction.reply({ embeds: [ballEmbed]});
    }
}