const { EmbedBuilder, Client, ModalSubmitInteraction, InteractionCollector } = require('discord.js')

const applicationsysDB = require('../../../models/ApplicationSystem')

module.exports = {
    data: {
        name: 'apply-modal'
    },
    /**
     * 
     * @param {ModalSubmitInteraction} modal 
     * @param {Client} client 
     */
    async execute(modal, client) {
        const { member } = modal;
        if (modal.customId !== "apply-modal") return;

        await modal.deferReply({ ephemeral: true });

        const name = modal.fields.getTextInputValue('application-name')
        const type = modal.fields.getTextInputValue("application-type");
        const application = modal.fields.getTextInputValue("application-all");

        applicationsysDB.findOne({ GuildID: modal.guild.id }, async(err, data) => {
            if(err) throw err;
            if(!data) return modal.followUp({ content: '❌ You cannot apply for this server!', ephemeral: true })

            const channel = modal.guild.channels.cache.get(data.ChannelID);

            const ApplyEmbed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.username}'s Application`, iconURL: member.user.displayAvatarURL() })
            .addFields([
                { name: 'Name:', value: name },
                { name: 'Type:', value: type },
                { name: 'Application:', value: `\`\`\`${application}\`\`\`` },
            ]).setColor(client.color)
            .setTimestamp(Date.now())

            channel.send({ embeds: [ApplyEmbed] })

            return modal.followUp({ content: '✅ Successfully applied!', ephemeral: true })
        })
    }
}