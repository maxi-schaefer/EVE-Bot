const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Toggle Autoplay Modes."),
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

        const queue = await client.distube.getQueue(voiceChannel);
        if(!queue) return interaction.reply({content: '🛑 There is now queue', ephemeral: true})

        let mode = await queue.toggleAutoplay(voiceChannel);

        return interaction.reply({embeds: [Response.setDescription(`🔁 Autoplay Mode is set to: ${mode ? "ON" : "OFF"}`)], ephemeral: true})
    }
}