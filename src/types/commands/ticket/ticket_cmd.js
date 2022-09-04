const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js')

const ticketDB = require('../../../models/Ticket')
const ticketSystem = require('../../../models/TicketSystem')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Moderate a users ticket!')
    .addSubcommand(
        command =>
        command.setName('info')
        .setDescription('Get information about a ticket!')
        .addStringOption(option => option.setName('ticket-id').setDescription('ID of the ticket! (#ticket-id) only the id').setRequired(true))
    )
    .addSubcommand(
        command =>
        command.setName('roles')
        .setDescription('Add or remove roles from ticket notifications')
        .addStringOption(option => option.setName('type').setDescription('Add/Remove').addChoices({ name: 'add', value: 'add' }, { name: 'remove', value: 'remove' }).setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Role you want to Add/Remove').setRequired(true))
    )
    .addSubcommand(
        command =>
        command.setName('add')
        .setDescription('Add a user to a ticket!')
        .addStringOption(option => option.setName('ticket-id').setDescription('ID of the ticket! (#ticket-id) only the id').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('User you want to add!').setRequired(true)))
    .addSubcommand(
        command =>
        command.setName('remove')
        .setDescription('Remove a user from a ticket!')
        .addStringOption(option => option.setName('ticket-id').setDescription('ID of the ticket! (#ticket-id) only the id').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('User you want to remove!').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guildId, guild, channel } = interaction;

        const Target = options.getUser('user')
        const Ticket = options.getString('ticket-id')
        const Subs = options.getSubcommand();

        const Response = new EmbedBuilder()
        .setTitle('✉️ Ticket System')
        .setColor(client.color)
        .setTimestamp(Date.now())

        switch(Subs) {
            case "info": {
                ticketDB.findOne({ GuildID: guildId, TicketID: Ticket }, (err, data) => {
                    if(err) throw err;
                    if(!data) return interaction.reply({ content: `❌ ${Ticket} is not a valid ticket ID!`, ephemeral: true });
        
                    const TicketEmbed = new EmbedBuilder()
                    .setTitle('✉️ Ticket System')
                    .setColor(client.color)
                    .setDescription(`Get information about **ticket-${Ticket}**`)
                    .addFields(
                        { name: 'Created At', value: `<t:${parseInt(data.CreatedAt / 1000)}:R>`, inline: true },
                        { name: 'Created By', value: `<@${data.MemberID}>`, inline: true },
                        { name: 'Ticket ID', value: `${Ticket}`, inline: true },
                        { name: 'Locked?', value: `${data.Locked ? 'Yes' : 'No'}`, inline: true },
                    )

                    return interaction.reply({ embeds: [TicketEmbed], ephemeral: true });
                })
            } break;

            case "roles": {
                const role = options.getRole('role');

                switch(options.getString('type')) {
                    case "add": {
                        ticketSystem.findOne({ GuildID: guildId }, (err, data) => {
                            if(err) throw err;
                            if(!data) return interaction.reply({ content: '❌ Setup the ticket System before | ``/setup ticket``', ephemeral: true});
                            data.RoleIDs.push(role.id);
                            data.save();

                            return interaction.reply({ content: `Added <@&${role.id}> to ticket notifications!`, ephemeral: true });
                        })
                    } break;

                    case "remove": {
                        ticketSystem.findOne({ GuildID: guildId }, (err, data) => {
                            if(err) throw err;
                            if(!data) return interaction.reply({ content: '❌ Setup the ticket System before | ``/setup ticket``', ephemeral: true});
                            
                            if(!data.RoleIDs.includes(role.id)) return;
                            data.RoleIDs.remove(role.id);
                            data.save();

                            return interaction.reply({ content: `Removed <@&${role.id}> from the ticket notifications!`, ephemeral: true });
                        })
                    } break;
                }
            }

            case "add": {
                ticketDB.findOne({ GuildID: guildId, TicketID: Ticket }, (err, data) => {
                    if(err) throw err;
                    if(!data) return interaction.reply({ content: `❌ ${Ticket} is not a valid ticket ID!`, ephemeral: true });
        
                    const channel = guild.channels.cache.get(data.ChannelID);
                    channel.permissionOverwrites.edit(Target.id, { ViewChannel: true });

                    return interaction.reply({ embeds: [Response.setDescription(`✅ Added ${Target} to the ticket!`)], ephemeral: true });
                })
            } break;

            case "remove": {
                ticketDB.findOne({ GuildID: guildId, TicketID: Ticket }, (err, data) => {
                    if(err) throw err;
                    if(!data) return interaction.reply({ content: `❌ ${Ticket} is not a valid ticket ID!`, ephemeral: true });
        
                    const channel = guild.channels.cache.get(data.ChannelID);
                    channel.permissionOverwrites.edit(Target.id, { ViewChannel: false });

                    return interaction.reply({ embeds: [Response.setDescription(`✅ Removed ${Target} from the ticket!`)], ephemeral: true });
                })
            }
        }

    }
}
