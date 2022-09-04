const { model, Schema } = require('mongoose')

module.exports = model("Features", new Schema({
    GuildID: {
        type: String
    },
    Welcome: Boolean,
    Leave: Boolean,
    Logs: Boolean,
    CaptchaSystem: Boolean,
    ConfessionSystem: Boolean,
    AutoModSystem: Boolean,
    LevelSystem: Boolean,
    EconomySystem: Boolean,
}))