const { model, Schema } = require('mongoose');

module.exports = model("Warns", new Schema({
    GuildID: String,
    UserID: String,
    Warns: Number
}))