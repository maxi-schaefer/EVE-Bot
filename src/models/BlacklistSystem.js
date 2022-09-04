const { model, Schema } = require('mongoose');

module.exports = model('BlacklistSystem', new Schema({
    GuildID: String,
}))