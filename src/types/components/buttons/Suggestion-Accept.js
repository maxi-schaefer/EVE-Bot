const { ButtonInteraction, Client, AttachmentBuilder, EmbedBuilder } = require('discord.js')
const DB = require('../../../models/SuggestSystem')

module.exports = {
    data: {
        name: "suggest-accept"
    },
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { guildId, message, member } = interaction;

        if(!member.permissions.has('Administrator')) return interaction.reply({ content: '❌ You need to be an Administrator to perform this action.', ephemeral: true });

        DB.findOne({GuildID: guildId, MessageID: message.id}, async(err, data) => {
            if(err) throw er;
            if(!data) return interaction.reply({ content: "No data was found in the database", ephemeral: true });

            const Embed = message.embeds[0]
            if(!Embed) return;

            Embed.fields[1] = { name: "Status", value: "✅ Accepted", inline: true }
            Embed.color == 0x3dd95c;
            message.edit({ embeds: [Embed], components: []});
            interaction.reply({content: "Suggestion ✅ Accepted", ephemeral: true});
        })
    }
}