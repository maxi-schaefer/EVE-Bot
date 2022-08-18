const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, ChannelType, PermissionFlagsBits, ButtonStyle, ButtonBuilder, AttachmentBuilder, ActionRowBuilder } = require('discord.js')

const welcomeDB = require('../../../models/WelcomeSystem')
const leaveDB = require('../../../models/LeaveSystem');
const featuresDB = require('../../../models/Features');
const voiceDB = require('../../../models/VoiceSystem')
const logsDB = require('../../../models/ModerationLogs')
const captchaDB = require('../../../models/CaptchaSystem')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Create your own custom server!")
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

            /* Captcha System */
            case "captcha": {
                const button = new ButtonBuilder()
                .setCustomId("captcha-btn")
                .setLabel("🤖 I'm not a robot")
                .setStyle(ButtonStyle.Secondary);

                const captcha_embed = new EmbedBuilder()
                .setColor(client.color)
                .setTitle("🤖 Captcha")
                .setDescription("Please Click on `🤖 I'm not a robot` and solve the captcha within 30 seconds!")

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

                        Response.setDescription(`🗑️ Successfully deleted Welcome Settings!`);
                    }
                    break;

                    /* Leave */
                    case 'lgreetings': {
                        await leaveDB.findOneAndDelete({GuildID: guild.id});

                        Response.setDescription(`🗑️ Successfully deleted Leave Settings!`);
                    }
                    break;

                    case 'voice': {
                        await voiceDB.findOneAndDelete({GuildID: guild.id});

                        Response.setDescription(`🗑️ Successfully deleted Voice Settings!`);
                    }

                }

                return interaction.reply({embeds: [Response]}).then(msg => {
                    setTimeout(() => {
                        msg.interaction.deleteReply()
                    }, 5*1000);
                })
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

                const voiceCheck = await voiceDB.findOne({GuildID: guild.id})
                if(voiceCheck) voiceStatus = '`🟢 On`'

                const featuresCheck = await featuresDB.findOne({GuildID: guild.id})
                if(featuresCheck) {
                    const { Welcome, Leave, Logs, CaptchaSystem } = featuresCheck;
                    if(Welcome) welcomeStatus = '`🟢 ON`';
                    if(Leave) leaveStatus = '`🟢 ON`';
                    if(Logs) logStatus = '`🟢 ON`'
                    if(CaptchaSystem) captchaStatus = '`🟢 ON`'
                }

                await status.addFields([
                    {name: '👋 Welcome Greetings', value: welcomeStatus, inline: true },
                    {name: '👋 Leave Greetings', value: leaveStatus, inline: true },
                    {name: '🔊 Voice', value: voiceStatus, inline: true },
                    {name: '📕 Logs', value: logStatus, inline: true },
                    {name: '🤖 Captcha', value: captchaStatus, inline: true },
                ])

                return interaction.reply({embeds: [status]})
            }
        }
    }
}