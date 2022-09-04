const { model, Schema } = require('mongoose');

module.exports = model('LevelSystem', new Schema({
    GuildID: String,
    ChannelID: String,
    Message: String,
    Embed: Boolean,
}))