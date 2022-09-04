const { Client } = require('discord.js');
const mongoose = require('mongoose');
const { updateActivity } = require('../../../utils/updatePresence')

module.exports = {
    name: "ready",
    rest: false,
    once: false,
    /**
     * @param { Client } client
     */
    async execute(client) {
        /* Connect to the database */
        const database = client.config.database;
        if(!database) return console.log('Please add a Database!');

        mongoose.connect(database).then(() => {
            console.log(`Connected successfully to the Database!`);
        })

        console.log(`Logged in as ${client.user.tag}!`);
        client.guilds.cache.forEach(guild => {
            console.log(`${guild.id} | ${guild.name}`);
        })

        updateActivity(client, client.config.activityInterval)
      }
}