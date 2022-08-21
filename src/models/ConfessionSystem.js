const { model, Schema } = require('mongoose')

module.exports = model("Confession", new Schema({
    GuildID: String,
    MemberID: String,
    ChannelID: String,
    MessageID: String,
}))