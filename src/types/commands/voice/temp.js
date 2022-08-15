const { Client, EmbedBuilder, SlashCommandBuilder, CommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('temp')
    .setDescription('Control your own temporary channel.')
    .setDMPermission(false)
    .addSubcommand(subcommand => 
        subcommand
        .setName("invite")
        .setDescription("Invite a friend to your channel.")
        .addUserOption(option => 
            option.setName("member").setDescription("Select a member you wanna add.").setRequired(true))
    )
    .addSubcommand(subcommand => 
        subcommand
        .setName("disallow")
        .setDescription("Remove someone's access to the channel.")
        .addUserOption(option => 
            option.setName("member")
            .setDescription("Select a member you wanna remove the access.")
            .setRequired(true))
    )
    .addSubcommand(subcommand => 
        subcommand
        .setName("name")
        .setDescription("Change the name of your channel")
        .addStringOption(option => 
            option.setName("text")
            .setDescription("Provide the name.")
            .setRequired(true))
    )
    .addSubcommand(subcommand => 
        subcommand
        .setName("public")
        .setDescription("Make your channel public to everyone.")
        .addStringOption(option => 
            option.setName("turn")
            .setDescription("Turn on or off.")
            .setRequired(true)
            .addChoices(
                {name: "on", value: "on"},
                {name: "off", value: "off"}
    ))),
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
     async execute(interaction, client) {
        const { options, member, guild } = interaction;

        const subCommand = options.getSubcommand();
        const voiceChannel = member.voice.channel;
        const Embed = new EmbedBuilder().setTitle("🔊 Voice System").setColor(client.color).setTimestamp(Date.now());
        const ownedChannel = client.voiceGenerator.get(member.id);

        if(!voiceChannel) 
            return interaction.reply({embeds: [Embed.setDescription("🔇 You are currently not in a voice channel.").setColor('Red')], ephemeral: true});
        
        if(!ownedChannel || voiceChannel.id !== ownedChannel) 
            return interaction.reply({embeds: [Embed.setDescription("❌ You do not own this channel!").setColor('Red')], ephemeral: true})

        switch(subCommand) {
            case "name": {
                const newName = options.getString("text");
                if(newName.length > 22 || newName.length < 1)
                    return interaction.reply({embeds: [Embed.setDescription("❌ Name cannot exceed the 22 character limit").setColor('Red')], ephemeral: true})

                voiceChannel.edit({name: newName});
                interaction.reply({embeds: [Embed.setDescription(`📝 Channel name has been set to ${newName}!`)], ephemeral: true})
            }
            break;

            case "invite": {
                const targetMember = options.getMember('member');
                voiceChannel.permissionOverwrites.edit(targetMember, {Connect: true});
                const sendEmbed = new EmbedBuilder().setTitle("🔊 Voice System").setColor(client.color).setDescription(`👋 <@${member.id}> has invited you to <#${voiceChannel.id}>`)

                targetMember.send({embeds: [sendEmbed]}).catch(() => {})
                interaction.reply({embeds: [Embed.setDescription(`📨 ${targetMember} has been successfully invited!`)], ephemeral: true})
            }
            break;

            case "disallow": {
                const targetMember = options.getMember('member');
                voiceChannel.permissionOverwrites.edit(targetMember, {Connect: false})

                if(targetMember.voice.channel && targetMember.voice.channel.id == voiceChannel.id) targetMember.voice.setChannel(null);
                interaction.reply({embeds: [Embed.setDescription(`💢 ${targetMember} has been removed from your channel!`)], ephemeral: true})
            }
            break;

            case "public": {
                const turnChoice = options.getString("turn");

                switch(turnChoice) {
                    case "on": {
                        voiceChannel.permissionOverwrites.edit(guild.id, {Connect: true})
                        interaction.reply({embeds: [Embed.setDescription("🔓 Your channel is now public.")], ephemeral: true})
                    }
                    break;

                    case "off": {
                        voiceChannel.permissionOverwrites.edit(guild.id, {Connect: false})
                        interaction.reply({embeds: [Embed.setDescription("🔒 Your channel is now private.")], ephemeral: true})
                    }
                    break;
                }
            }
            break;
        }
    }
}