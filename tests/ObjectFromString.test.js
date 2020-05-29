const { ObjectFromString } = require('../src')

describe('ObjectFromString', () => {
	it('converts string to object containing values from string', () => {
		expect(ObjectFromString('matches 0-127/166', '#resource# #min#-#max#/#total#')).toEqual({
			resource: 'matches',
			min: '0',
			max: '127',
			total: '166',
		})
	})
	it(`respects 'types' and 'symbol' options`, () => {
		expect(
			ObjectFromString('gunther +min+-127/166', '+resource+ ++min++-+max+/+total+', {
				types: {
					resource: val => val && val.toUpperCase(),
					min: Number,
					total: Number,
				},
				symbol: '+',
			})
		).toEqual({ resource: 'GUNTHER', max: '127', total: 166 })
	})
	it("respects the 'convert' option", () => {
		expect(ObjectFromString('matches 0-127/166', '#resource# #min#-#max#/#total#', { convert: Number })).toEqual({
			resource: NaN,
			min: 0,
			max: 127,
			total: 166,
		})
	})
	it('can find a value in the middle of a long string', () => {
		expect(ObjectFromString('https://steamcommunity.com/openid/id/8797918237/abc', '/id/#value#/')).toEqual({
			value: '8797918237',
		})
	})
})
