const { Client } = require('discord.js');
const mongoose = require('mongoose');

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
        if(!database) return;

        mongoose.connect(database, {}).then(() => {
            console.log(`Connected successfully to the Database!`);
        })

        console.log(`Logged in as ${client.user.tag}!`);
    }
}