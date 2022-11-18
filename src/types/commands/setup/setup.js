const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, ChannelType, PermissionFlagsBits, ButtonStyle, ButtonBuilder, AttachmentBuilder, ActionRowBuilder } = require('discord.js')

const welcomeDB = require('../../../models/WelcomeSystem')
const leaveDB = require('../../../models/LeaveSystem');
const featuresDB = require('../../../models/Features');
const voiceDB = require('../../../models/VoiceSystem')
const logsDB = require('../../../models/ModerationLogs')
const captchaDB = require('../../../models/CaptchaSystem')
const confessionDB = require('../../../models/ConfessionSettings');
const ticketDB = require('../../../models/TicketSystem');
const levelsDB = require('../../../models/LevelSystem')
const applicationsDB = require('../../../models/ApplicationSystem')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Create your own custom server!")
    .addSubcommand(
        command => 
        command.setName("features")
        .setDescription('Enable/Disable Features')
        .addStringOption(
            option =>
            option.setName("type")
            .setDescription("Provide a type")
            .addChoices(
                { name: "👋 Welcome Greetings", value: "wgreetings" },
                { name: "👋 Leave Greetings", value: "lgreetings" },
                { name: "📖 Logs", value: "logs" },
                { name: "🤖 Catpcha", value: "captcha" },
                { name: "📝 Confession", value: "confession" },
                { name: "🔒 Automod", value: "automod" },
                { name: "🥳 Level System", value: "levelsystem" },
            ).setRequired(true))
        .addStringOption(
            option =>
            option.setName("turn")
            .setDescription("Enable/Disable")
            .addChoices(
                { name: "🟢 ON", value: "on" },
                { name: "🔴 OFF", value: "off" },
            ).setRequired(true))
    )
    .addSubcommand(
        command =>
        command.setName('application')
        .setDescription('Setup your application Channel')
        .addChannelOption(
            option =>
            option.setName('channel')
            .setDescription('Channel for the applications')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand(
        command => 
        command.setName('levels')
        .setDescription('Configure your level System')
        .addChannelOption(
            option => 
            option.setName('channel')
            .setDescription('Channel for level up announcement')
            .addChannelTypes(ChannelType.GuildText)
        ).addStringOption(
            option =>
            option.setName('message')
            .setDescription('lvl up Message, {level} = new level, {user} = User!')
            .setMinLength(1)
        ).addBooleanOption(
            option =>
            option.setName('embed')
            .setDescription('Level up Message as Embed or not!')
        )
    )
    .addSubcommand(
        command =>
        command.setName('ticket')
        .setDescription('Setup a ticket channel')
        .addChannelOption(
            option =>
            option.setName('category')
            .setDescription('Ticket Category')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true))
        .addChannelOption(
            option =>
            option.setName('channel')
            .setDescription('Ticket Channel')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true))
        .addRoleOption(
            option =>
            option.setName('role')
            .setDescription('Staff notification role!')
        ).addStringOption(
            option =>
            option.setName('message')
            .setDescription('Use a custom message in the ticket Embed!')
            .setMinLength(1)
        ).addStringOption(
            option =>
            option.setName('button-message')
            .setDescription('Use a custom message in the ticket Button!')
            .setMinLength(1)
        )
    )
    .addSubcommand(
        command =>
        command.setName('confession')
        .setDescription('Setup the confession system')
        .addChannelOption(
            option =>
            option.setName('channel')
            .setDescription('The channel you want your confessions to appear')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)))
    .addSubcommand(
        command => 
        command.setName("welcome")
        .setDescription("Setup your welcome role and channel")
        .addChannelOption(
            option =>
            option.setName("channel")
            .setDescription("Choose a channel for welcome messages!")
            .addChannelTypes(ChannelType.GuildText))
        .addRoleOption(
            option => 
            option.setName("role")
            .setDescription("Choose a auto Role! (Now working if captcha is enabled!)"))
        .addStringOption(
            option =>
            option.setName('message')
            .setDescription("Variables: {user} = User, {server} = Server Name")
        ))
    .addSubcommand(
        command =>
        command.setName("captcha")
        .setDescription("Setup captcha configuration")
        .addRoleOption(
            option =>
            option.setName("role")
            .setDescription("The role a verified user gets!")
            .setRequired(true))
        .addChannelOption(
            option => 
            option.setName("channel")
            .setDescription("There is a message coming...")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        ))
    .addSubcommand(
        command => 
        command.setName("leave")
        .setDescription("Setup your leave channel")
        .addChannelOption(
            option =>
            option.setName("channel")
            .setDescription("Choose a channel for leave messages!")
            .addChannelTypes(ChannelType.GuildText))
        .addStringOption(
            option =>
            option.setName('message')
            .setDescription("Variables: {user} = User, {server} = Server Name")
        ))
    .addSubcommand(
        command =>
        command.setName("logs")
        .setDescription("Setup logs configuration")
        .addChannelOption(
            channel =>
            channel.setName("channel")
            .setDescription("The log Channel!")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
    ))
    .addSubcommand(
        command =>
        command.setName("voice")
        .setDescription("Setup a join-to-create Channel")
        .addChannelOption(
            channel =>
            channel.setName("channel")
            .setDescription("The join to create Channel!")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)))
    .addSubcommand(
        command => 
        command.setName("remove")
        .setDescription("Remove settings")
        .addStringOption(
            option =>
            option.setName("settings")
            .setDescription("The settings you want to remove!")
            .addChoices(
                { name: '👋 Welcome Greetings', value: 'wgreetings' },
                { name: '👋 Leave Greetings', value: 'lgreetings' },
                { name: '🔊 Voice', value: 'voice' },
                { name: '📕 Logs', value: 'logs' },
                { name: '🤖 Captcha', value: 'captcha' },
                { name: '📝 Confession', value: 'confession' },
                { name: '📩 Ticket', value: 'ticket' },
                { name: "🥳 Level System", value: "levelsystem" },
            ).setRequired(true)
        ))
    .addSubcommand(
        command => 
        command.setName('info')
        .setDescription("See what features are enabled!"))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild } = interaction;

        const subs = options.getSubcommand()
        const channel = options.getChannel("channel")
        const role = options.getRole("role")
        const settings = options.getString('settings')
        const greetings_message = options.getString('message')
        const message = options.getString('message');
        const button_message = options.getString('button-message')
        const embed = options.getBoolean('embed');
        const category = options.getChannel('category')

        const Response = new EmbedBuilder()
        .setTitle("⚙️ Setup")
        .setTimestamp(Date.now())
        .setFooter({text: `${client.user.username} © 2022`})
        .setColor(client.color)

        switch(subs) {
            
            /* Welcome Settings */
            case "welcome": {
                
                if (channel) {
                    await welcomeDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { ChannelID: channel.id },
                        { new: true, upsert: true }
                    );

                    Response.setDescription(`✅ Successfully set Welcome Channel to ${channel}!`);
                }

                if (role) {
                    await welcomeDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { RoleID: role.id },
                        { new: true, upsert: true }
                    );

                    Response.setDescription(`✅ Successfully set Autorole to ${role}!`);
                }

                if(greetings_message) {
                    await welcomeDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { Message: greetings_message },
                        { new: true, upsert: true }
                    );

                    Response.setDescription(`✅ Successfully set Message to ${greetings_message.replace("{user}", interaction.member).replace("{server}", interaction.guild.name)}!`);
                }

                if (channel && role) {
                    await welcomeDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { RoleID: role.id, ChannelID: channel.id },
                        { new: true, upsert: true }
                    );

                    Response.setDescription(`✅ Successfully set Autorole to ${role} and Welcome Channel to ${channel}!`);
                }

                return interaction.reply({embeds: [Response]}).then(msg => {
                    setTimeout(() => {
                        msg.interaction.deleteReply()
                    }, 10*1000);
                })
            }

            /* Feature Settings */
            case "features": {
                const type = options.getString("type");
                const turn = options.getString("turn");

                switch(turn) {
            
                    case "on": {
        
                        switch (type) {
                            
                            /* Welcome Greetings */
                            case "wgreetings": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Welcome: true }, { new: true, upsert: true });
        
                                Response.setDescription("🟢 Turned Welcome Greetings ``ON``")
                                return interaction.reply({embeds: [Response], ephemeral: true})
                            } break;
        
                            /* Leave Greetings */
                            case "lgreetings": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Leave: true }, { new: true, upsert: true });
        
                                Response.setDescription("🟢 Turned Leave Greetings ``ON``")
                                return interaction.reply({embeds: [Response], ephemeral: true})
                            } break;
        
                            /* Logs */
                            case "logs": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Logs: true }, { new: true, upsert: true });
        
                                Response.setDescription("🟢 Turned Logs ``ON``")
                                return interaction.reply({embeds: [Response], ephemeral: true})
                            } break;
        
                            /* Captcha */
                            case "captcha": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { CaptchaSystem: true }, { new: true, upsert: true });
        
                                Response.setDescription("🟢 Turned Captcha ``ON``")
                                return interaction.reply({embeds: [Response], ephemeral: true})
                            } break;

                            /* Level System */
                            case "levelsystem": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { LevelSystem: true }, { new: true, upsert: true });
        
                                Response.setDescription("🟢 Turned Level System ``ON``")
                                return interaction.reply({embeds: [Response], ephemeral: true})
                            } break;

                            /* ConfessionSystem */
                            case "confession": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { ConfessionSystem: true }, { new: true, upsert: true });

                                Response.setDescription("🟢 Turned Confession ``ON``")
                                return interaction.reply({embeds: [Response], ephemeral: true})
                            }

                            /* Automod */
                            case "automod": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { AutoModSystem: true }, { new: true, upsert: true });
        
                                Response.setDescription("🟢 Turned Automoderation ``ON``")
                                return interaction.reply({embeds: [Response], ephemeral: true})
                            } break;
        
                        }
        
                    } break;
        
                    case "off": {
                        
                        switch (type) {
                            
                            /* Welcome Greetings */
                            case "wgreetings": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Welcome: false }, { new: true, upsert: true });
        
                                Response.setDescription("🔴 Turned Welcome Greetings ``OFF``")
                                return interaction.reply({embeds: [Response]})
                            } break;
        
                            /* Leave Greetings */
                            case "lgreetings": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Leave: false }, { new: true, upsert: true });
        
                                Response.setDescription("🔴 Turned Leave Greetings ``OFF``")
                                return interaction.reply({embeds: [Response]})
                            } break;

                            /* Level System */
                            case "levelsystem": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { LevelSystem: false }, { new: true, upsert: true });
        
                                Response.setDescription("🔴 Turned Level System ``OFF``")
                                return interaction.reply({embeds: [Response], ephemeral: true})
                            } break;
        
                            /* Logs */
                            case "logs": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Logs: false }, { new: true, upsert: true });
        
                                Response.setDescription("🔴 Turned Logs ``OFF``")
                                return interaction.reply({embeds: [Response]})
                            } break;
                            
        
                            /* Captcha */
                            case "captcha": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { CaptchaSystem: false }, { new: true, upsert: true });
        
                                Response.setDescription("🔴 Turned Captcha ``OFF``")
                                return interaction.reply({embeds: [Response]})
                            } break;

                            /* ConfessionSystem */
                            case "confession": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { ConfessionSystem: false }, { new: true, upsert: true });

                                Response.setDescription("🔴 Turned Confession ``OFF``")
                                return interaction.reply({embeds: [Response], ephemeral: true})
                            }

                            /* Automod */
                            case "automod": {
                                await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { AutoModSystem: false }, { new: true, upsert: true });
        
                                Response.setDescription("🔴 Turned Automoderation ``OFF``")
                                return interaction.reply({embeds: [Response], ephemeral: true})
                            } break;
                        }
        
                    } break;
        
                }

            } break;

            /* Application */
            case "application": {
                await applicationsDB.findOneAndUpdate(
                    { GuildID: guild.id },
                    { ChannelID: channel.id, Open: false },
                    { new: true, upsert: true }
                );

                Response.setDescription(`✅ Successfully set up the Application System!`)

                return interaction.reply({embeds: [Response], ephemeral: true});
            } break;

            /* LevelSystem Settings */
            case "levels": {
                if(channel) {
                    await levelsDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { ChannelID: channel.id },
                        { new: true, upsert: true }
                    )
                } 
                
                if(embed) {
                    await levelsDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { Embed: true },
                        { new: true, upsert: true }
                    )
                } else {
                    await levelsDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { Embed: false },
                        { new: true, upsert: true }
                    )
                }
                
                if(message) {
                    await levelsDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { Message: message },
                        { new: true, upsert: true }
                    )
                }

                Response.setDescription(`✅ Successfully set up the Level System!`)

                return interaction.reply({embeds: [Response], ephemeral: true});
            } break;

            /* Confession Settings */
            case "confession": {
                await confessionDB.findOneAndUpdate(
                    {GuildID: guild.id},
                    {ChannelID: channel.id},
                    {new: true, upsert: true})

                Response.setDescription(`✅ Successfully set the confession channel to: ${channel}`)

                return interaction.reply({embeds: [Response], ephemeral: true});
            }

            /* Log Settings */
            case "logs": {

                await logsDB.findOneAndUpdate(
                    {GuildID: guild.id},
                    {ChannelID: channel.id},
                    {new: true, upsert: true})

                Response.setDescription(`✅ Successfully set the logs channel to: ${channel}`)

                return interaction.reply({embeds: [Response]}).then(msg => {
                    setTimeout(() => {
                        msg.interaction.deleteReply()
                    }, 10*1000);
                })
            }

            /* Leave Settings */
            case "leave": {
                if (channel) {
                    await leaveDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { ChannelID: channel.id },
                        { new: true, upsert: true }
                    );

                    Response.setDescription(`✅ Successfully set Leave Channel to ${channel}!`);
                }

                if(greetings_message) {
                    await leaveDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { Message: greetings_message },
                        { new: true, upsert: true }
                    );

                    Response.setDescription(`✅ Successfully set Message to ${greetings_message.replace("{user}", interaction.member).replace("{server}", interaction.guild.name)}!`);
                }

                return interaction.reply({embeds: [Response]}).then(msg => {
                    setTimeout(() => {
                        msg.interaction.deleteReply()
                    }, 10*1000);
                })
            }

            /* Ticket System */
            case "ticket": {
                const button = new ButtonBuilder()
                .setCustomId('ticket-open')
                .setLabel('📩 Open a ticket!')
                .setStyle(ButtonStyle.Primary)

                const ticket_embed = new EmbedBuilder()
                .setTitle('✉️ Ticket System')
                .setDescription('Click on the button below to create a new ticket!')
                .setColor(client.color)
                .setTimestamp(Date.now())

                if(message) {
                    ticket_embed.setDescription(message);
                }

                if(button_message) {
                    button.setLabel(button_message);
                }

                if(role) {
                    ticketDB.findOne({ GuildID: guild.id }, async(err, data) => {
                        if(err) throw err;
                        if(!data) {
                            const ticketSchema = ticketDB.create({
                                GuildID: guild.id,
                                CategoryID: category.id,
                                ChannelID: channel.id,
                                RoleIDs: [role.id]
                            });
                            ticketSchema.save();
                        } else {
                            data.RoleIDs.push(role.id);
                            data.save();
                        }
                    })
                } else {
                    await ticketDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { CategoryID: category.id, ChannelID: channel.id },
                        { new: true, upsert: true }
                    )
                }

                channel.send({ embeds: [ticket_embed], components: [new ActionRowBuilder().addComponents(button)] })
                return interaction.reply({ embeds: [Response.setDescription('✅ Set up ticket system!')], ephemeral: true });
            } break;

            /* Captcha System */
            case "captcha": {
                const button = new ButtonBuilder()
                .setCustomId("captcha-btn")
                .setLabel("🤖 Verify")
                .setStyle(ButtonStyle.Primary);

                const captcha_embed = new EmbedBuilder()
                .setColor(client.color)
                .setTitle("🤖 Verification Required")
                .setDescription(`To gain access to \`${interaction.guild.name}\` you need to prove you are a human by completing a captcha. Click the button below to get started!`)

                const features_Check = await featuresDB.findOne({GuildID: guild.id})
                if(features_Check) {
                    const { CaptchaSystem } = features_Check;
                    if(CaptchaSystem) {
                        await captchaDB.findOneAndUpdate(
                            {GuildID: guild.id},
                            {Role: role.id},
                            {new: true, upsert: true})
        
                        Response.setDescription("✅ Successfully set up the captcha system!")
                        channel.send({embeds: [captcha_embed], components: [new ActionRowBuilder().addComponents(button)]});
                    } else {
                        Response.setDescription("❌ You need to enable the captcha system first!")
                    }
                } else {
                    Response.setDescription("❌ Enabled the captcha system with ``/setup features``!")
                }

                return interaction.reply({embeds: [Response]}).then(msg => {
                    setTimeout(() => {
                        msg.interaction.deleteReply()
                    }, 10*1000);
                })
            }

            /* Voice System */
            case "voice": {
                await voiceDB.findOneAndUpdate(
                    {GuildID: guild.id}, 
                    {ChannelID: channel.id},
                    {new: true, upsert: true})
                
                Response.setDescription(`✅ Successfully set up the voice system!\n**Join To Create:** ${channel}`);

                return interaction.reply({embeds: [Response]}).then(msg => {
                    setTimeout(() => {
                        msg.interaction.deleteReply()
                    }, 10*1000);
                })
            }

            /* Remove Settings */
            case 'remove': {
                switch(settings) {
                    
                    /* Welcome */
                    case 'wgreetings': {
                        await welcomeDB.findOneAndDelete({GuildID: guild.id});
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Welcome: false }, { new: true, upsert: true });

                        Response.setDescription(`🗑️ Successfully deleted Welcome Settings!`);
                    }
                    break;

                    /* Levels */
                    case "levelsystem": {
                        await levelsDB.findOneAndDelete({GuildID: guild.id});
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { LevelSystem: false }, { new: true, upsert: true });

                        Response.setDescription(`🗑️ Successfully deleted Level Settings!`);
                    } break;

                    /* Leave */
                    case 'lgreetings': {
                        await leaveDB.findOneAndDelete({GuildID: guild.id});
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Leave: false }, { new: true, upsert: true });

                        Response.setDescription(`🗑️ Successfully deleted Leave Settings!`);
                    }
                    break;

                    /* Voice */
                    case 'voice': {
                        await voiceDB.findOneAndDelete({GuildID: guild.id});

                        Response.setDescription(`🗑️ Successfully deleted Voice Settings!`);
                    } break;

                    /* Logs */
                    case 'logs': {
                        await logsDB.findOneAndDelete({GuildID: guild.id});
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { Logs: false }, { new: true, upsert: true });

                        Response.setDescription(`🗑️ Successfully deleted Log Settings!`);
                    } break;

                    /* Captcha */
                    case 'captcha': {
                        await captchaDB.findOneAndDelete({GuildID: guild.id});
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { CaptchaSystem: false }, { new: true, upsert: true });

                        Response.setDescription(`🗑️ Successfully deleted Captcha Settings!`);
                    } break;

                    /* Confession */
                    case 'confession': {
                        await confessionDB.findOneAndDelete({GuildID: guild.id});
                        await featuresDB.findOneAndUpdate({ GuildID: guild.id }, { ConfessionSystem: false }, { new: true, upsert: true });

                        Response.setDescription(`🗑️ Successfully deleted Confession Settings!`);
                    } break;

                    /* Ticket */
                    case 'ticket': {
                        await ticketDB.findOneAndDelete({GuildID: guild.id});

                        Response.setDescription(`🗑️ Successfully deleted the Ticket System!`);
                    } break;

                }

                return interaction.reply({embeds: [Response]})
            }

            /* Settings info */
            case 'info': {

                const status = new EmbedBuilder()
                .setTitle('💡 Info')
                .setColor(client.color)
                .setTimestamp(Date.now())
                .setDescription("**Variables for Welcome and Leave:**\n `{user}` `{server}` ")

                let welcomeStatus = '`🔴 OFF`';
                let leaveStatus = '`🔴 OFF`';
                let voiceStatus = '`🔴 OFF`'
                let logStatus = '`🔴 OFF`'
                let captchaStatus = '`🔴 OFF`'
                let confessionStatus = '`🔴 OFF`'
                let automodStatus = '`🔴 OFF`'
                let ticketStatus = '`🔴 OFF`'
                let levelStatus = '`🔴 OFF`'

                const voiceCheck = await voiceDB.findOne({GuildID: guild.id})
                if(voiceCheck) voiceStatus = '`🟢 On`'

                const ticketCheck = await ticketDB.findOne({GuildID: guild.id})
                if(ticketCheck) ticketStatus = '`🟢 On`'

                const featuresCheck = await featuresDB.findOne({GuildID: guild.id})
                if(featuresCheck) {
                    const { Welcome, Leave, Logs, CaptchaSystem, ConfessionSystem, AutoModSystem, LevelSystem } = featuresCheck;
                    if(Welcome) welcomeStatus = '`🟢 ON`';
                    if(Leave) leaveStatus = '`🟢 ON`';
                    if(Logs) logStatus = '`🟢 ON`'
                    if(CaptchaSystem) captchaStatus = '`🟢 ON`'
                    if(ConfessionSystem) confessionStatus = '`🟢 ON`'
                    if(AutoModSystem) automodStatus = '`🟢 ON`'
                    if(LevelSystem) levelStatus = '`🟢 ON`'
                }

                await status.addFields([
                    {name: '👋 Welcome Greetings', value: welcomeStatus, inline: true },
                    {name: '👋 Leave Greetings', value: leaveStatus, inline: true },
                    {name: '🔊 Voice', value: voiceStatus, inline: true },
                    {name: '📕 Logs', value: logStatus, inline: true },
                    {name: '🤖 Captcha', value: captchaStatus, inline: true },
                    {name: '📝 Confession', value: confessionStatus, inline: true },
                    {name: '🔒 Automod', value: automodStatus, inline: true },
                    {name: '📩 Tickets', value: ticketStatus, inline: true },
                    {name: '🥳 Level System', value: levelStatus, inline: true },
                ])

                return interaction.reply({embeds: [status]})
            }
        }
    }
}