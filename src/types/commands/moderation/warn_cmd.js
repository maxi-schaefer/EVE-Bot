const { Client, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const warnDB = require('../../../models/WarnSystem')
const { addInteractionPoints, removeInteractionPoints } = require('../../../utils/warnpoints')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user!")
    /* Add */
    .addSubcommand(
        command =>
        command.setName("add")
        .setDescription("Add warn points to specific user!")
        .addUserOption(
            option =>
            option.setName("user")
            .setDescription("The user you want to add warn points!")
            .setRequired(true))
        .addStringOption(
            option =>
            option.setName("reason")
            .setDescription("The reason you want to add warn points!")
            .setRequired(false)))
    /* Remove */
    .addSubcommand(
        command =>
        command.setName("remove")
        .setDescription("Remove warn points from specific user!")
        .addUserOption(
            option =>
            option.setName("user")
            .setDescription("The user you want to add warn points!")
            .setRequired(true))
        .addNumberOption(
            option =>
            option.setName("points")
            .setDescription("How many points you want to remove!")
            .setRequired(true))
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Target = options.getMember("user");
        const Sub = options.getSubcommand();

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp(Date.now())

        switch (Sub) {
            case "add": {
                const reason = options.getString("reason") || "No Reason given!"

                addInteractionPoints(1, interaction, reason, Target, client);
            } break;

            case "remove": {
                const points = options.getNumber("points");
                removeInteractionPoints(points, interaction, Target, client);
            } break;
        }
    }
}