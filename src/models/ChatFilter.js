const { model, Schema } = require('mongoose')

module.exports = model('ChatFilter', new Schema({
    GuildID: String,
    Wordlist: Array
}))