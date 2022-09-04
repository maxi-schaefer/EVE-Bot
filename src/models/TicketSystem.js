const { model, Schema } = require('mongoose')

module.exports = model('Ticketsystem', new Schema({
    GuildID: String,
    CategoryID: String,
    ChannelID: String,
    RoleIDs: Array,
}))