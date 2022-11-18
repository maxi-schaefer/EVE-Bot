const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('botupdate')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Create a new Update Message for your Bot!')
    .addStringOption(
        option =>
        option.setName('update')
        .setDescription('Provide a Update Message')
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName('preview')
        .setDescription('Add a picture link!')
    ),
    category: 'developer',
    developer: true,
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const update = options.getString('update')
        const preview = options.getString('preview')

        const button = new ButtonBuilder()
        .setLabel("Support Server")
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.supportServer)

        const UpdateEmbed = new EmbedBuilder()
        .setTitle('📢 Bot Update')
        .setFooter({text: `Creator ${interaction.member.user.tag}`, iconURL: interaction.member.user.displayAvatarURL()})
        .setDescription(`**Changelog**: \n${update}`)
        .setTimestamp(Date.now())
        .setColor(client.color)

        if(preview) {
            if(isValidHttpUrl(preview)) UpdateEmbed.setImage(preview)
            else return;
        }

        const guilds = client.guilds.cache
        guilds.forEach(guild => {
            const systemChannel = guild.systemChannel
            if(systemChannel) {
                systemChannel.send({embeds: [UpdateEmbed], components: [new ActionRowBuilder().addComponents(button)]}).catch()
            } else {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`❌ ${guild.name} does not have an System Channel!`)
                        .setColor(client.color)
                    ]
                })
            }
        })

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`✅ Successfully sent Update to ${client.guilds.cache.size} server!`)
                .setColor(client.color)
            ]
        })
    }
}

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false
    }

    return url.protocol === "https:" || url.protocol === "http:";
}