const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');

const db = require('../../../models/ConfessionSystem')
const settingsDB = require('../../../models/ConfessionSettings')
const featuresDB = require('../../../models/Features')

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
            option.setName('confession-id')
            .setDescription('Message ID of your confession')
            .setRequired(true))
    ).addSubcommand(
        command =>
        command.setName('edit')
        .setDescription('Edit your confession')
        .addStringOption(
            option =>
            option.setName('confession-id')
            .setDescription('ID of your confession')
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
        const message_id = options.getString('confession-id')
        const id = Math.floor(Math.random() * 99999999) + 10000000;

        featuresDB.findOne({ GuildID: guild.id }, async (err, data) => {
            if(err) throw err;
            if(!data) return interaction.reply({ content: `<@${guild.ownerId}> disabled the confession system!`, ephemeral: true });
            
            if(data.ConfessionSystem) {
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
                        .setFooter({ text: `🌸 Confession ID: ${id.toString()}` })
        
                        client.guilds.cache.forEach(guild_ => {
                            settingsDB.findOne({GuildID: guild_.id}, async (err, data) => {
                                if(err) throw err;
            
                                if(!data) return;
    
                                const channel = guild_.channels.cache.get(data.ChannelID)
                                channel.send({ embeds: [Response] }).then(async msg => {
                                    await db.findOneAndUpdate({ GuildID: guild_.id }, 
                                    { MessageID: msg.id, ConfessionID: id, MemberID: member.id, ChannelID: msg.channel.id }
                                        , { new: true, upsert: true })
                                })
                            });
                        })
        
                        interaction.reply({ content: '✅ Successfully sent confession!', ephemeral: true})
                    } break;
        
                    case "edit": {
                        
                        client.guilds.cache.forEach(guild_ => {
                            db.findOne({ GuildID: guild_.id, ConfessionID: message_id, MemberID: member.id}, (err, data) => {
                                if(err) throw err;
                                if(!data) return;
            
                                const channel = guild_.channels.cache.get(data.ChannelID)
                                channel.messages.fetch(data.MessageID).then(msg => {
                                    const Embed = msg.embeds[0]
                                    if(!Embed) return;
            
                                    Embed.fields[0] = { name: "Confession", value: `\`\`\`${confession}\`\`\`` }
                                    msg.edit({ embeds: [Embed] });
                                });
                            })
                        })

                        interaction.reply({ content: '✅ Edited Confession successfully!', ephemeral: true})
        
                    } break;
        
                    case "delete": {
        
                        client.guilds.cache.forEach(async guild_ => {
                            db.findOne({ GuildID: guild_.id, ConfessionID: message_id, MemberID: member.id}, async (err, data) => {
                                if(err) throw err;
                                if(!data) return;
            
                                const channel = guild_.channels.cache.get(data.ChannelID)
                                await channel.messages.fetch(data.MessageID)
                                .then(msg => msg.delete())
                                .finally(async () => {
                                    await db.findOneAndDelete({ GuildID: guild_.id, ConfessionID: message_id, MemberID: member.id})
                                })
    
                            })
                        })

                        interaction.reply({ content: '✅ Deleted Confession successfully!', ephemeral: true})
                    } break;
        
                }
            } else {
                return interaction.reply({ content: `<@${guild.ownerId}> disabled the confession system!`, ephemeral: true });
            }
        })
    }
}