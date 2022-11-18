const { Client, GuildMember, EmbedBuilder } = require('discord.js');

const featuresDB = require('../../../models/Features')
const welcomeDB = require('../../../models/WelcomeSystem')

module.exports = {
    name: "guildMemberAdd",
    rest: false,
    once: false,
    /**
     * @param { Client } client
     * @param { GuildMember } member
     */
    async execute(member, client) {

        const { guild } = member;   

        /* Welcome Greetings */
        featuresDB.findOne({ GuildID: member.guild.id }, (err, feature_data) => {
            if(err) throw err;

            if(!feature_data) return;

            if(feature_data) {
                if(feature_data.Welcome) {
                    const WelcomeEmbed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("👋 Welcome")
                    .setDescription(`${member} joined the server! Welcome to **${member.guild.name}**!`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setFooter({text: `We now have ${member.guild.memberCount} members!`, iconURL: member.guild.iconURL()})

                    welcomeDB.findOne({GuildID: member.guild.id}, async (err, data) => {
                        if (err) throw err;

                        if(data) {
                            if(data.Message) {
                                WelcomeEmbed.setDescription(data.Message.replace("{user}", member).replace("{server}", member.guild.name))
                            } else {
                                WelcomeEmbed.setDescription(`${member} joined the server! Welcome to **${member.guild.name}**!`)
                            }

                            if(data.ChannelID) {
                                const channel = guild.channels.cache.get(data.ChannelID);
                                await channel.send({ embeds: [WelcomeEmbed] })
                            } else {
                                await guild.systemChannel.send({embeds: [WelcomeEmbed]}); 
                            }

                            if(data.RoleID) {
                                if(!feature_data.CaptchaSystem) {
                                    const role = guild.roles.cache.find(role => role.id === data.RoleID);
                                    member.roles.add(role);
                                }
                            }
                        } else {
                            guild.systemChannel.send({embeds: [WelcomeEmbed]});  
                        }
                    })
                    
                } else {
                    return;
                }
            }
        })

    }
}