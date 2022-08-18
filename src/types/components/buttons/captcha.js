const { ButtonInteraction, Client, AttachmentBuilder, EmbedBuilder } = require('discord.js')
const DB = require('../../../models/CaptchaSystem')
const featuresDB = require('../../../models/Features')
const { Captcha } = require('captcha-canvas')
const ms = require('ms')

module.exports = {
    data: {
        name: "captcha-btn"
    },
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { member, guild } =  interaction;

        const featuresCheck = await featuresDB.findOne({GuildID: guild.id})
        if(featuresCheck) {
            const { CaptchaSystem } = featuresCheck;
            if(CaptchaSystem) {
                var date = Date.now()

                interaction.reply({embeds: [new EmbedBuilder()
                    .setTitle('🤖 Catpcha')
                    .setDescription(`Please send the answer within 30 seconds in the DM!\nClick again <t:${Math.floor((Date.now() + 30 * 1000) / 1000)}:R>!`)
                    .setColor(client.color)
                    .setTimestamp(Date.now())], ephemeral: true})

                DB.findOne({ GuildID: guild.id }, async (err, data) => {
                    if(!data) return console.log(`Captcha Disabled for ${guild.name}!`);
        
                    const captcha = new Captcha();
                    captcha.async = true;
                    captcha.addDecoy();
                    captcha.drawTrace();
                    captcha.drawCaptcha();
        
                    const captchaAttachment = new AttachmentBuilder(await captcha.png)
                    .setName("captcha.png");
                    
                    const captchaEmbed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription("Please complete this captcha within 30 seconds!")
                    .setImage('attachment://captcha.png')
        
                    try {
                        const msg = await member.user.send({files: [captchaAttachment], embeds: [captchaEmbed]})
                        
                        const wrongCaptchaEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("🚫 Wrong Captcha");
        
                        const filter_ = (message) => {
                            if(message.author.id !== member.id) return;
                            if(message.content === captcha.text) {
                                return true;
                            } else {
                                member.send({embeds: [wrongCaptchaEmbed]})
                            }
                        }
        
                        try {
                            const response = await msg.channel.awaitMessages({
                                filter: filter_,
                                max: 1,
                                time: 30*1000,
                                errors: ["time"]});
        
                            if(response) {
                                DB.findOne({ GuildID: member.guild.id }, async (err, data) => {
                                    if(!data) return;
                                    if(!data.Role) return;
        
                                    const role = member.guild.roles.cache.get(data.Role)
                                    member.roles.add(role)
                                    member.user.send("`✅ You have been successfully verified!`");
                                })
                            } else {
                                member.user.send("`❌ You didn't verify!`");
                            }
        
                        } catch (error) {
                            return console.log(error)
                        }        
                    } catch (error) {
                        return console.log(error)
                    }
                })
            }
        }
    }
}