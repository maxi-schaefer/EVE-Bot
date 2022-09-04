const { Client, Message } = require('discord.js')

const featuresDB = require('../../../models/Features')
const chatfilterDB = require('../../../models/ChatFilter')
const { addPoints } = require('../../../utils/warnpoints')

module.exports = {
    name: 'messageCreate',
    rest: false,
    once: false,
    /**
     * @param { Message } message
     * @param { Client } client
     */
    async execute(message, client) {
        if(message.author.bot) return;
        if(message.guild === null) return;

        featuresDB.findOne({GuildID: message.guild.id}, async (err, data) => {
            if(err) throw err;
            if(!data) return;

            if(data.AutoModSystem) {
                chatfilterDB.findOne({GuildID: message.guild.id}, async (err, chatData) => {   
                    if(!chatData || chatData.Wordlist) return;
                    if(message.member.permissions.has('Administrator')) return;

                    message.content.toLowerCase().split(" ").forEach(word => {
                        if(chatData.Wordlist.includes(word)) {
                            addPoints(1, message, 'Chatfilter', message.author, client);
                            message.delete();
                        }
                    })
                })
            }
        })
    }
}