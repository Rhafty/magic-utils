//@ts-check

/**
 * @typedef {object} ObjectFromStringOptions
 * @property {{[key:string]:function}} [types] - Object with `key`:`value` pairs where the value is a function with the value from the source string as its parameter,
 * and returns the final value of the key in the object.
 * @property {string} [symbol] - Symbol object-keys are surrounded by. Default is `#`.
 * @property {function} [convert] - A function to run every value found in the string through before getting assigned to the final object. This function runs before the function in `types`
 */
// TYPEDEFS

/**
 * Escape a string so it can safely be used in a RegExp constructor.
 * @param {string} str - String to escape.
 */
function escapeRegExp(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Creates a RegExp that matches valid JS Object keys surrounded by `symbol` with flags `flags`.
 * @param {String} symbol - Symbol which keys are surrounded by.
 * @param {String} flags - RegExp-flags. Default `gi`.
 */
const createKeyRegex = function (symbol, flags = 'gi') {
	let escapedSymbol = escapeRegExp(symbol)
	return new RegExp(`(?<=[^${symbol}]+|^)${escapedSymbol}([\\w\\d-_]+)${escapedSymbol}`, flags)
}
/**
 * Creates an object with values taken from a string. What keys to create and what values to give to those keys are chosen by writing a
 * `test`. A `test` is the source string with the values you wish to extract
 * replaced by the desired object keys, where the keys are surronded by a `symbol`. If the defined `symbol` is used in the source string, you can escape it by adding another `symbol` before it.
 * Example: With `symbol: '#'`,`source: 'a test #value 123'` and `test: 'a test ##value #actualValue#'`, the final object will be `{actualValue:'123'}`
 * @param {string} source - String to extract values from
 * @param {string} test - `source`-string with values you wish to extract replaced by desired key surrounded by `symbol`.
 * @param {ObjectFromStringOptions} options - Options object
 */
const ObjectFromString = function (source = '', test = '', { types = {}, symbol = '#', convert } = {}) {
	let final = {}
	let escapedSymbol = escapeRegExp(symbol)
	let matches = test.match(createKeyRegex(symbol)) || []

	matches.forEach(match => {
		let key = match.replace(new RegExp(escapedSymbol, 'gi'), '')

		let surroundingSymbols = (test.match(new RegExp(`[^${symbol}]*${escapeRegExp(match)}[^${symbol}]*`, 'gi')) || [])[0]
		let [before, after] = surroundingSymbols.split(match)
		let rgx = new RegExp(`(?<=${escapeRegExp(before)}).+(?=${escapeRegExp(after)})`, 'gi')
		let val = (source.match(rgx) || [null])[0]

		if (convert && typeof convert === 'function') val = convert(val)
		if (key in types && typeof types[key] === 'function') final[key] = types[key](val)
		else final[key] = val
	})
	return final
}

module.exports = ObjectFromString
