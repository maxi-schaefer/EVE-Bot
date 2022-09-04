const { model, Schema } = require('mongoose')

/**
 * - roleID: String,
 * - roleDescription: String,
 * - roleEmoji: String
 */

module.exports = model('ReactionRoles', new Schema({
    GuildID: String,
    MessageID: String,
    Roles: Array
}))