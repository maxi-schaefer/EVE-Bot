const { Client, Message, EmbedBuilder } = require('discord.js')

const featuresDB = require('../../../models/Features')
const levelSystem = require('../../../models/LevelSystem')
const { addXP } = require('../../../utils/levelsystem')

module.exports = {
    name: "messageCreate",
    once: false,
    rest: false,
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        const { guild, member } = message;
        if(message.guild === null) return;
        if(message.author.bot) return;

        const randomXP = Math.floor(Math.random() * 9) + 1;

        const levelSystemCheck = await featuresDB.findOne({ GuildID: guild.id });
        if(levelSystemCheck && levelSystemCheck.LevelSystem) {
            const levelSettings = await levelSystem.findOne({ GuildID: guild.id });
            const { Message, Embed, ChannelID } = levelSettings;

            if(ChannelID) {
                const channel = guild.channels.cache.get(ChannelID);
                addXP(guild.id, member.id, randomXP, message, client, Embed, Message ? Message : `Congrats **{user}**! You are now __**Level {level}**__ 🥳`, channel);
            } else {
                addXP(guild.id, member.id, randomXP, message, client, Embed,  Message ? Message : `Congrats **{user}**! You are now __**Level {level}**__ 🥳`, message.channel);
            }
        }

    }
}