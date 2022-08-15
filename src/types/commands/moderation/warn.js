const { Client, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const warnDB = require('../../../models/WarnSystem')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user!")
    /* Add */
    .addSubcommand(
        command =>
        command.setName("add")
        .setDescription("Add warn points to specific user!")
        .addUserOption(
            option =>
            option.setName("user")
            .setDescription("The user you want to add warn points!")
            .setRequired(true))
        .addStringOption(
            option =>
            option.setName("reason")
            .setDescription("The reason you want to add warn points!")
            .setRequired(false)))
    /* Remove */
    .addSubcommand(
        command =>
        command.setName("remove")
        .setDescription("Remove warn points from specific user!")
        .addUserOption(
            option =>
            option.setName("user")
            .setDescription("The user you want to add warn points!")
            .setRequired(true))
        .addNumberOption(
            option =>
            option.setName("points")
            .setDescription("How many points you want to remove!")
            .setRequired(true))
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Target = options.getMember("user");
        const Sub = options.getSubcommand();

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp(Date.now())

        switch (Sub) {
            case "add": {
                const reason = options.getString("reason") || "No Reason given!"
                Response.setTitle(`${Target.user.tag} has been successfully warned!`);

                warnDB.findOne({GuildID: interaction.guild.id, UserID: Target.id}, async(err, data) => {
                    if(err) throw err;
        
                    if(data) {
                        let num = data.Warns;
        
                        await warnDB.findOneAndUpdate(
                            {GuildID: interaction.guild.id, UserID: Target.id},
                            {Warns: num += 1},
                            {new: true, upsert: true});

                        Response.setDescription(`Added \`1\` Warn Point to ${Target}! \n**Total:** ${num}\n**Reason**: ${reason}`);

                        const UserEmbed = new EmbedBuilder()
                        .setTitle("🛑 Warning")
                        .setTimestamp(Date.now())
                        .setColor(client.color)
                        .setDescription(`You've got a Warning Point in \`${interaction.guild.name}\``)
                        .addFields([
                            { name: "Reason", value: reason, inline: true },
                            { name: "Total", value: num.toString(), inline: true },
                        ])
                        
                        Target.send({embeds: [UserEmbed]})

                        return interaction.reply({embeds: [Response]}).then(msg => {
                            setTimeout(() => msg.interaction.deleteReply(), 10*1000);
                        });
                    } else {
                        await warnDB.findOneAndUpdate(
                            {GuildID: interaction.guild.id, UserID: Target.id},
                            {Warns: 1},
                            {new: true, upsert: true});

                        Response.setDescription(`Added \`1\` Warn Point to ${Target}! \n**Total:** 1`);
                        
                        const UserEmbed = new EmbedBuilder()
                        .setTitle("🛑 Warning")
                        .setTimestamp(Date.now())
                        .setColor(client.color)
                        .setDescription(`You've got a Warning Point in ${interaction.guild}`)
                        .addFields([
                            { name: "Reason", value: reason, inline: true },
                            { name: "Total", value: '1', inline: true },
                        ])
                        
                        Target.send({embeds: [UserEmbed]})
                        return interaction.reply({embeds: [Response]}).then(msg => {
                            setTimeout(() => msg.interaction.deleteReply(), 10*1000);
                        });
                    }
                });
            } break;

            case "remove": {
                const points = options.getNumber("points");
                Response.setTitle(`User Management:`);

                warnDB.findOne({GuildID: interaction.guild.id, UserID: Target.id}, async(err, data) => {
                    if(err) throw err;
        
                    if(data) {
                        let num = data.Warns;
                        
                        if(points <= num) {
                            await warnDB.findOneAndUpdate(
                                {GuildID: interaction.guild.id, UserID: Target.id},
                                {Warns: num - points},
                                {new: true, upsert: true});

                            Response.setDescription(`Removed \`${points}\` Warning Point/s from ${Target}! \n**Total:** ${num - points}`);
                            return interaction.reply({embeds: [Response]}).then(msg => {
                                setTimeout(() => msg.interaction.deleteReply(), 10*1000);
                            });
                        } else {
                            await warnDB.findOneAndUpdate(
                                {GuildID: interaction.guild.id, UserID: Target.id},
                                {Warns: 0},
                                {new: true, upsert: true});

                            Response.setDescription(`Removed \`all\` Warning Points from ${Target}! \n**Total:** 0`);
                            return interaction.reply({embeds: [Response]}).then(msg => {
                                setTimeout(() => msg.interaction.deleteReply(), 10*1000);
                            });
                        }
                    }
                });
            } break;
        }
    }
}