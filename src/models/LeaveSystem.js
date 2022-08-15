const { model, Schema } = require('mongoose')

module.exports = model("Leave", new Schema({
    GuildID: String,
    ChannelID: String,
    Message: String,
}))