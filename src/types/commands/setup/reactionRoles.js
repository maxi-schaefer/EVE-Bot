const { Client, SlashCommandBuilder, ChatInputCommandInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, EmbedBuilder, PermissionsBitField } = require('discord.js')
const rolesDB = require('../../../models/ReactionRoles')
const { isValidHexColor } = require('../../../utils/utils')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reactionroles')
    .setDescription('Simple Reaction Roles')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand(
        command =>
        command.setName('create')
        .setDescription('Create a reaction roles embed')
        .addStringOption(option => option.setName('title').setDescription('Embed Title').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Embed Description').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Embed Image'))
        .addStringOption(option => option.setName('color').setDescription('Embed Color'))
    )
    .addSubcommand(
        command =>
        command.setName('edit')
        .setDescription('Edit a reaction roles embed')
        .addStringOption(option => option.setName('message-id').setDescription('MessageID of the Embed').setRequired(true))
        .addStringOption(option => option.setName('title').setDescription('New Title of the Embed').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('New Description of the Embed').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Image of the Embed').setRequired(false))
        .addStringOption(option => option.setName('color').setDescription('Embed Color'))
    )
    .addSubcommand(
        command =>
        command.setName('add')
        .setDescription('Add Custom roles')
        .addStringOption(option => option.setName('message-id').setDescription('MessageID of the Embed').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Role you want to add').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Description of your role').setRequired(true))
        .addStringOption(option => option.setName('emoji').setDescription('Emoji of your role').setRequired(true))
    )
    .addSubcommand(
        command =>
        command.setName('remove')
        .setDescription('Remove Custom roles')
        .addStringOption(option => option.setName('message-id').setDescription('MessageID of the Embed').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Role you want to add').setRequired(true))
    ).addSubcommand(
        command =>
        command.setName('delete')
        .setDescription('Delete custom roles')
        .addStringOption(option => option.setName('message-id').setDescription('MessageID of the Embed').setRequired(true))
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { options, guild, member, channel } = interaction;

        switch(options.getSubcommand()) {


            case "create": {

                const title = options.getString('title')
                const description = options.getString('description')
                const image = options.getString('image')
                const color = options.getString('color')
                
                const Response = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description.replace('\n', `
                
                `))
                .setColor(0x2f3136)

                if(image) {
                    if(!isValidHttpUrl(image)) return interaction.reply({ content: '❌ Image needs to be a valid url', ephemeral: true });
                    else Response.setImage(image)
                }

                if(color) {
                    if(!isValidHexColor(color)) return interaction.reply({ content: '❌ Color needs to be a valid hex Color', ephemeral: true });
                    else Response.setColor(parseInt(color.replace("#", "0x")))
                }

                interaction.channel.send({ embeds: [Response] }).then(async (msg) => {
                    await rolesDB.create({
                        GuildID: guild.id,
                        MessageID: msg.id,
                        Roles: []
                    })

                    interaction.reply({ content: '✅ Created! Add Roles with ``/reactionroles add``', ephemeral: true });
                })

            } break;

            case "edit": {
                
                const message_ID = options.getString('message-id')
                const title = options.getString('title')
                const description = options.getString('description')
                const image = options.getString('image');
                const color = options.getString('color')

                rolesDB.findOne({ GuildID: guild.id, MessageID: message_ID }, async(err, data) => {
                    if(err) throw err;
                    if(!data) return interaction.reply({ content: `❌ ${message_ID} is not a valid ReactionRoles Embed`, ephemeral: true});

                    const Response = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor(0x2f3136)

                    channel.messages.fetch(message_ID).then(msg => {
                        if(image) {
                            if(!isValidHttpUrl(image)) return interaction.reply({ content: '❌ Image needs to be a valid url', ephemeral: true });
                            else Response.setImage(image);
                        }

                        if(color) {
                            if(!isValidHexColor(color)) return interaction.reply({ content: '❌ Color needs to be a valid hex Color', ephemeral: true });
                            else Response.setColor(parseInt(color.replace("#", "0x")))
                        }

                        msg.edit({ embeds: [Response] });
                        interaction.reply({ content: '✅ Edited Embed', ephemeral: true })
                    })
                })

            } break;

            case "add": {

                const role = options.getRole('role')
                const message_ID = options.getString('message-id')
                const description = options.getString('description')
                const emoji = options.getString('emoji')
                
                const clientMember = guild.members.cache.get(client.user.id);
                if(role.position >= clientMember.roles.highest.position) return interaction.reply({ content: `❌ I can't assign a role that is higher or equal me`, ephemeral: true});

                rolesDB.findOne({ GuildID: guild.id, MessageID: message_ID }, async function(err, data) {
                    if(err) throw err;

                    if(data) {

                        const newRole = {
                            roleID: role.id,
                            roleDescription: description,
                            roleEmoji: emoji,
                        }
                        let roleData = data.Roles.find(x => x.roleID === role.id);
                        if(roleData) {
                            roleData = newRole;
                            data.save()
                        } else {
                            data.Roles = [...data.Roles, newRole]
                            await data.save()
                        }

                        const selectOptions = data.Roles.map(x => {
                            const role = guild.roles.cache.get(x.roleID);

                            return new SelectMenuOptionBuilder()
                            .setLabel(role.name)
                            .setValue(role.id)
                            .setDescription(x.roleDescription)
                            .setEmoji(x.roleEmoji)
                        })

                        const menu = new ActionRowBuilder()
                        .addComponents(new SelectMenuBuilder().setCustomId('reaction-roles').setMaxValues(1).addOptions(selectOptions).setPlaceholder('Choose a role'));

                        channel.messages.fetch(message_ID).then(msg => {
                            msg.edit({ components: [menu] })
                            interaction.reply({ content: '✅ Added Role', ephemeral: true })
                        })

                    } else {
                        return interaction.reply({ content: `❌ ${message_ID} is not a valid ReactionRoles Embed`, ephemeral: true});
                    }
                });

            } break;

            case "remove": {

                const role = options.getRole('role')
                const message_ID = options.getString('message-id')

                rolesDB.findOne({ GuildID: guild.id, MessageID: message_ID }, async function(err, data) {
                    if(err) throw err;

                    if(data) {
                        let roleData = data.Roles.find(x => x.roleID === role.id);
                        if(roleData) {
                            const filteredRoles = data.Roles.filter(x => x.roleID !== role.id);
                            data.Roles = filteredRoles

                            await data.save();
                        } else {
                            return interaction.reply({ content: `❌ ${role} is not in these ReactionRoles`, ephemeral: true});
                        }

                        const selectOptions = data.Roles.map(x => {
                            const role = guild.roles.cache.get(x.roleID);

                            return new SelectMenuOptionBuilder()
                            .setLabel(role.name)
                            .setValue(role.id)
                            .setDescription(x.roleDescription)
                            .setEmoji(x.roleEmoji)
                        })

                        const menu = new ActionRowBuilder()
                        .addComponents(new SelectMenuBuilder().setCustomId('reaction-roles').setMaxValues(1).addOptions(selectOptions).setPlaceholder('Choose a role'));

                        channel.messages.fetch(message_ID).then(msg => {
                            msg.edit({ components: [menu] })
                            interaction.reply({ content: '✅ Removed Role', ephemeral: true })
                        })

                    } else {
                        return interaction.reply({ content: `❌ ${message_ID} is not a valid ReactionRoles Embed`, ephemeral: true});
                    }
                });

            } break;

            case "delete": {
                const message_ID = options.getString('message-id')
                await rolesDB.findOneAndDelete({ GuildID: guild.id, MessageID: message_ID})
                channel.messages.fetch(message_ID).then(msg => {
                    msg.delete();
                })
                return interaction.reply({ content: '✅ Deleted!', ephemeral: true });
            } break;


        }

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