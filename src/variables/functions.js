import React from 'react'
import { parsePhoneNumber } from 'libphonenumber-js'
import { colors } from '@material-ui/core'
var moment = require('moment')
var _ = require('lodash')

export async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	}
}
export function getContrast(hexcolor, reverse) {
	if (hexcolor) {

		var r = parseInt(hexcolor.substr(1, 2), 16)
		var g = parseInt(hexcolor.substr(3, 2), 16)
		var b = parseInt(hexcolor.substr(5, 2), 16)
		var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
		let white = 'white'
		let black = 'black'
		if (reverse) {
			return (yiq >= 128) ? white : black
		}
		else {
			return (yiq >= 128) ? black : white
		}
	}
	return 'inherit'
}


export const scrollToAnchor = (id) => {
	let el = document.getElementById(id.substring(1, id.length))
	if (el) {
		let topOfElement = el.offsetTop - 130
		window.scroll({ top: topOfElement, behavior: 'smooth' })
	}
}
export const selectAll = containerid => {
	var range = {}
	if (document.selection) { // IE
		range = document.body.createTextRange()
		range.moveToElementText(document.getElementById(containerid))
		range.select()
	} else if (window.getSelection) {
		range = document.createRange()
		range.selectNode(document.getElementById(containerid))
		window.getSelection().removeAllRanges()
		window.getSelection().addRange(range)
	}

}
export const copyToClipboard = str => {

	let el = document.createElement('textarea')  // Create a <textarea> element
	el.value = str                                 // Set its value to the string that you want copied
	// el.value = 'andrei@webhouse.dk'
	el.setAttribute('readonly', '')                // Make it readonly to be tamper-proof
	el.style.position = 'absolute'
	// el.style.left = '-9999px';
	el.style.background = '#fff'
	el.style.zIndex = '-999'                      // Move outside the screen to make it invisible
	document.body.appendChild(el)                  // Append the <textarea> element to the HTML document
	const selected =
		document.getSelection().rangeCount > 0        // Check if there is any content selected previously
			? document.getSelection().getRangeAt(0)     // Store selection if found
			: false                                    // Mark as false to know no selection existed before
	// el.focus()
	el.select()                                    // Select the <textarea> content
	document.execCommand('copy')                   // Copy - only works as a result of a user action (e.g. click events)
	document.body.removeChild(el)                  // Remove the <textarea> element
	if (selected) {                                 // If a selection existed before copying
		document.getSelection().removeAllRanges()    // Unselect everything on the HTML document
		document.getSelection().addRange(selected)   // Restore the original selection
	}
	navigator.clipboard.writeText(str).then(function () {
		console.info('Async: Copying to clipboard was successful!')
	}, function (err) {
		console.error('Async: Could not copy text: ', err)
	})
}

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
export const allMinutesToArr = (from, to) => {
	let startDate = moment(from)
	let endDate = moment(to)
	let arr = []
	let d = startDate.clone()
	while (d <= endDate) {
		arr.push(d.toDate())
		d = d.clone().add(1, 'm')
	}
}
export const minutesToArray = (from, to) => {
	let startDate = moment(from)
	let endDate = moment(to)
	// console.log(from, to)
	let d = startDate
	let diff = moment.duration(endDate.diff(startDate)).asMinutes()
	let amount = diff > 15 ? diff > 30 ? diff > 60 ? diff > 120 ? diff > 240 ? 60 : 45 : 30 : 15 : 10 : 1
	// if (window.innerWidth < 426)
	// 	amount = diff > 30 ? diff > 60 ? diff > 120 ? diff > 240 ? 60 : 45 : 30 : 15 : 1
	let arr = []
	while (d <= endDate) {
		arr.push(d.toDate())
		d = d.clone().add(amount, 'm')
	}
	arr.push(endDate)
	return arr
}
export const allHoursToArr = (from, to) => {
	let startDate = moment(from)
	let endDate = moment(to)
	let arr = []
	let d = startDate.clone()
	while (d <= endDate) {
		arr.push(d.toDate())
		d = d.clone().add(1, 'h')
	}
}
export const hoursToArr = (from, to) => {
	let startDate = moment(from)
	let endDate = moment(to).add(1, 'hour')
	let diff = moment.duration(endDate.diff(startDate)).asHours()
	let amount = 1
	amount = diff > 10 ? diff > 20 ? diff > 35 ? 30 : 5 : 3 : 1
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
export const isWeekend = (date) => {
	return moment(date, 'YYYY-MM-DD HH:mm:ss').day() === 6 || moment(date).day() === 0 ? true : false
}
export const allDatesToArr = (from, to) => {
	let startDate = moment(from)
	let endDate = moment(to)
	let arr = []
	let d = startDate.clone()
	while (d <= endDate) {
		arr.push(d.toDate())
		d = d.clone().add(1, 'd')
	}
	return arr
}
export const datesToArr = (from, to) => {
	let startDate = moment(from)
	let endDate = moment(to).add(1, 'd')
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
	return arr
}
const renderColor = (color) => {
	return <div style={{ background: color[500], width: 24, height: 24, borderRadius: 4 }} />
}
export const weekendColorsDropdown = (t) => {
	return [
		{ value: 'lightBlue', label: t('settings.chart.weekendColors.lightBlue'), icon: renderColor(colors.lightBlue) },
		{ value: 'cyan', label: t('settings.chart.weekendColors.cyan'), icon: renderColor(colors.cyan) },
		{ value: 'teal', label: t('settings.chart.weekendColors.teal'), icon: renderColor(colors.teal) },
		{ value: 'green', label: t('settings.chart.weekendColors.green'), icon: renderColor(colors.green) },
		{ value: 'lightGreen', label: t('settings.chart.weekendColors.lightGreen'), icon: renderColor(colors.lightGreen) },
		{ value: 'lime', label: t('settings.chart.weekendColors.lime'), icon: renderColor(colors.lime) },
		{ value: 'yellow', label: t('settings.chart.weekendColors.yellow'), icon: renderColor(colors.yellow) },
		{ value: 'amber', label: t('settings.chart.weekendColors.amber'), icon: renderColor(colors.amber) },
		{ value: 'orange', label: t('settings.chart.weekendColors.orange'), icon: renderColor(colors.orange) },
		{ value: 'deepOrange', label: t('settings.chart.weekendColors.deepOrange'), icon: renderColor(colors.deepOrange) },
		{ value: 'red', label: t('settings.chart.weekendColors.red'), icon: renderColor(colors.red) },
		{ value: 'pink', label: t('settings.chart.weekendColors.pink'), icon: renderColor(colors.pink) },
		{ value: 'purple', label: t('settings.chart.weekendColors.purple'), icon: renderColor(colors.purple) },
		{ value: 'deepPurple', label: t('settings.chart.weekendColors.deepPurple'), icon: renderColor(colors.deepPurple) },
		{ value: 'indigo', label: t('settings.chart.weekendColors.indigo'), icon: renderColor(colors.indigo) },
		{ value: 'blue', label: t('settings.chart.weekendColors.blue'), icon: renderColor(colors.blue) },
	]
}
export const weekendColors = (id, colorStr) => {
	// return red[400]
	switch (id % 4) {
		case 0:
			return colors[colorStr][300]
		case 1:
			return colors[colorStr][500]
		case 2:
			return colors[colorStr][700]
		case 3:
			return colors[colorStr][900]
		default:
			break
	}
}
const upperCaseFirstChar = str => str.charAt(0).toUpperCase() + str.substr(1)
export const dateFormat = (date, upc) => {
	let newDate = moment(date)
	if (newDate.isBetween(moment().subtract(7, 'day'), moment().add(7, 'day')))
		return upc ? upperCaseFirstChar(moment(date).calendar()) : moment(date).calendar()
	else
		return upc ? upperCaseFirstChar(moment(date).fromNow()) : moment(date).fromNow()
}

const isObject = (obj) => {
	return obj === Object(obj)
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
		var filtered = arr.filter(c => {
			var keys = Object.keys(c)
			var contains = keys.map(key => {
				if (c)
					return keyTester(c[key], keyword ? keyword : '')
				return false

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
const sortFunc = (a, b, orderBy, way, type) => {
	let newA = _.get(a, orderBy)
	let newB = _.get(b, orderBy)
	switch (type) {
		case 'string':
			if (way) {
				return newA.toString().toLowerCase() < newB.toString().toLowerCase() ? -1 : 1
			}
			else {
				return newB.toString().toLowerCase() <= newA.toString().toLowerCase() ? -1 : 1
			}
		case 'date':
			return way ? moment(new Date(newA)).diff(new Date(newB)) : moment(new Date(newB)).diff(new Date(newA))
		case 'number':
		case undefined:
			if (way) {
				return (newA === null || newA === undefined) - (newB === null || newB === undefined) || +(newA > newB) || -(newA < newB)
			}
			else {
				return -(newA > newB) || +(newA < newB) || (newA === null || newA === undefined) - (newB === null || newB === undefined)
			}
		default:
			break
	}
	// if (moment(new Date(newA)).isValid() || moment(new Date(newB)).isValid()) {
	// }
	// if (typeof newA === 'number' || typeof newA === 'undefined') {

	// }
	// else {

	// }
}
/**
 * Handle Sorting
 * @param {String} property
 * @param {String} way
 * @param {Array} data
 */
export const handleRequestSort = (property, way, data) => {
	const orderBy = property
	let newData = []
	newData = data.sort((a, b) => sortFunc(a, b, orderBy, way === 'desc' ? false : true))
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
 * Transform String to camelCase standard
 * @param {String} str
 */
export const camelCase = (str) => {
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
		return index === 0 ? word.toLowerCase() : word.toUpperCase()
	}).replace(/\s+/g, '')
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
	if (dt === 'Invalid date') {
		return false
	}
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
	return [0 | D, '\u00B0', 0 | (D < 0 ? D = -D : D) % 1 * 60, "' ", 0 | D * 60 % 1 * 60, '"', D < 0 ? lng ? 'W' : 'S' : lng ? 'E' : 'N'].join('')
}
const globalSuggestionSlicer = (obj) => {
	var arr = []
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			var innerObj = {}
			if (typeof obj[prop] === 'object') {
				arr.push(...globalSuggestionSlicer(obj[prop]))
			}
			else {
				innerObj = obj[prop] ? obj[prop].toString() : ''
				// id: prop.toString().toLowerCase(),
				arr.push({ value: innerObj, field: prop })
			}
		}
	}
	return arr
}
const suggestionSlicer = (obj) => {
	var arr = []
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			var innerObj = {}
			if (typeof obj[prop] === 'object') {
				arr.push(...suggestionSlicer(obj[prop]))
			}
			else {
				innerObj = {
					id: prop.toString().toLowerCase(),
					label: obj[prop] ? obj[prop].toString() : ''
				}
				arr.push(innerObj)
			}
		}
	}
	return arr
}
export const globalSuggestionGen = (obj) => {
	// let arr = []
	// arrayOfObjs.forEach(obj => {
	// arr.push()
	// })
	return globalSuggestionSlicer(obj)
}
export const suggestionGen = (arrayOfObjs) => {
	let arr = []
	arrayOfObjs.forEach(obj => {
		arr.push(...suggestionSlicer(obj))
	})
	arr = _.uniqBy(arr, 'label')
	return arr
}
export const shortHashGen = (source) => {
	// Generate the UID from two parts here
	// to ensure the random number provide enough bits.
	var firstPart = (Math.random() * 46656) | 0
	var secondPart = (Math.random() * 46656) | 0
	firstPart = ("000" + firstPart.toString(36)).slice(-3)
	secondPart = ("000" + secondPart.toString(36)).slice(-3)
	return firstPart + secondPart;
}