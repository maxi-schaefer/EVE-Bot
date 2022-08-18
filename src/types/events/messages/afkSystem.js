const { Message, EmbedBuilder, MessageType } = require('discord.js')
const DB = require("../../../models/AFKSystem")

module.exports = {
    name: "messageCreate",
    once: false,
    /**
     * @param {Message} message
     */
    async execute(message, client) {
        if(message.author.bot) return;
        if(message.guild == null) return;

        await DB.deleteOne({GuildID: message.guild.id, UserID: message.author.id});

        if(message.mentions.members) {
            const Response = new EmbedBuilder()
            .setColor(client.color)
            
            message.mentions.members.forEach(async (m) => {
                DB.findOne({GuildID: message.guild.id, UserID: m.id}, async(err, data) => {
                    if(err) throw err;

                    if(data){
                        Response.setDescription(`${m} went AFK <t:${data.Time}:R>\n **Status:** ${data.Status}`);
                        return message.reply({embeds: [Response]})
                    }
                    else {
                        return;
                    }
                })
            })
        }
    }
}