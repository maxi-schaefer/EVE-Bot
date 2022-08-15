const { Client, GuildChannel } = require('discord.js');

module.exports = {
    name: "channelCreate",
    rest: false,
    once: false,
    /**
     * @param { Client } client
     * @param { GuildChannel } channel
     */
    async execute(channel, client) {
        let mutedRole = channel.guild.roles.cache.find(role => role.name === "muted");

        if(!mutedRole) return;

        channel.permissionOverwrites.edit(mutedRole.id, { SendMessages: false, Connect: false })


    }
}