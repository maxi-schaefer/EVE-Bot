/* Bot discord.js setup */
const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder } = require("discord.js");
const { User, Channel, GuildMember, GuildScheduledEvent, Message, Reaction, ThreadMember } = Partials
const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates, DirectMessages, GuildMessageReactions, GuildEmojisAndStickers, GuildWebhooks, GuildIntegrations, MessageContent } = GatewayIntentBits;
const client = new Client({ shards: "auto", intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates, DirectMessages, GuildMessageReactions, GuildEmojisAndStickers, GuildWebhooks, GuildIntegrations, MessageContent], partials: [User, Message, GuildMember, ThreadMember, GuildScheduledEvent, Reaction] });

/* Client Config */
client.config = require('../config.json')
client.color = parseInt(client.config.color.replace("#", "0x"))

/* Giveaway System */
require('./Systems/GiveawaySystem')(client);

/* Client Collections */
client.voiceGenerator = new Collection();
client.commands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();

/* Discord Handler */
const { loadEvents } = require('./handlers/EventHandler')
const { loadCommands } = require('./handlers/CommandHandler');
const { loadComponents } = require('./handlers/ComponentHandler');

/* Client Login */
client.login(client.config.token)
.then(() => {
    /* Start Handler */
    loadEvents(client);
    loadCommands(client);
    loadComponents(client);
})