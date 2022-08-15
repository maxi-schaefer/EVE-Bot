const { Client, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const warnDB = require('../../../models/WarnSystem')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("checkwarns")
    .setDescription("Check the Warn Points from any user in the server!")
    .addUserOption(
        option =>
        option.setName("user")
        .setDescription("The user you want to check.")
        .setRequired(true))
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

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp(Date.now())
        .setTitle(`${Target.displayName} infractions:`)

        let warns = warnDB.findOne({GuildID: interaction.guild.id, UserID: Target.id}, async(err, data) => {
            if(err) throw err;

            if(data) {
                let num = data.Warns;

                Response.setDescription(`${Target} has \`\`${num}\`\` warning ${num > 1 ? "points" : "point"}!`)
                return interaction.reply({embeds: [Response]});
            } else {
                Response.setDescription(`${Target} has \`0\` warning points!`)
                return interaction.reply({embeds: [Response]});
            }
        });
    }
}