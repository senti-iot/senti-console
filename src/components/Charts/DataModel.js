import { dateTimeFormatter, datesToArr, hoursToArr, minutesToArray, isWeekend, weekendColors } from 'variables/functions';
import { teal } from '@material-ui/core/colors'
import moment from 'moment'
import { colors } from 'variables/colors';
import {
	getDataHourly as getDeviceDataHourly,
	getDataDaily as getDeviceDataDaily,
	getDataMinutely as getDeviceDataMinutely
} from 'variables/dataDevices';
import { getDataHourly, getDataDaily, getDataMinutely } from 'variables/dataCollections';

const format = 'YYYY-MM-DD+HH:mm'

const linecolors = (data, defaultColor, id) => {
	let colors = []
	data.map(d => {
		if (isWeekend(d[0])) {
			return colors.push(weekendColors(id))
		} else {
			return colors.push(defaultColor)
		}
	})
	return colors
}

const regenerateData = (d, unit) => {
	if (d) {
		let data = {}
		Object.keys(d).map((dt, i) => {
			if (i === Object.keys(d).length - 1) {
				//Today Handling
				if (unit === 'day' && moment(dt).diff(moment(), 'days') === 0) {
					if (moment().diff(moment(dt), 'minutes') <= 60) {
						data[moment(dt).format('YYYY-MM-DD HH:mm')] = d[dt]
					}
					else
						data[moment().format('YYYY-MM-DD HH:mm')] = d[dt]
				}
				else {
					if ((unit === 'minute' || unit === 'hour') && moment().diff(moment(dt), 'minute') <= 60) {
						data[moment().format('YYYY-MM-DD HH:mm')] = d[dt]
					}
					else {
						data[moment(dt).add(1, unit).format('YYYY-MM-DD HH:mm')] = d[dt]
					}
				}
				return true
			}
			else {
				//Normal ones
				data[moment(dt).add(1, unit).format('YYYY-MM-DD HH:mm')] = d[dt]
				return true
			}
		})
		return data
	}
	else return null
}

export const setExportData = (dataArr, unit) => {
	let dataSets = dataArr
	let newData = []
	if (dataSets) {
		dataSets.map(d =>
			Object.entries(d.data).map((dt, i) => {
				return newData.push({
					dcId: d.dcId,
					dcName: d.dcName,
					org: d.org,
					project: d.project,
					lat: d.lat,
					long: d.long,
					id: d.id,
					startDate: d.data.length - 1 === i && moment().diff(moment(dt[0]), unit) === 0 ? moment(dt[0]).startOf(unit).format('DD-MM-YYYY HH:mm') : moment(dt[0]).subtract(1, unit).format('DD-MM-YYYY HH:mm'),
					endDate: moment(dt[0]).format('DD-MM-YYYY HH:mm'),
					count: dt[1]
				})
			}
			)
		)
	}
	return newData

}
export const setSummaryData = (dataArr, from, to) => {
	let displayTo = dateTimeFormatter(to)
	let displayFrom = dateTimeFormatter(from)
	let state = {
		loading: false,
		timeType: 2,
		lineDataSets: null,
		roundDataSets: null,
		barDataSets: null
	}
	if (dataArr.length > 0) {
		state = {
			title: `${displayFrom} - ${displayTo}`,
			loading: false,
			timeType: 3,
			roundDataSets: {
				labels: Object.entries(dataArr[0].data).map(l => [moment(l[0]).format('ll'), moment(l[0]).format('dddd'), l[1]]),
				datasets: dataArr.map((d) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: Object.entries(d.data).map((d, i) => colors[i]),
					label: [d.name],
					data: Object.entries(d.data).map(d => d[1])
				}))

			}
		}
	}
	return state
}

export const getWifiDaily = async (type, objArr, from, to, hoverId, raw) => {
	let startDate = moment(from).format(format)
	let endDate = moment(to).format(format)
	let dataArr = []
	let dataSet = null
	let data = null
	await Promise.all(objArr.map(async o => {
		if (type === 'device')
			data = await getDeviceDataDaily(o.id, startDate, endDate, raw)
		else {
			data = await getDataDaily(o.id, startDate, endDate, raw)
		}
		dataSet = {
			name: o.name,
			id: o.id,
			lat: o.lat,
			long: o.long,
			org: o.orgName,
			data: regenerateData(data, 'day'),
			...o,
		}
		return dataArr.push(dataSet)
	}))
	//Filter nulls
	dataArr = dataArr.reduce((newArr, d) => {
		if (d.data !== null)
			newArr.push(d)
		return newArr
	}, [])
	let newState = setDailyData(dataArr, from, to, hoverId)
	let exportData = setExportData(dataArr, 'day')
	return { ...newState, exportData, dataArr }
}

