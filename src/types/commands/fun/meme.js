const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const randomPuppy = require('random-puppy')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Sends an epic meme"),
    category: 'fun',
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const subReddits = ["dankmeme", "meme", "me_irl"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];

        const img = await randomPuppy(random);
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`From [${random}](https://reddit.com/r/${random})`)
        .setTitle("🎭 Meme")
        .setImage(img)
        .setTimestamp(Date.now())

        interaction.reply({embeds: [embed]})
    }
}