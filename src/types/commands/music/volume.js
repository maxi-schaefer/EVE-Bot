const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Alter the volume.")
    .addNumberOption(
        option =>
        option.setName("percent")
        .setDescription("10 = 10%")
        .setRequired(true)
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { options, member, channel, guild } = interaction;
        const voiceChannel = member.voice.channel;

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTitle("🎸 Music")
        .setTimestamp(Date.now())

        if(!voiceChannel) return interaction.reply({embeds: [Response.setDescription("❌ You must be in a voice channel to be able to use this command.")], ephemeral: true})
        const security = guild.channels.cache.filter(chnl => (chnl.type == ChannelType.GuildVoice)).find(channel => (channel.members.has(client.user.id)))
        if(security && voiceChannel.id !== security.id) return interaction.reply({embeds: [Response.setDescription(`❌ I'm already playing in <#${security.id}>`)], ephemeral: true})

        const Volume = options.getNumber("percent")
        if(Volume > 100 || Volume < 1) return interaction.reply({embeds: [Response.setDescription("You have to specify a number between 1 and 100")], ephemeral: true});

        client.distube.setVolume(voiceChannel, Volume)
        return interaction.reply({embeds: [Response.setDescription(`🔊 Volume has been set to \`${Volume}%\``)]})
    }
}