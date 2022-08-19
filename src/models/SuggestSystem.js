const { model, Schema } = require('mongoose')

module.exports = model("Suggest", new Schema({
    GuildID: String,
    MessageID: String,
    Details: Array
}))