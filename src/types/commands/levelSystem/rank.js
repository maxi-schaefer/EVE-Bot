const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { calculateXP } = require('../../../utils/levelsystem')
const Canvacord = require('canvacord')
const { color } = require('../../../../config.json')

const featuresDB = require('../../../models/Features');
const levelsDB = require('../../../models/Levels');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('See your level or the level from other people! (The level System need to be enabled)')
    .addUserOption(
        option =>
        option.setName('user')
        .setDescription('Member you want to see the level')
    ),
    category: 'level',
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild, member } = interaction;
        let members = []

        featuresDB.findOne({ GuildID: guild.id }, async (err, data) => {
            if(err) throw err;
            if(!data || !data.LevelSystem) return interaction.reply({content: `❌ The Level System is not Enabled in this server!`, ephemeral: true})

            const rankcard = new Canvacord.Rank()
            const user = options.getUser('user')

            const levelResult = user ? await levelsDB.findOne({GuildID: guild.id, UserID: user.id}) : await levelsDB.findOne({GuildID: guild.id, UserID: member.id});
            if(levelResult && levelResult.xp) {
                rankcard.setAvatar(user ? user.displayAvatarURL({ extension: 'png' }) : member.user.displayAvatarURL({ extension: 'png' }))
                .setCurrentXP(parseInt(`${levelResult.xp || "0"}`))
                .setLevel(parseInt(`${levelResult.level || "1"}`))
                .setProgressBar(color)
                .setRequiredXP(calculateXP(levelResult.level))
                .setOverlay("#000000")
                .setDiscriminator(user ? user.discriminator : member.user.discriminator, '#303030')
                .setUsername(`${user ? user.username : member.user.username}`, color)
                .setBackground('IMAGE', 'https://cdn.discordapp.com/attachments/965674056080826368/1012314750677426197/eve-rank.png')
                .renderEmojis(true)
                .setLevelColor(color)
                .setProgressBarTrack('#1a1a1a')
                .setRank(0, 'N/A', false)
            } else {
                return interaction.reply({content: `${user ? user : member} does not have any XP 🙁`, ephemeral: true})
            }

            const img = rankcard.build()
            const atta = new AttachmentBuilder(await img).setName("rank.png")
            interaction.reply({files: [atta]});
        })
    }
}
