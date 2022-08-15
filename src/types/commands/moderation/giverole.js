const { Client, SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('giverole')
    .setDescription('Give a member a new role.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(
        option =>
        option.setName('role')
        .setDescription('Provide a role')
        .setRequired(true))
    .addUserOption(
        option => 
        option.setName('user')
        .setDescription('User you want to add the role')
        .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */    
    async execute(interaction, client) {
        const { options, member } = interaction;

        const role = options.getRole('role');
        const user = options.getMember('user');

        const Response = new EmbedBuilder()
        .setTitle('🪄 Role')
        .setColor(client.color)
        .setTimestamp(Date.now());

        if(member.roles.highest.position < role.position) {
            return interaction.reply({embeds: [Response.setColor('Red').setDescription('❌ You do not have permission to give this role!')]});
        }

        try {
            user.roles.add(role)   
        } catch (error) {
            return;
        }

        return interaction.reply({embeds: [Response.setDescription(`Added ${role} to ${user}'s roles!`)]});
        
    }
}