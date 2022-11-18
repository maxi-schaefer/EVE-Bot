const { model, Schema } = require('mongoose')

module.exports = model("Premium", new Schema({
    GuildID: String,
    Premium: Boolean
}))