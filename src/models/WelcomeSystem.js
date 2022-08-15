const { model, Schema } = require('mongoose')

module.exports = model("Welcome", new Schema({
    GuildID: String,
    RoleID: String,
    ChannelID: String,
    Message: String,
}))