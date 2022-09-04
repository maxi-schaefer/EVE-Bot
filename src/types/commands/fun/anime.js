const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js')
const { get } = require('request-promise-native')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Get information about an Anime")
    .addStringOption(
        option =>
        option.setName('name')
        .setDescription('The name of the anime')
        .setRequired(true)),
    category: 'fun',
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;
        const name = options.getString('name')

        let option = {
            url: `https://kitsu.io/api/edge/anime?filter[text]=${name}`,
            method: `GET`,
            headers: {
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
            },
            json:true
        }

        interaction.reply("Fetching your Anime info, Please Wait...").then(msg => {
            get(option).then(mat => {
                const Embed = new EmbedBuilder()
                .setTitle(mat.data[0].attributes.titles.en_jp)
                .setURL(`https://kitsu.io/anime/${mat.data[0].id}`)
                .setDescription(mat.data[0].attributes.synopsis)
                .setColor(client.color)
                .addFields([
                    { name: 'Type', value: mat.data[0].attributes.subtype, inline: true },
                    { name: 'Average Rating', value: mat.data[0].attributes.averageRating, inline: true },
                    { name: 'Next Release', value: mat.data[0].attributes.nextRelease || 'N/A', inline: true },
                    { name: 'Published', value: `${mat.data[0].attributes.startDate} **TO** ${mat.data[0].attributes.endDate ? mat.data[0].attributes.endDate : 'N/A'}`, inline: true },
                    { name: 'Age Rating', value: `${mat.data[0].attributes.ageRatingGuide}`, inline: true },
                    { name: 'Episodes', value: `${mat.data[0].attributes.episodeCount}`, inline: true },
                    { name: 'Status', value: `${mat.data[0].attributes.status}`, inline: true },
                ])
                .setThumbnail(mat.data[0].attributes.posterImage.large)
                .setFooter({text: 'Data from kitsu.io', iconURL: client.user.displayAvatarURL()})

                interaction.channel.send({embeds: [Embed]})
            })
            msg.interaction.deleteReply()
        })
    }
}