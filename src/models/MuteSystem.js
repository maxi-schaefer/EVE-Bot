const { model, Schema } = require('mongoose')

module.exports = model("MuteSystem", new Schema({
    GuildID: String,
    UserID: String,
    Data: Array
}))