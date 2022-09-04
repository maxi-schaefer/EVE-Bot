const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')
const translate = require("@iamtraction/google-translate")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate any text to a specific language!')
    .addStringOption(
        option => 
        option.setName("text")
        .setDescription("The text you wanna translate!")
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName("language")
        .setDescription("The language you wanna translate to!")
        .addChoices(
            { name: "English", value: "english"},
            { name: "German", value: "german"},
            { name: "French", value: "french"},
            { name: "Russian", value: "russian"},
            { name: "Portuguese", value: "portuguese"},
            { name: "Turkish", value: "turkish"},
            { name: "Japanese", value: "japanese"},
        ).setRequired(true)),
        category: 'fun',
        /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
        async execute(interaction, client) {

        const { options } = interaction
        const text = options.getString("text")
        const language = options.getString("language")

        switch (language) {
            case "english": {
                const translated = await translate(text, { to: 'en' })
                send_translated(text, translated.text, interaction, client, "English")
            }
            break;

            case "german": {
                const translated = await translate(text, { to: 'de' })
                send_translated(text, translated.text, interaction, client, "German")
            }
            break;

            case "french": {
                const translated = await translate(text, { to: 'fr' })
                send_translated(text, translated.text, interaction, client, "French")
            }
            break;

            case "russian": {
                const translated = await translate(text, { to: 'ru' })
                send_translated(text, translated.text, interaction, client, "Russian")
            }
            break;

            case "portuguese": {
                const translated = await translate(text, { to: 'pt' });
                send_translated(text, translated.text, interaction, client, "Portuguese")
            } break;

            case "turkish": {
                const translated = await translate(text, { to: 'tr' });
                send_translated(text, translated.text, interaction, client, "Turkish")
            } break;

            case "japanese": {
                const translated = await translate(text, { to: 'ja' });
                send_translated(text, translated.text, interaction, client, "Japanese")
            } break;

            case "greek": {
                const translated = await translate(text, { to: 'el' });
                send_translated(text, translated.text, interaction, client, "Greek")
            } break;
        }
    }
}

function send_translated(text, translated, interaction, client, language) {
    const Response = new EmbedBuilder()
    .setColor(client.color)
    .setTitle("🌍 Translator")
    .addFields(
        { name: "Language", value: language, inline: false },
        { name: "Message:", value: text, inline: true},
        { name: "Translated:", value: translated, inline: true}
    ).setFooter({text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.user.displayAvatarURL()})

    interaction.channel.send({ embeds: [Response] })
    interaction.reply({content: "Successfully translated message!", ephemeral: true})
}