const { Client, EmbedBuilder, Guild } = require('discord.js');
const { updateActivity } = require('../../../utils/updatePresence')

const featuresDB = require('../../../models/Features')
const afkDB = require('../../../models/AFKSystem')
const blacklist = require('../../../models/BlacklistSystem')
const Catpcha = require('../../../models/CaptchaSystem')
const chatFilter = require('../../../models/ChatFilter')
const confesstion = require('../../../models/ConfessionSettings')
const confessionsys = require('../../../models/ConfessionSystem')
const giveaway = require('../../../models/Giveaway')
const Leave = require('../../../models/LeaveSystem')
const Levels = require('../../../models/Levels')
const Levelsys = require('../../../models/LevelSystem')
const ModerationLogs = require('../../../models/ModerationLogs')
const mute = require('../../../models/MuteSystem')
const rrDB = require('../../../models/ReactionRoles')
const ssys = require('../../../models/SuggestSystem')
const Ticket = require('../../../models/Ticket')
const TicketSys = require('../../../models/TicketSystem')
const VoiceSys = require('../../../models/VoiceSystem')
const WarnSys = require('../../../models/WarnSystem')
const welcome = require('../../../models/WelcomeSystem')

module.exports = {
    name: "guildDelete",
    rest: false,
    once: false,
    /**
     * @param { Guild } guild
     * @param { Client } client
     */
    async execute(guild, client) {
        console.log(`Left Server ${guild.name}`)

        await featuresDB.findOneAndDelete({ GuildID: guild.id });
        await afkDB.findOneAndDelete({ GuildID: guild.id });
        await blacklist.findOneAndDelete({ GuildID: guild.id });
        await Catpcha.findOneAndDelete({ GuildID: guild.id });
        await chatFilter.findOneAndDelete({ GuildID: guild.id });
        await confesstion.findOneAndDelete({ GuildID: guild.id });
        await confessionsys.findOneAndDelete({ GuildID: guild.id });
        await giveaway.findOneAndDelete({ GuildID: guild.id });
        await Leave.findOneAndDelete({ GuildID: guild.id });
        await Levels.findOneAndDelete({ GuildID: guild.id });
        await Levelsys.findOneAndDelete({ GuildID: guild.id });
        await ModerationLogs.findOneAndDelete({ GuildID: guild.id });
        await mute.findOneAndDelete({ GuildID: guild.id });
        await rrDB.findOneAndDelete({ GuildID: guild.id });
        await ssys.findOneAndDelete({ GuildID: guild.id });
        await Ticket.findOneAndDelete({ GuildID: guild.id });
        await TicketSys.findOneAndDelete({ GuildID: guild.id });
        await VoiceSys.findOneAndDelete({ GuildID: guild.id });
        await WarnSys.findOneAndDelete({ GuildID: guild.id });
        await welcome.findOneAndDelete({ GuildID: guild.id });

        updateActivity(client, client.config.activityInterval);
    }
}
