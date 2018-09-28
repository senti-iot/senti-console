var moment = require('moment');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
var PNF = require('google-libphonenumber').PhoneNumberFormat

export const dateFormat = (date) => {
	let newDate = moment(date)
	if (newDate.isBetween(moment().subtract(7, "day"), moment().add(7, "day")))
		return moment(date).calendar()
	else
		return moment(date).fromNow()
}
const isObject = (obj) => {
	return obj === Object(obj);
}
const filterByDate = (items, filters) => {
	const { startDate, endDate } = filters
	var arr = items
	var keys = Object.keys(arr[ 0 ])
	var filteredByDate = arr.filter(c => {
		var contains = keys.map(key => {
			var openDate = moment(c[ 'open_date' ])
			var closeDate = moment(c[ 'close_date' ])
			if (openDate > startDate
				&& closeDate < (endDate ? endDate : moment())) {
				return true
			}
			else
				return false
		})
		return contains.indexOf(true) !== -1 ? true : false
	})
	return filteredByDate
}

export const filterItems = (data, filters) => {
	const { activeDateFilter, keyword } = filters
	var arr = data
	if (activeDateFilter)
		arr = filterByDate(arr, filters)
	if (arr) {
		if (arr[ 0 ] === undefined)
			return []
		var keys = Object.keys(arr[ 0 ])
		var filtered = arr.filter(c => {
			var contains = keys.map(key => {
				return keyTester(c[ key ], keyword ? keyword : "")

			})
			return contains.indexOf(true) !== -1 ? true : false
		})
		return filtered
	}
}
export const keyTester = (obj, sstr) => {
	let searchStr = sstr.toLowerCase()
	let found = false
	if (isObject(obj)) {
		for (var k in obj) {
			if (!found) {
				if (k instanceof Date) {
					let date = moment(obj[ k ]).format("DD.MM.YYYY")
					found = date.toLowerCase().includes(searchStr)
				}
				else {
					if (isObject(obj[ k ])) {
						found = keyTester(obj[ k ], sstr)
					}
					else {
						found = obj[ k ] ? obj[ k ].toString().toLowerCase().includes(searchStr) : false
					}
				}
			}
			else {
				break
			}
		}
	}
	else {
		found = obj ? obj.toString().toLowerCase().includes(searchStr) : null
	}
	return found
}
export const pF = (phone) => {
	let formattedPhone = phoneUtil.parse(phone, "DK")
	return phoneUtil.format(formattedPhone, PNF.NATIONAL);
}
export const dateTimeFormatter = (date, withSeconds) => {
	var dt
	if (withSeconds)
		dt = moment(date).format("DD MMMM YYYY HH:mm:ss")
	else
		dt = moment(date).format("DD MMMM YYYY HH:mm")
	return dt
}
export const dateFormatter = (date) => {
	var a = moment(date).format("DD MMMM YYYY")
	return a
}
export const ConvertDDToDMS = (D, lng) => {
	return [ 0 | D, '\u00B0', 0 | (D < 0 ? D = -D : D) % 1 * 60, "' ", 0 | D * 60 % 1 * 60, '"', D < 0 ? lng ? 'W' : 'S' : lng ? 'E' : 'N' ].join('');
}

const suggestionSlicer = (obj) => {
	var arr = [];

	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			var innerObj = {};
			if (typeof obj[ prop ] === 'object') {
				arr.push(...suggestionSlicer(obj[ prop ]))
			}
			else {
				innerObj = {
					id: prop.toString().toLowerCase(),
					label: obj[ prop ] ? obj[ prop ].toString() : ''
				};
				arr.push(innerObj)
			}
		}
	}
	return arr;
}
export const suggestionGen = (arrayOfObjs) => {
	let arr = [];
	arrayOfObjs.map(obj => {
		arr.push(...suggestionSlicer(obj))
		return ''
	})
	return arr;
}