function isValidHexColor(color) {
    var RegExp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
    return RegExp.test(color)
}

module.exports = { isValidHexColor }