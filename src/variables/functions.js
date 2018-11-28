import { parsePhoneNumber } from 'libphonenumber-js'
var moment = require('moment');
var _ = require('lodash')


export const dateDiff = (from, to) => {
	let diff = moment.duration(from.diff(to)).asMinutes()
	if (diff > 60 * 24 * 30)
		return 3
	if (diff < 60 * 24 && diff > 60)
		return 1
	if (diff > 60 * 24 * 2)
		return 2
	if (diff > 60)
		return 1
	else {
		return 0
	}
}

export const minutesToArray = (from, to) => {
	let startDate = moment(from)
	let endDate = moment(to)
	let d = startDate
	let diff = moment.duration(endDate.diff(startDate)).asMinutes()
	let amount = diff > 60 ? diff > 120 ? diff > 240 ? 60 : 45 : 30 : 15
	if (window.innerWidth < 426)
		amount = diff > 60 ? diff > 120 ? diff > 240 ? 60 : 45 : 30 : 15
	let arr = []
	while (d <= endDate) {
		arr.push(d.toDate())
		d = d.clone().add(amount, 'm')
	}
	return arr
}

export const hoursToArr = (from, to) => {
	let startDate = moment(from)
	let endDate = moment(to)
	let diff = moment.duration(endDate.diff(startDate)).asHours()
	let amount = diff > 10 ? diff > 20 ? diff > 35 ? 30 : 5 : 3 : 1
	if (window.innerWidth < 426)
		amount = diff > 5 ? diff > 10 ? diff > 20 ? diff > 35 ? 30 : 5 : 3 : 3 : 1
	let arr = []
	let d = startDate.clone()
	while (d <= endDate) {
		arr.push(d.toDate())
		d = d.clone().add(amount, 'h')
	}
	return arr
}

export const datesToArr = (from, to) => {
	let startDate = moment(from)
	let endDate = moment(to)
	let diff = moment.duration(endDate.diff(startDate)).asDays()
	let amount = diff > 10 ? diff > 20 ? diff > 35 ? 15 : 5 : 3 : 1
	if (window.innerWidth < 426)
		amount = diff > 5 ? (diff > 10 ? (diff > 20 ? (diff > 35 ? 30 : 10) : 5) : 3) : 1
	let arr = []
	let d = startDate.clone()
	while (d <= endDate) {
		arr.push(d.toDate())
		d = d.clone().add(amount, 'd')
	}
	// 
	return arr
}

export const dateFormat = (date) => {
	let newDate = moment(date)
	if (newDate.isBetween(moment().subtract(7, 'day'), moment().add(7, 'day')))
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
	var keys = Object.keys(arr[0])
	var filteredByDate = arr.filter(c => {
		var contains = keys.map(key => {
			var openDate = moment(c['open_date'])
			var closeDate = moment(c['close_date'])
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
		if (arr[0] === undefined)
			return []
		var keys = Object.keys(arr[0])
		var filtered = arr.filter(c => {
			var contains = keys.map(key => {
				return keyTester(c[key], keyword ? keyword : '')

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
					let date = dateFormatter(obj[k])
					found = date.toLowerCase().includes(searchStr)
				}
				else {
					if (isObject(obj[k])) {
						found = keyTester(obj[k], sstr)
					}
					else {
						found = obj[k] ? obj[k].toString().toLowerCase().includes(searchStr) : false
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
const sortFunc = (a, b, orderBy, way) => {
	let newA = _.get(a, orderBy) ? _.get(a, orderBy) : ''
	let newB = _.get(b, orderBy) ? _.get(b, orderBy) : ''
	if (typeof newA === 'number')
		if (way) {
			return newB <= newA ? -1 : 1
		}
		else {
			return newA < newB ? -1 : 1
		}
	else {
		if (way) {
			return newB.toString().toLowerCase() <= newA.toString().toLowerCase() ? -1 : 1
		}
		else {
			return newA.toString().toLowerCase() < newB.toString().toLowerCase() ? -1 : 1
		}
	}
}
/**
 * Handle Sorting
 * @param {String} property 
 * @param {String} way 
 * @param {Array} data 
 */
export const handleRequestSort = (property, way, data) => {
	const orderBy = property;
	let order = way;
	let newData = []
	newData =
		order === 'desc'
			? data.sort((a, b) => sortFunc(a, b, orderBy, true))
			: data.sort((a, b) => sortFunc(a, b, orderBy, false))
	return newData
}
/**
 * Phone Formatter
 * @param {String} phone 
 */
export const pF = (phone) => {
	let phoneNumber
	try {
		phoneNumber = parsePhoneNumber(phone, 'DK')
	}
	catch (error) {
		return phone
	}
	return phoneNumber.formatInternational()
}
/**
 * Date Time Formatter
 * @param {Date} date 
 * @param {boolean} withSeconds 
 */
export const dateTimeFormatter = (date, withSeconds) => {
	var dt
	if (withSeconds)
		dt = moment(date).format('DD MMMM YYYY HH:mm:ss')
	else
		dt = moment(date).format('lll')
	return dt
}
/**
 * Short Date 'll' format
 * @param {Date} date 
 */
export const shortDateFormat = (date) => {
	var a = moment(date).format('ll')
	return a
}
/**
 * Date Formatter 'LL' format
 * @param {Date} date 
 */
export const dateFormatter = (date) => {
	var a = moment(date).format('LL')
	return a
}
export const timeFormatter = (date) => {
	var a = moment(date).format('HH:mm')
	return a
}
export const ConvertDDToDMS = (D, lng) => {
	return [0 | D, '\u00B0', 0 | (D < 0 ? D = -D : D) % 1 * 60, "' ", 0 | D * 60 % 1 * 60, '"', D < 0 ? lng ? 'W' : 'S' : lng ? 'E' : 'N'].join('');
}

const suggestionSlicer = (obj) => {
	var arr = [];
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			var innerObj = {};
			if (typeof obj[prop] === 'object') {
				arr.push(...suggestionSlicer(obj[prop]))
			}
			else {
				innerObj = {
					id: prop.toString().toLowerCase(),
					label: obj[prop] ? obj[prop].toString() : ''
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
	arr = _.uniqBy(arr, 'label')
	return arr;
}