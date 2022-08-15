const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("A complete giveaway system")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand(
        command => 
        command.setName('create')
        .setDescription('Create a giveaway')
        .addStringOption(
            option =>
            option.setName('duration')
            .setDescription('Provide a duration for this giveaway (1m, 1h, 1d)')
            .setRequired(true))
        .addIntegerOption(
            option =>
            option.setName('winners')
            .setDescription('Select the amount of winners for this giveaway')
            .setRequired(true))
        .addStringOption(
            option =>
            option.setName('prize')
            .setDescription('Provide the name of the prize')
            .setRequired(true))
        .addChannelOption(
            option =>
            option.setName('channel')
            .setDescription('Select a channel to send the giveaway to.')
            .addChannelTypes(ChannelType.GuildText))
        .addRoleOption(
            option =>
            option.setName('giveaway-role')
            .setDescription('Notify your giveaway Role!')))
    .addSubcommand(
        command =>
        command.setName('actions')
        .setDescription('Options for giveaways.')
        .addStringOption(
            option =>
            option.setName('option')
            .setDescription('Select an option.')
            .setRequired(true)
            .addChoices(
                { name: '⛔ End', value: 'end' },
                { name: '⏸️ Pause', value: 'pause' },
                { name: '▶️ Unpause', value: 'unpause' },
                { name: '🎲 Reroll', value: 'reroll' },
                { name: '🗑️ Delete', value: 'delete' },
        ))
        .addStringOption(
            option => 
            option.setName('message-id')
            .setDescription('Provide the message id of the giveaway!')
            .setRequired(true))
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild } = interaction;

        const Sub = options.getSubcommand();
        const errorEmbed = new EmbedBuilder()
        .setTitle('⛔ Error')
        .setColor('Red')

        const successEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle('🎉 Giveaway')

        switch(Sub) {

            case "create": {

                const gChannel = options.getChannel('channel') || interaction.channel;
                const duration = options.getString('duration');
                const winnerCount = options.getInteger('winners');
                const prize = options.getString('prize');
                const giveawayRole = options.getRole('giveaway-role')

                client.giveawaysManager.start(gChannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                    hostedBy: interaction.member.user,
                    messages : {
                        giveaway: `${giveawayRole ? `<@&${giveawayRole.id}>\n` : "" }🎉 **GIVEAWAY STARTED** 🎉`,
                        giveawayEnded: `${giveawayRole ? `<@&${giveawayRole.id}>\n` : "" }🔔 **GIVEAWAY ENDED** 🔔`,
                        winMessage: 'Congratulations, {winners}! You won **{this.prize}**!'
                    }
                }).then(async () => {
                    successEmbed.setDescription("Giveaway was successfully started!")
                    return interaction.reply({embeds: [successEmbed], ephemeral: true})
                }).catch((err) => {
                    errorEmbed.setDescription(err)
                    return interaction.reply({embeds: [errorEmbed], ephemeral: true})
                })



            } break;

            case "actions": {
                const choice = options.getString('option');
                const messageId = options.getString('message-id');
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

                if(!giveaway) {
                    errorEmbed.setDescription(`Unable to find giveaway with the message id: \`${messageId}\` in this guild`);
                    return interaction.reply({embeds: [errorEmbed], ephemeral: true})
                }

                switch(choice) {

                    case "end": {
                        client.giveawaysManager.end(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been ended.")
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(err)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        })
                    } break;

                    case "pause": {
                        client.giveawaysManager.pause(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been paused.")
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(err)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        })
                    } break;

                    case "unpause": {
                        client.giveawaysManager.unpause(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been unpaused.")
                            interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(err)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        })
                    } break;

                    case "reroll": {
                        client.giveawaysManager.reroll(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been rerolled.")
                            interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(err)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        })
                    } break;

                    case "delete": {
                        client.giveawaysManager.delete(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been deleted.")
                            interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            errorEmbed.setDescription(err)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                        })
                    } break;
                }
            } break;
        }

    }
}