export const setDailyData = (dataArr, from, to, hoverID) => {
	let labels = datesToArr(from, to)
	let state = {
		loading: false,
		timeType: 2,
		lineDataSets: null,
		roundDataSets: null,
		barDataSets: null
	}

	if (dataArr.length > 0) {
		state = {
			loading: false,
			timeType: 2,
			lineDataSets: {
				labels: labels,
				datasets: dataArr.map((d, index) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: d.color,
					borderColor: d.color,
					colors: linecolors(Object.entries(d.data), d.color, index),
					borderWidth: hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			},
			barDataSets: {
				labels: labels,
				datasets: dataArr.map((d, index) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: linecolors(Object.entries(d.data), d.color, index),
					borderColor: teal[500],
					borderWidth: hoverID === d.id ? 4 : 0,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			},
			roundDataSets: {
				labels: Object.entries(dataArr[0].data).map(l => [moment(l[0]).format('ll'), moment(l[0]).format('dddd'), l[1]]),
				datasets: dataArr.map((d) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: Object.entries(d.data).map((d, i) => colors[i]),
					label: [d.name],
					data: Object.entries(d.data).map(d => d[1])
				}))

			}
		}
	}
	return state
}

export const getWifiHourly = async (type, objArr, from, to, hoverId, raw) => {
	let startDate = moment(from).format(format)
	let endDate = moment(to).format(format)
	let dataArr = []
	let dataSet = null
	let data = null
	await Promise.all(objArr.map(async o => {
		if (type === 'device')
			data = await getDeviceDataHourly(o.id, startDate, endDate, raw)
		else {
			data = await getDataHourly(o.id, startDate, endDate, raw)
		}
		dataSet = {
			name: o.name,
			id: o.id,
			lat: o.lat,
			long: o.long,
			org: o.orgName,
			data: regenerateData(data, 'hour'),
			...o,
		}
		return dataArr.push(dataSet)
	}))
	//Filter nulls
	dataArr = dataArr.reduce((newArr, d) => {
		if (d.data !== null)
			newArr.push(d)
		return newArr
	}, [])
	let newState = setHourlyData(dataArr, from, to, hoverId)
	let exportData = setExportData(dataArr, 'hour')
	return { ...newState, exportData, dataArr }
}

export const setHourlyData = (dataArr, from, to, hoverID) => {
	let labels = hoursToArr(from, to)
	let state = {
		loading: false,
		timeType: 2,
		lineDataSets: null,
		roundDataSets: null,
		barDataSets: null
	}
	if (dataArr.length > 0) {
		state = {
			loading: false,
			timeType: 1,
			lineDataSets: {
				labels: labels,
				datasets: dataArr.map((d) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: d.color,
					borderColor: d.color,
					colors: [d.color],
					borderWidth: hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			},
			barDataSets: {
				labels: labels,
				datasets: dataArr.map((d) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: hoverID === d.id ? 4 : 0,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			},
			roundDataSets: {
				labels: Object.entries(dataArr[0].data).map(l => [moment(l[0]).format('HH:mm'), moment(l[0]).format('dddd'), l[1]]),
				datasets: dataArr.map((d, i) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: Object.entries(d.data).map((d, i) => colors[i]),
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => d[1])
				}))
			},
		}
	}
	return state
}
export const getWifiMinutely = async (type, objArr, from, to, hoverId, raw) => {
	let startDate = moment(from).format(format)
	let endDate = moment(to).format(format)
	let dataArr = []
	let dataSet = null
	let data = null
	await Promise.all(objArr.map(async o => {
		if (type === 'device')
			data = await getDeviceDataMinutely(o.id, startDate, endDate, raw)
		else {
			data = await getDataMinutely(o.id, startDate, endDate, raw)
		}
		dataSet = {
			name: o.name,
			id: o.id,
			lat: o.lat,
			long: o.long,
			org: o.orgName,
			data: regenerateData(data, 'minute'),
			...o,
		}
		return dataArr.push(dataSet)
	}))
	//Filter nulls
	dataArr = dataArr.reduce((newArr, d) => {
		if (d.data !== null)
			newArr.push(d)
		return newArr
	}, [])
	let newState = setMinutelyData(dataArr, from, to, hoverId)
	let exportData = setExportData(dataArr, 'minute')
	return { ...newState, exportData, dataArr }
}

export const setMinutelyData = (dataArr, from, to, hoverID) => {
	let labels = minutesToArray(from, to)
	let state = {
		loading: false,
		timeType: 2,
		lineDataSets: null,
		roundDataSets: null,
		barDataSets: null
	}
	if (dataArr.length > 0) {
		state = {
			loading: false,
			lineDataSets: {
				labels: labels,
				datasets: dataArr.map((d) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: d.color,
					colors: [d.color],
					borderColor: d.color,
					borderWidth: hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				})),
				barDataSets: {
					labels: labels,
					datasets: dataArr.map((d) => ({
						id: d.id,
						lat: d.lat,
						long: d.long,
						backgroundColor: d.color,
						borderColor: d.color,
						borderWidth: hoverID === d.id ? 4 : 0,
						fill: false,
						label: [d.name],
						data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
					}))
				},
				roundDataSets: {
					labels: Object.entries(dataArr[0].data).map(l => [moment(l[0]).format('HH:mm'), moment(l[0]).format('dddd'), l[1]]),
					datasets: dataArr.map((d, i) => ({
						id: d.id,
						lat: d.lat,
						long: d.long,
						backgroundColor: Object.entries(d.data).map((d, i) => colors[i]),
						fill: false,
						label: [d.name],
						data: Object.entries(d.data).map(d => d[1])
					}))
				},
			}
		}
	}
	return state
}