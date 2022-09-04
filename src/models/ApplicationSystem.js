const { model, Schema } = require('mongoose')

module.exports = model('Application', new Schema({
    GuildID: String,
    ChannelID: String,
    Open: Boolean
}))