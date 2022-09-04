const { model, Schema } = require('mongoose')

module.exports = model("Confession", new Schema({
    GuildID: String,
    MemberID: String,
    MessageID: String,
    ConfessionID: Number,
    ChannelID: String
}))