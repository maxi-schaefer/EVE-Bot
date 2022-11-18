const { ButtonInteraction, Client, AttachmentBuilder, EmbedBuilder, MessagePayload, Embed } = require('discord.js')
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
                    .setTitle("<:captcha:1017764058130284584> Hello! Are you human? Let's find out!")
                    .setDescription("``Please type the captcha below to be able to access this server!``")
                    .setImage('attachment://captcha.png')
                    .setFooter({ text: `Verification Period: 2 minutes` })
        
                    try {
                        const msg = await interaction.reply({files: [captchaAttachment], embeds: [captchaEmbed], ephemeral: true})
                        msg.interaction.channel.permissionOverwrites.edit(member.id, { SendMessages: true });
    
                        const filter_ = (message) => {
                            if(message.author.id !== member.id) return;
                            if(message.content.toUpperCase() === captcha.text) {
                                return true;
                            } else {
                                return false;
                            }
                        }
        
                        try {
                            const response = await msg.interaction.channel.awaitMessages({
                                filter: filter_,
                                max: 1,
                                time: 2*60*1000,
                                errors: ["time"]});
        
                            if(response) {
                                DB.findOne({ GuildID: member.guild.id }, async (err, data) => {
                                    if(!data) return;
                                    if(!data.Role) return;
        
                                    const role = member.guild.roles.cache.get(data.Role)
                                    try {
                                        member.roles.add(role)   
                                    } catch (error) {}

                                    const verifiedEmbed = new EmbedBuilder()
                                    .setTitle("You have been verified!")
                                    .setColor(0x4cb861)
                                    .setDescription(`<:success:1017762669559816222>  You passed the verification successfully! You can now access \`\`${interaction.guild.name}\`\`!`)

                                    member.user.send({ embeds: [verifiedEmbed] }).then(() => {
                                        msg.interaction.channel.permissionOverwrites.delete(member.id);
                                        msg.interaction.channel.messages.cache.forEach((message) => {
                                            if(!message.author.bot) message.delete().catch(err => console.log("Nothing"));
                                        })
                                        response.forEach(RMessage => {
                                            RMessage.delete();
                                        })
                                    });
                                })
                            } else {
                                member.user.send("`❌ You didn't verify!`");
                                member.kick("Couldn't Verify")
                                msg.interaction.channel.permissionOverwrites.edit(member.id, { SendMessages: false });
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