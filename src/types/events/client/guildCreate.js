const { Client, EmbedBuilder, Guild } = require('discord.js');
const { updateActivity } = require('../../../utils/updatePresence')

module.exports = {
    name: "guildCreate",
    rest: false,
    once: false,
    /**
     * @param { Guild } guild
     * @param { Client } client
     */
    async execute(guild, client) {
        console.log(`Joined Server ${guild.name}`)

        updateActivity(client, client.config.activityInterval)
    }
}