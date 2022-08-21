const { model, Schema } = require('mongoose')

module.exports = model("ConfessionSettings", new Schema({
    GuildID: String,
    ChannelID: String,
}))