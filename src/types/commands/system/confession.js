const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const ms = require('ms');
const db = require('../../../models/ConfessionSystem')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('confession')
    .setDescription('Create or edit a confession')
    .addSubcommand(
        command => 
        command.setName('send')
        .setDescription('Create a new confession')
        .addUserOption(
            option =>
            option.setName('to')
            .setDescription('Confess to a user')
            .setRequired(true))
        .addStringOption(
            option => 
            option.setName('confession')
            .setDescription('Describe your confession')
            .setRequired(true))
        .addStringOption(
            option =>
            option.setName('anonym')
            .setDescription('Send your confession anonym')
            .addChoices(
                { name: '✅ Yes', value: 'yes'},
                { name: '❎ No', value: 'no'}
            ).setRequired(true)))
    .addSubcommand(
        command =>
        command.setName('delete')
        .setDescription('Delete your confession')
        .addStringOption(
            option =>
            option.setName('message-id')
            .setDescription('Message ID of your confession')
            .setRequired(true))
    ).addSubcommand(
        command =>
        command.setName('edit')
        .setDescription('Edit your confession')
        .addStringOption(
            option =>
            option.setName('message-id')
            .setDescription('Message ID of your confession')
            .setRequired(true))
        .addStringOption(
            option =>
            option.setName('confession')
            .setDescription('Your new confession')
            .setRequired(true))
    )
    ,
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { options, member, guild } = interaction;

        const sub = options.getSubcommand();
        const target = options.getMember('to')
        const confession = options.getString('confession')
        const message_id = options.getString('message-id')

        switch(sub) {

            case "send": {
                
                const anonym = options.getString('anonym');
                const Response = new EmbedBuilder()
                .setColor(client.color)
                .setTimestamp(Date.now())
                .setTitle(`To ${target.user.tag}`)
                .setDescription(`From **${anonym == 'no' ? member.user.tag : 'Anonym' }**`)
                .addFields([
                    { name: 'Confession', value: `\`\`\`${confession}\`\`\`` }
                ])

                interaction.channel.send({ embeds: [Response] }).then(async msg => {
                    await db.create(
                        { GuildID: guild.id, 
                            ChannelID: msg.channel.id, 
                            MessageID: msg.id,
                            MemberID: interaction.member.id
                    });
                })

                interaction.reply({ content: 'Successfully sent confession!', ephemeral: true})
            } break;

            case "edit": {
                
                db.findOne({ GuildID: guild.id, MessageID: message_id, MemberID: member.id}, (err, data) => {
                    if(err) throw err;
                    if(!data) return interaction.reply({ content: '❎ You are not the owner of this confession', ephemeral: true});

                    const channel = guild.channels.cache.get(data.ChannelID)
                    channel.messages.fetch(data.MessageID).then(msg => {
                        const Embed = msg.embeds[0]
                        if(!Embed) return;

                        Embed.fields[0] = { name: "Confession", value: `\`\`\`${confession}\`\`\`` }
                        msg.edit({ embeds: [Embed] });
                    });

                    interaction.reply({ content: '✅ Edited Confession successfully!', ephemeral: true})
                })

            } break;

            case "delete": {

                db.findOne({ GuildID: guild.id, MessageID: message_id, MemberID: member.id}, (err, data) => {
                    if(err) throw err;
                    if(!data) return interaction.reply({ content: '❎ You are not the owner of this confession', ephemeral: true});

                    const channel = guild.channels.cache.get(data.ChannelID)
                    channel.messages.fetch(data.MessageID).then(msg => msg.delete());

                    interaction.reply({ content: '✅ Deleted Confession successfully!', ephemeral: true})
                })

                await db.findOneAndDelete({ GuildID: guild.id, MessageID: message_id, MemberID: member.id})
            } break;

        }

    }
}