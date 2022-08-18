const { Client, GuildMember, EmbedBuilder } = require('discord.js');

const featuresDB = require('../../../models/Features')
const leaveDB = require('../../../models/LeaveSystem')

module.exports = {
    name: "guildMemberRemove",
    rest: false,
    once: false,
    /**
     * @param { Client } client
     * @param { GuildMember } member
     */
    async execute(member, client) {
        
        const { guild } = member;
        
        /* Leave Greetings */
        featuresDB.findOne({ GuildID: guild.id }, async (err, data) => {
            if(err) throw err;

            if(!data) return;

            if(data) {
                if(data.Leave) {
                    const LeaveEmbed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("🔙 Leave")
                    .setDescription(`**${member.user.tag}** just left the server! We hope they return back soon!`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setFooter({text: `We now have ${member.guild.memberCount} members!`, iconURL: member.guild.iconURL()})

                    leaveDB.findOne({GuildID: guild.id}, async (err, data) => {
                        if (err) throw err;

                        if(data) {
                            if(data.Message) {
                                LeaveEmbed.setDescription(data.Message.replace("{user}", member.user.tag).replace("{server}", member.guild.name))
                            } else {
                                LeaveEmbed.setDescription(`**${member.user.tag}** just left the server! We hope they return back soon!`)
                            }

                            if(data.ChannelID) {
                                const channel = guild.channels.cache.find(channel => channel.id === data.ChannelID);
                                await channel.send({ embeds: [LeaveEmbed] })
                            }
                        } else {
                           guild.systemChannel.send({embeds: [LeaveEmbed]}); 
                        }
                    })
                    
                } else {
                    return;
                }
            }
        })

    }
}