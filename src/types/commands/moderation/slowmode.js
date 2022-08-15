const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Enable or disable slowmode in a Channel!")
    .addStringOption(
        option =>
        option.setName("time")
        .setDescription("Slowmode time!")
        .addChoices(
            { name: "remove", value: "remove" },
            { name: "10 seconds", value: "10" },
            { name: "20 seconds", value: "20" },
            { name: "30 seconds", value: "30" },
            { name: "1 minute", value: "60" },
            { name: "5 minutes", value: "300" }
    ).setRequired(true))
    .addChannelOption(
        option =>
        option.setName("channel")
        .setDescription("The Channel you want to enable/disable slowmode!")
        .addChannelTypes(ChannelType.GuildText))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, channel } = interaction;

        const options_channel = options.getChannel("channel");
        const time = options.getString("time")
        
        const Response = new EmbedBuilder()
        .setTitle("🦥 Slowmode")
        .setColor(client.color)
        .setTimestamp(Date.now());
        
        if(options_channel) {
            if(time == "remove") {
                options_channel.setRateLimitPerUser(0);

                Response.setDescription(`Removed Slowmode from ${options_channel}`);

                return interaction.reply({embeds: [Response]});
            } else {
                options_channel.setRateLimitPerUser(parseInt(time));

                Response.setDescription(`Added Slowmode to ${options_channel}\n**Time:** \`${time}s\` `);

                return interaction.reply({embeds: [Response]});
            }
        } else {
            if(time == "remove") {
                channel.setRateLimitPerUser(0);

                Response.setDescription(`Removed Slowmode from ${channel}`);

                return interaction.reply({embeds: [Response]});
            } else {
                channel.setRateLimitPerUser(parseInt(time));

                Response.setDescription(`Added Slowmode to ${channel}\n**Time:** \`${time}s\` `);

                return interaction.reply({embeds: [Response]});
            }
        }

    }
}