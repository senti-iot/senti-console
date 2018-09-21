var moment = require('moment');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
var PNF = require('google-libphonenumber').PhoneNumberFormat
export const pF = (phone) => {
	let formattedPhone = phoneUtil.parse(phone, "DK")
	return phoneUtil.format(formattedPhone, PNF.NATIONAL);
}
export const dateTimeFormatter = (date, withSeconds) => {
	var dt
	if (withSeconds)
		dt = moment(date).format("DD.MM.YYYY HH:mm:ss")
	else
		dt = moment(date).format("DD.MM.YYYY HH:mm")
	return dt
}
export const dateFormatter = (date) => {
	var a = moment(date).format("DD.MM.YYYY")
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
	return arr;
}