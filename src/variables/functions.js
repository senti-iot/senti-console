var moment = require('moment');

export const dateFormatter = (date) => {
	var a = moment(date).format("DD.MM.YYYY")
	// console.log(a)
	return a
}
export const ConvertDDToDMS = (D, lng) => {
	return [0 | D, ' \u00B0', 0 | (D < 0 ? D = -D : D) % 1 * 60, "' ", 0 | D * 60 % 1 * 60, '"', D < 0 ? lng ? 'W' : 'S' : lng ? 'E' : 'N'].join('');
	// return {
	// dir: D < 0 ? lng ? 'W' : 'S' : lng ? 'E' : 'N',
	// deg: 0 | (D < 0 ? D = -D : D),
	// min: 0 | D % 1 * 60,
	// sec: (0 | D * 60 % 1 * 6000) / 100
	// };
}