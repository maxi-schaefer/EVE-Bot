const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js')
const sourcebin = require('sourcebin')

const chatfilterDB = require('../../../models/ChatFilter')
const featuresDB = require('../../../models/Features')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('chatfilter')
    .setDescription('Add/Remove words from the chatfilter')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(
        command => command.setName('list').setDescription('List all filtered Words!')
    )
    .addSubcommand(
        command =>
        command.setName('configure')
        .setDescription("Add/Remove words from your server's chatfilter!")
        .addStringOption(
            option =>
            option.setName('option')
            .setDescription('Provide a Option')
            .addChoices(
                { name: 'add', value: 'add' },
                { name: 'remove', value: 'remove' },
            ).setRequired(true)
        ).addStringOption(
            option =>
            option.setName('words')
            .setDescription('Provide the word, add multiple words by placing a comma in between (word1,word2)')
            .setRequired(true)
        )
    )
    .addSubcommand(
        command =>
        command.setName('clear')
        .setDescription("Clear your server's chatfilter!")
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild } = interaction;

        const Response = new EmbedBuilder()
        .setTitle('💬 Chatfilter')
        .setTimestamp(Date.now())
        .setColor(client.color)

        const Subs = options.getSubcommand();

        featuresDB.findOne({ GuildID: guild.id }, async (err, sysdata) => {
            if(err) throw err;
            if(!sysdata || !sysdata.AutoModSystem) return interaction.reply({ content: '❌ Enable the AutoMod Feature first, just type ``/setup features``', ephemeral: true})

            switch(Subs) {
                case "list": {
                    const Data = await chatfilterDB.findOne({ GuildID: guild.id })
                    if(!Data) return interaction.reply({ embeds: [Response.setDescription('There is no blacklist')] });

                    await sourcebin.create([
                        { 
                            content: `${Data.Wordlist.map((w) => w).join("\n") || "none"}`,
                            language: "text"
                        }
                    ],
                    {
                        title: `${guild.name} | Blacklist`,
                        description: `${Data.Wordlist.length}`
                    }).then((bin) => {
                        return interaction.reply({ embeds: [Response.setDescription(`[Click Here to see all blacklisted Words](${bin.url})`)] })
                    })

                    /* map(r => r).join(" ") */
                } break;

                case "configure": {
                    const Words = options.getString('words').toLowerCase().split(",");
                    const Choice = options.getString('option');
    
                    switch(Choice) {
                        case "add": {
            
                            chatfilterDB.findOne({ GuildID: guild.id }, async (err, data) => {
                                if(err) throw err;
                                if(!data) {
                                    await chatfilterDB.create({
                                        GuildID: guild.id,
                                        Wordlist: Words
                                    });
            
                                    return interaction.reply({ embeds: [Response.setDescription(`Added ${Words.length} ${Words.length <= 1 ? 'word' : 'words'} to the blacklist.`)], ephemeral: true });
                                } else {
                                    Words.forEach(word => {
                                        if(data.Wordlist.includes(word)) return;
                                        data.Wordlist.push(word);
                                    })
    
                                    data.save()
            
                                    return interaction.reply({ embeds: [Response.setDescription(`Added ${Words.length} ${Words.length <= 1 ? 'word' : 'words'} to the blacklist.`)], ephemeral: true });
                                }
                            })
            
                        } break;
            
                        case "remove": {
            
                            chatfilterDB.findOne({ GuildID: guild.id }, async (err, data) => {
                                if(err) throw err;
                                if(!data) {
                                    return interaction.reply({ content: `There is no data to remove!`, ephemeral: true });
                                } else {
                                    Words.forEach(word => {
                                        if(!data.Wordlist.includes(word)) return;
                                        data.Wordlist.remove(word);
                                    })
            
                                    data.save()
            
                                    return interaction.reply({ embeds: [Response.setDescription(`Removed ${Words.length} ${Words.length <= 1 ? 'word' : 'words'} from the blacklist.`)], ephemeral: true });
                                }
                            })
            
                        } break;
                    }
                } break;
    
                case "clear": {
    
                    chatfilterDB.findOne({ GuildID: guild.id }, async (err, data) => {
                        if(err) throw err;
                        if(!data) {
                            return interaction.reply({ content: `There is no data to clear!`, ephemeral: true });
                        } else {
                            let num = data.Wordlist.length
                            await chatfilterDB.findOneAndDelete({ GuildID: guild.id })
    
                            data.save()
    
                            return interaction.reply({ embeds: [Response.setDescription(`Cleared ${num} from the blacklist.`)], ephemeral: true });
                        }
                    })
    
                } break;
            }
        })

    }
}