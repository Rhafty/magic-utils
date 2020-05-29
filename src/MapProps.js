const R = require('ramda')

module.exports = (obj, propsArr) => {
	let returnObj = {}

	propsArr.forEach(p => {
		let propPath = p.split('.')
		let objValue = R.path(propPath, obj)
		returnObj = R.assocPath(propPath, objValue, returnObj)
	})

	return returnObj
}
