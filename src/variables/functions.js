var moment = require('moment');

export const dateFormatter = (date) => {
	var a = moment(date).format("DD.MM.YYYY")
	// console.log(a)
	return a
}