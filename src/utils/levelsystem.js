const { Client, Message, TextChannel, EmbedBuilder } = require('discord.js')

const levelDB = require('../models/Levels')

const calculateXP = (level) => level * level * 100

/**
 * 
 * @param {String} guildID 
 * @param {String} userId 
 * @param {Int} xpToAdd 
 * @param {Message} message 
 * @param {Client} client 
 * @param {Boolean} embed 
 * @param {String} levelUpMessage
 * @param {TextChannel} channel
 */
const addXP = async (guildID, userId, xpToAdd, message, client, embed, levelUpMessage, channel) => {
    const result = await levelDB.findOneAndUpdate(
        { GuildID: guildID, UserID: userId },
        { $inc: { xp: xpToAdd } },
        { new: true, upsert: true }
    );

    let { xp, level } = result
    const needed = calculateXP(level)

    if(xp >= needed) {
        level++
        xp -= needed

        if(embed) {
            const LevelEmbed = new EmbedBuilder()
            .setTitle("Level Up")
            .setDescription(levelUpMessage.replace("{level}", level.toString()).replace("{user}", message.member.user.username))
            .setThumbnail(message.member.user.displayAvatarURL())
            .setColor(client.color)
            .setTimestamp(Date.now());

            channel.send({embeds: [LevelEmbed]})
        } else {
            channel.send({content: levelUpMessage.replace("{level}", level.toString()).replace("{user}", message.member.user.username)})
        }

        await levelDB.updateOne({
            GuildID: guildID,
            UserID: userId,
        }, {
            level: level,
            xp: xp,
        })
    }
}

module.exports = { addXP, calculateXP }