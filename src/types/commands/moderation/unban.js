const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban an ID stated.')
    .addStringOption(
        option =>
        option.setName('target')
        .setDescription('The user id you would like to unban.')
        .setRequired(true)
    )
    .addStringOption(
        option =>
        option.setName('reason')
        .setDescription('Provide a reason'))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const userID = options.getString('target');
        const reason = options.getString('reason') || "No reason given";

        await interaction.guild.bans.fetch()
        .then(async bans => {
            if(bans.size == 0) return await interaction.reply({ content: '❎ There is nobody banned from this server!', ephemeral: true });
            let bannedID = bans.find(ban => ban.user.id === userID);

            if(!bannedID) return await interaction.reply({ content: '❎ The ID stated is not banned from this server!', ephemeral: true });

            await interaction.guild.bans.remove(userID, reason).catch(err => console.log(err));
            await interaction.reply({ embeds: [
                new EmbedBuilder()
                .setTitle('✅ Unbanned')
                .setDescription(`Unbanned <@${userID}> successfully!`)
                .setTimestamp(Date.now())
                .setColor(client.color)
            ]})
            .catch(err => console.log(err));
        })


    }
}