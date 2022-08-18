const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js')
const featuresDB = require('../../../models/Features');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("features")
    .setDescription("Enable or Disable features for your server!")
    .addStringOption(
        option =>
        option.setName("type")
        .setDescription("Provide a type")
        .addChoices(
            { name: "👋 Welcome Greetings", value: "wgreetings" },
            { name: "👋 Leave Greetings", value: "lgreetings" },
            { name: "📖 Logs", value: "logs" },
            { name: "🤖 Catpcha", value: "captcha" },
        ).setRequired(true))
    .addStringOption(
        option =>
        option.setName("turn")
        .setDescription("Enable/Disable")
        .addChoices(
            { name: "🟢 ON", value: "on" },
            { name: "🔴 OFF", value: "off" },
        ).setRequired(true))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */    
    async execute(interaction, client) {
        const { options, guild } = interaction;

        const type = options.getString("type");
        const turn = options.getString("turn");

        const Response = new EmbedBuilder()
        .setTitle("🐦 Features")
        .setColor(client.color)
        .setTimestamp(Date.now());

        switch(turn) {
            
            case "on": {

                switch (type) {
                    
                    /* Welcome Greetings */
                    case "wgreetings": {
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Welcome: true }, { new: true, upsert: true });

                        Response.setDescription("🟢 Turned Welcome Greetings ``ON``")
                        return interaction.reply({embeds: [Response]})
                    } break;

                    /* Leave Greetings */
                    case "lgreetings": {
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Leave: true }, { new: true, upsert: true });

                        Response.setDescription("🟢 Turned Leave Greetings ``ON``")
                        return interaction.reply({embeds: [Response]})
                    } break;

                    /* Logs */
                    case "logs": {
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Logs: true }, { new: true, upsert: true });

                        Response.setDescription("🟢 Turned Logs ``ON``")
                        return interaction.reply({embeds: [Response]})
                    } break;

                    /* Captcha */
                    case "captcha": {
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { CaptchaSystem: true }, { new: true, upsert: true });

                        Response.setDescription("🟢 Turned Captcha ``ON``")
                        return interaction.reply({embeds: [Response]})
                    } break;

                }

            } break;

            case "off": {
                
                switch (type) {
                    
                    /* Welcome Greetings */
                    case "wgreetings": {
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Welcome: false }, { new: true, upsert: true });

                        Response.setDescription("🔴 Turned Welcome Greetings ``OFF``")
                        return interaction.reply({embeds: [Response]})
                    } break;

                    /* Leave Greetings */
                    case "lgreetings": {
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Leave: false }, { new: true, upsert: true });

                        Response.setDescription("🔴 Turned Leave Greetings ``OFF``")
                        return interaction.reply({embeds: [Response]})
                    } break;

                    /* Logs */
                    case "logs": {
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Logs: false }, { new: true, upsert: true });

                        Response.setDescription("🔴 Turned Logs ``OFF``")
                        return interaction.reply({embeds: [Response]})
                    } break;
                    

                    /* Captcha */
                    case "captcha": {
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { CaptchaSystem: false }, { new: true, upsert: true });

                        Response.setDescription("🔴 Turned Captcha ``OFF``")
                        return interaction.reply({embeds: [Response]})
                    } break;
                }

            } break;

        }
    }
}