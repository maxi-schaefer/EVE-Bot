const warnDB = require('../models/WarnSystem')
const { ChatInputCommandInteraction, Client, EmbedBuilder, GuildMember, Message } = require('discord.js')

/**
 *  
 * @param {Int} points 
 * @param {Message} message 
 * @param {String} reason 
 * @param {GuildMember} user 
 * @param {Client} client
 */
async function addPoints(points, message, reason, user, client) {

    warnDB.findOne({GuildID: message.guildId, UserID: user.id}, async (err, data) => {
        if(err) throw err;
        
        if(data) {
            let num = data.Warns;

            await warnDB.findOneAndUpdate(
                {GuildID: message.guildId, UserID: user.id},
                {Warns: num += points},
                {new: true, upsert: true});

            const UserEmbed = new EmbedBuilder()
            .setTitle("⚠ Warning")
            .setTimestamp(Date.now())
            .setColor(client.color)
            .setDescription(`You've got a Warning Point in \`${message.guild.name}\` \n**Total:** ${num}\n**Reason:** ${reason}\n**Moderator:** Automoderation`)

            user.send({embeds: [UserEmbed]})
        } else {
            let num = 0;

            await warnDB.findOneAndUpdate(
                {GuildID: message.guildId, UserID: user.id},
                {Warns: num += points},
                {new: true, upsert: true});

            const UserEmbed = new EmbedBuilder()
            .setTitle("⚠ Warning")
            .setTimestamp(Date.now())
            .setColor(client.color)
            .setDescription(`You've got a Warning Point in \`${message.guild.name}\` \n**Total:** ${num}\n**Reason:** ${reason}\n**Moderator:** Automoderation`)

            user.send({embeds: [UserEmbed]})
        }
    })
}

/**
 *  
 * @param {Int} points 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {String} reason 
 * @param {GuildMember} user 
 * @param {Client} client
 */
 async function addInteractionPoints(points, interaction, reason, user, client) {
    const Response = new EmbedBuilder()
    .setColor(client.color)
    .setTimestamp(Date.now())
    .setTitle(`${user.user.tag} has been successfully warned!`);

    warnDB.findOne({GuildID: interaction.guildID, UserID: user.id}, async (err, data) => {
        if(err) throw err;
        
        if(data) {
            let num = data.Warns ? data.Warns : 0;

            await warnDB.findOneAndUpdate(
                {GuildID: interaction.guildId, UserID: user.id},
                {Warns: num += points},
                {new: true, upsert: true});
    
            Response.setDescription(`Added \`1\` Warn Point to ${user}! \n**Total:** ${num}\n**Reason**: ${reason}`);
    
            const UserEmbed = new EmbedBuilder()
            .setTitle("⚠ Warning")
            .setTimestamp(Date.now())
            .setColor(client.color)
            .setDescription(`You've got a Warning Point in \`${interaction.guild.name}\` \n**Total:** ${num}\n**Reason:** ${reason}\n**Moderator:** ${interaction.member}`)
    
            user.send({embeds: [UserEmbed]})
    
            return interaction.reply({embeds: [Response], ephemeral: true})
        } else {
            let num = 0;

            await warnDB.findOneAndUpdate(
                {GuildID: interaction.guildId, UserID: user.id},
                {Warns: num += points},
                {new: true, upsert: true});
    
            Response.setDescription(`Added \`1\` Warn Point to ${user}! \n**Total:** ${num}\n**Reason**: ${reason}`);
    
            const UserEmbed = new EmbedBuilder()
            .setTitle("⚠ Warning")
            .setTimestamp(Date.now())
            .setColor(client.color)
            .setDescription(`You've got a Warning Point in \`${interaction.guild.name}\` \n**Total:** ${num}\n**Reason:** ${reason}\n**Moderator:** ${interaction.member}`)
    
            user.send({embeds: [UserEmbed]})
    
            return interaction.reply({embeds: [Response], ephemeral: true})
        }
    })
}

/**
 * 
 * @param {String} userID 
 * @param {Int} points 
 * @param {ChatInputCommandInteraction} interaction  
 * @param {GuildMember} user 
 * @param {Client} client
 */
 async function removeInteractionPoints(points, interaction, user, client) {
    const Response = new EmbedBuilder()
    .setColor(client.color)
    .setTimestamp(Date.now())
    .setTitle(`${user.user.tag}!`);

    warnDB.findOne({GuildID: interaction.guildId, UserID: user.id}, async(err, data) => {
        if(err) throw err;

        if(data) {
            let num = data.Warns;
            
            if(points < num) {
                await warnDB.findOneAndUpdate(
                    {GuildID: interaction.guildId, UserID: user.id},
                    {Warns: num - points},
                    {new: true, upsert: true});

                Response.setDescription(`Removed \`${points}\` Warning Point/s from ${user}! \n**Total:** ${num - points}`);
                return interaction.reply({ embeds: [Response] })
            } else {
                await warnDB.findOneAndUpdate(
                    {GuildID: interaction.guildId, UserID: user.id},
                    {Warns: 0},
                    {new: true, upsert: true});

                Response.setDescription(`Removed \`all\` Warning Points from ${user}! \n**Total:** 0`);
                return interaction.reply({ embeds: [Response] })
            }
        } else {
            return interaction.reply({ content: 'This user does not have any warning points!', ephemeral: true })
        }
    });
 }

/**
 * 
 * @param {String} userID 
 * @param {Int} points 
 * @param {Message} message  
 * @param {GuildMember} user 
 * @param {Client} client
 */
 async function removePoints(points, message, user, client) {
    const Response = new EmbedBuilder()
    .setColor(client.color)
    .setTimestamp(Date.now())
    .setTitle(`${user.user.tag}!`);

    warnDB.findOne({GuildID: message.guildId, UserID: user.id}, async(err, data) => {
        if(err) throw err;

        if(data) {
            let num = data.Warns;
            
            if(points < num) {
                await warnDB.findOneAndUpdate(
                    {GuildID: message.guildId, UserID: user.id},
                    {Warns: num - points},
                    {new: true, upsert: true});

                Response.setDescription(`Removed \`${points}\` Warning Point/s from ${user}! \n**Total:** ${num - points}`);
                return message.channel.send({ embeds: [Response] })
            } else {
                await warnDB.findOneAndUpdate(
                    {GuildID: message.guildId, UserID: user.id},
                    {Warns: 0},
                    {new: true, upsert: true});

                Response.setDescription(`Removed \`all\` Warning Points from ${user}! \n**Total:** 0`);
                return message.channel.send({ embeds: [Response] })
            }
        }
    });
 }

module.exports = { addPoints, removePoints, addInteractionPoints, removeInteractionPoints }