/**
 * Adds newline characters to a long string, dividing it into lines of `lineLength` characters
 * @param {String} inputStr
 * @param {Number} lineLength
 */
module.exports = function (inputStr, lineLength = 40, flexible = true) {
	return inputStr.replace(new RegExp(`(.{1,${lineLength}})(\\s${flexible ? '+' : '*'}|$)`, 'g'), '$1\n').trim()
}
