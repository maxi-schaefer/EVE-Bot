const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, PermissionFlagsBits, BitField, PermissionsBitField, ChannelType, Embed } = require('discord.js')
const MuteDB = require('../../../models/MuteSystem');
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a specific member.")
    .addUserOption(
        option => 
        option.setName("user")
        .setDescription("The User you want to mute!")
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName("reason")
        .setDescription("Provide a reason")
        .setRequired(true))
    .addStringOption(
        option => 
        option.setName("duration")
        .setDescription("Select a duration")
        .setRequired(true)
        .addChoices(
            { name: "10 seconds", value: "10s" },
            { name: "30 minutes", value: "30m" },
            { name: "1 hour", value: "1h" },
            { name: "3 hours", value: "3h" },
            { name: "1 day", value: "1d" },
        ))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild, member } = interaction;

        const Target = options.getMember("user");
        const Reason = options.getString("reason");
        const Duration = options.getString("duration");

        let mutedRole = guild.roles.cache.find(role => role.name === "muted");

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({name: "🔈 Mute System", iconURL: guild.iconURL()})
        .setTimestamp(Date.now())

        if(!mutedRole) {
            guild.roles.create({
                name: "muted",
                mentionable: false,
                reason: "This role is needed",
                permissions: []
            }).then(async role => {
                const channels = await guild.channels.cache;
                channels.forEach(channel => {
                    channel.permissionOverwrites.edit(role.id, { SendMessages: false, Connect: false })
                })

                const muteRole = role;

                if(Target.id == member.id) return interaction.reply({embeds: [Response.setDescription('🛑 You cannot mute yourself.')]});
            if(Target.roles.highest.position > member.roles.highest.position) return interaction.reply({embeds: [Response.setDescription('🛑 You cannot mute someone with a superior role than you.')]});
    
            MuteDB.findOne({ GuildID: guild.id, UserID: Target.id } , async (err, data) => {
                 if(err) throw err;
    
                 if(!data) {
                    data = new MuteDB({
                        GuildID: guild.id,
                        UserID: Target.id,
                        Data: [
                            {
                                ExecuterID: member.id,
                                ExecuterTag: member.user.tag,
                                TargetID: Target.id,
                                TargetTag: Target.user.tag,
                                Reason: Reason,
                                Duration: Duration,
                                Date: parseInt(interaction.createdTimestamp / 1000)
                            }
                        ]
                    })
                } else {
                    const newMuteObject = {
                        ExecuterID: member.id,
                        ExecuterTag: member.user.tag,
                        TargetID: Target.id,
                        TargetTag: Target.user.tag,
                        Reason: Reason,
                        Duration: Duration,
                        Date: parseInt(interaction.createdTimestamp / 1000)
                    }
    
                    data.Data.push(newMuteObject)
                }
    
                data.save();
            })
    
            Target.send({embeds: [new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({name: "🔈 Mute System", iconURL: guild.iconURL()})
            .setDescription(`You have been muted by ${member} in **${guild.name}**\n**Reason:** ${Reason}\n**Duration:** ${Duration}`)
        ]}).catch(() => { console.log(`Could not send the mute notice to ${Target.user.tag}.`)})
        
            Response.setDescription(`Member: ${Target} | \`${Target.id}\` has been **muted**\nStaff: ${member} | \`${member.id}\`\nDuration: \`${Duration}\`\nReason: \`${Reason}\` `)
            interaction.reply({embeds: [Response]});
    
            Target.roles.add(muteRole.id)
            setTimeout(async () => {
                if(!Target.roles.cache.has(muteRole.id)) return;
                await Target.roles.remove(muteRole.id);
            }, ms(Duration))
            })
        } else {
            if(Target.id == member.id) return interaction.reply({embeds: [Response.setDescription('🛑 You cannot mute yourself.')]});
            if(Target.roles.highest.position > member.roles.highest.position) return interaction.reply({embeds: [Response.setDescription('🛑 You cannot mute someone with a superior role than you.')]});
    
            MuteDB.findOne({ GuildID: guild.id, UserID: Target.id } , async (err, data) => {
                 if(err) throw err;
    
                 if(!data) {
                    data = new MuteDB({
                        GuildID: guild.id,
                        UserID: Target.id,
                        Data: [
                            {
                                ExecuterID: member.id,
                                ExecuterTag: member.user.tag,
                                TargetID: Target.id,
                                TargetTag: Target.user.tag,
                                Reason: Reason,
                                Duration: Duration,
                                Date: parseInt(interaction.createdTimestamp / 1000)
                            }
                        ]
                    })
                } else {
                    const newMuteObject = {
                        ExecuterID: member.id,
                        ExecuterTag: member.user.tag,
                        TargetID: Target.id,
                        TargetTag: Target.user.tag,
                        Reason: Reason,
                        Duration: Duration,
                        Date: parseInt(interaction.createdTimestamp / 1000)
                    }
    
                    data.Data.push(newMuteObject)
                }
    
                data.save();
            })
    
            Target.send({embeds: [new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({name: "🔈 Mute System", iconURL: guild.iconURL()})
            .setDescription(`You have been muted taped by ${member} in **${guild.name}**\n**Reason:** ${Reason}\n**Duration:** ${Duration}`)
        ]}).catch(() => { console.log(`Could not send the mute notice to ${Target.user.tag}.`)})
        
            Response.setDescription(`Member: ${Target} | \`${Target.id}\` has been **muted**\nStaff: ${member} | \`${member.id}\`\nDuration: \`${Duration}\`\nReason: \`${Reason}\` `)
            interaction.reply({embeds: [Response]});
    
            Target.roles.add(mutedRole.id)
            setTimeout(async () => {
                if(!Target.roles.cache.has(mutedRole.id)) return;
                await Target.roles.remove(mutedRole.id);
            }, ms(Duration))
        }
    }    
}