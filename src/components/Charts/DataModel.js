import { datesToArr, hoursToArr, minutesToArray, isWeekend, weekendColors, handleRequestSort } from 'variables/functions'
import moment from 'moment'
import { colors } from 'variables/colors'
import {
	getDataHourly as getDeviceDataHourly,
	getDataDaily as getDeviceDataDaily,
	getDataMinutely as getDeviceDataMinutely,
	getDataSummary as getDeviceDataSummary
} from 'variables/dataDevices'
import { getDataHourly, getDataDaily, getDataMinutely, getDataSummary } from 'variables/dataCollections'
import { getSensorDataClean } from 'variables/dataSensors'
import { store } from 'Providers'

const format = 'YYYY-MM-DD+HH:mm'

const linecolors = (data, defaultColor, id) => {
	// console.log(Object.entries(data))
	let colors = []
	if (data) {
		Object.entries(data).map(d => {
			if (isWeekend(d[0])) {
				return colors.push(weekendColors(id, store.getState().settings.weekendColor))
			} else {
				return colors.push(defaultColor)
			}
		})
	}
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
						// data[moment(dt).add(1, unit).format('YYYY-MM-DD HH:mm')] = d[dt]
						data[dt] = d[dt]
					}
				}
				return true
			}
			else {
				data[dt] = d[dt]
				//Normal ones
				// data[moment(dt).add(1, unit).format('YYYY-MM-DD HH:mm')] = d[dt]
				return true
			}
		})
		return data
	}
	else return null
}

export const setExportData = (dataArr, unit, type, from, to) => {
	let dataSets = dataArr
	let newData = []
	if (type === 'summary') {
		if (dataSets) {
			dataSets.map(d => newData.push({
				dcId: d.dcId,
				dcName: d.name,
				org: d.org,
				project: d.project,
				lat: d.lat,
				long: d.long,
				id: d.id,
				startDate: moment(from).format('DD-MM-YYYY HH:mm'),
				endDate: moment(to).format('DD-MM-YYYY HH:mm'),
				count: Math.round(d.data)
			})
			)
		}
	}
	else {
		if (dataSets) {
			dataSets.map(d =>
				Object.entries(d.data).map((dt, i) => {
					return newData.push({
						dcId: d.dcId,
						dcName: d.name,
						org: d.org,
						project: d.project,
						lat: d.lat,
						long: d.long,
						id: d.id,
						startDate: d.data.length - 1 === i && moment().diff(moment(dt[0]), unit) === 0 ? moment(dt[0]).startOf(unit).format('DD-MM-YYYY HH:mm') : moment(dt[0]).subtract(1, unit).format('DD-MM-YYYY HH:mm'),
						endDate: moment(dt[0]).format('DD-MM-YYYY HH:mm'),
						count: Math.round(dt[1])
					})
				}
				)
			)
		}
	}
	return newData

}

export const getWifiSummary = async (type, objArr, from, to, hoverId, raw) => {
	let startDate = moment(from).format(format)
	let endDate = moment(to).format(format)
	let dataArr = []
	let dataSet = null
	let data = null
	await Promise.all(objArr.map(async o => {
		if (type === 'device')
			data = await getDeviceDataSummary(o.id, startDate, endDate, raw)
		else {
			data = await getDataSummary(o.id, startDate, endDate, raw)
		}
		dataSet = {
			name: o.name,
			id: o.id,
			lat: o.lat,
			long: o.long,
			org: o.org,
			data: [data],
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
	let newState = setSummaryData(dataArr, from, to, hoverId)
	let exportData = setExportData(dataArr, 'day', 'summary', from, to)
	return { ...newState, exportData, dataArr }
}

export const setSummaryData = (dataArr, from, to, hoverID) => {
	let state = null
	let labels = [from, to]
	if (dataArr.length > 0) {
		state = {
			loading: false,
			lineDataSets: {
				labels: labels,
				datasets: dataArr.map((d, index) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: [{ x: from, y: 0 }, { x: to, y: d.data }],
				}))
			},
			barDataSets: {
				labels: [`${moment(from).format('lll')} - ${moment(to).format('lll')}`],
				datasets: dataArr.map((d, index) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: hoverID === d.id ? 4 : 0,
					fill: false,
					label: [d.name],
					data: [d.data],
				}))
			},
			roundDataSets: [{
				from: from,
				to: to,
				labels: dataArr.map(d => [d.name, d.name, d.data[0]]),
				datasets: [{
					data: dataArr.map(d => d.data[0]),
					backgroundColor: dataArr.map(d => d.color),
				}]
			}]

		}
		return state
	}
}


export const getWifiDaily = async (type, objArr, from, to, hoverId, raw, simple) => {
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
			org: o.org,
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
	dataArr = handleRequestSort('name', 'asc', dataArr)
	if (simple)
		return dataArr
	let newState = setDailyData(dataArr, from, to, hoverId)
	let exportData = setExportData(dataArr, 'day')
	return { ...newState, exportData, dataArr }
}

export const setDailyData = (dataArr, from, to, hoverID, extra) => {
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
			...extra,
			loading: false,
			timeType: 2,
			lineDataSets: {
				labels: labels,
				datasets: dataArr.map((d, index) => {
					return ({
						id: d.id,
						lat: d.lat,
						long: d.long,
						backgroundColor: d.color,
						borderColor: d.color,
						colors: linecolors(d.data, d.color, index),
						borderWidth: hoverID === d.id ? 8 : 3,
						fill: false,
						label: [d.name],
						data: Array.isArray(d.data) ? d.data.map(u => ({ x: u.datetime, y: u[d.id] })) : []
					})
				})
			},
			barDataSets: {
				labels: labels,
				datasets: dataArr.map((d, index) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					color: d.color,
					backgroundColor: linecolors(d.data, d.color, index),
					borderColor: d.color,
					// borderWidth: hoverID === d.id ? 4 : 0,
					fill: false,
					label: [d.name],
					data: Array.isArray(d.data) ? d.data.map(u => ({ x: u.datetime, y: u[d.id] })) : []
				}))
			},
			roundDataSets:
				dataArr.map(d => {
					return ({
						name: d.name,
						color: d.color,
						labels: d.data ? Object.entries(d.data).map(l => ['', moment(l[0]), l[1]]) : [],
						datasets: [{
							id: d.id,
							lat: d.lat,
							long: d.long,
							backgroundColor: d.data ? Object.entries(d.data).map((d, i) => colors[i]) : [],
							// data: Object.entries(d.data).map(d => d[1])
							//TODO
							data: []
						}]
					})
				})
		}
	}

	return state
}

export const getWifiHourly = async (type, objArr, from, to, hoverId, raw, simple) => {
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
			org: o.org,
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
	dataArr = handleRequestSort('name', 'asc', dataArr)
	if (simple)
		return dataArr
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
					// pointRadius: 0,
					// pointBorderRadius: 0,
					// pointHoverRadius: 0,
					backgroundColor: d.color,
					borderColor: d.color,
					colors: [d.color],
					borderWidth: hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Array.isArray(d.data) ? d.data.map(u => {
						return ({ x: u.datetime, y: u[d.id] })
					})
						: []
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
					data: Array.isArray(d.data) ? d.data.map(u => ({ x: u.datetime, y: u[d.id] })) : []
				}))
			},
			roundDataSets:
				dataArr.map(d => ({
					name: d.name,
					color: d.color,
					labels: Object.entries(d.data).map(l => ['', moment(l[0]), l[1]]),
					datasets: [{
						id: d.id,
						lat: d.lat,
						long: d.long,
						backgroundColor: Object.entries(d.data).map((d, i) => colors[i]),
						// data: Object.entries(d.data).map(d => d[1])
						data: []
					}]
				}))
		}
	}
	return state
}
export const getWifiMinutely = async (type, objArr, from, to, hoverId, raw, simple) => {
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
			org: o.org,
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
	dataArr = handleRequestSort('name', 'asc', dataArr)
	if (simple)
		return dataArr
	let newState = setMinutelyData(dataArr, from, to, hoverId)
	let exportData = setExportData(dataArr, 'minute')
	return { ...newState, exportData, dataArr }
}
export const setMinutelyData = (dataArr, from, to, /* hoverID, */ live) => {
	// console.log('dataArr', dataArr)
	let labels = []
	labels = minutesToArray(from, to)
	// if (live) {
	// 	try {

	// 		let first = dataArr[0].data[0]?.datetime
	// 		let last = dataArr[0].data[dataArr[0].data.length - 1]?.datetime
	// 		labels = minutesToArray(first ? first : from, last ? last : to)
	// 	}
	// 	catch (e) {
	// 		labels = minutesToArray(from, to)
	// 	}
	// }
	// else {

	// }
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
					// borderWidth: hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Array.isArray(d.data) ? d.data.map(u => ({ x: u.datetime, y: u[d.id] })) : []
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
					// borderWidth: hoverID === d.id ? 4 : 0,
					fill: false,
					label: [d.name],
					data: Array.isArray(d.data) ? d.data.map(u => ({ x: u.datetime, y: u[d.id] })) : []
				}))
			},
			// roundDataSets:
			// 	dataArr.map(d => ({
			// 		name: d.name,
			// 		color: d.color,
			// 		labels: Object.entries(d.data).map(l => ['', moment(l[0]), l[1]]),
			// 		datasets: [{
			// 			id: d.id,
			// 			lat: d.lat,
			// 			long: d.long,
			// 			backgroundColor: Object.entries(d.data).map((d, i) => colors[i]),
			// 			data: Object.entries(d.data).map(d => d[1])
			// 		}]
			// 	}))
		}
	}
	return state
}

export const getWMeterDatav2 = async (type, objArr, from, to, hoverId, raw, v, nId, prevPeriod) => {
	let startDate = moment(from).format(format)
	let endDate = moment(to).format(format)
	let prevEndDate, prevStartDate = null
	let dataArr = []
	let dataSet, prevDataSet = null
	let data, prevData = null
	await Promise.all(objArr.map(async o => {
		if (type === 'device') {
			data = await getSensorDataClean(o.uuid, v, startDate, endDate, nId)
			if (prevPeriod) {
				prevEndDate = moment(to).subtract(moment(to).diff(moment(from), 'hour'), 'hour').format(format)
				prevStartDate = moment(from).subtract(moment(to).diff(moment(from), 'hour'), 'hour').format(format)
				prevData = await getSensorDataClean(o.id, prevStartDate, prevEndDate, v, nId)

				Object.keys(prevData).forEach(p => {
					prevData[moment(p, format).add(1, 'day').format('YYYY-MM-DD HH:mm')] = prevData[p]
					delete prevData[p]
				})
			}
		}
		else {
			data = await getDataHourly(o.id, startDate, endDate, raw)
		}
		prevDataSet = {
			id: o.id,
			lat: o.lat,
			long: o.long,
			from: moment(startDate).subtract(moment(endDate).diff(startDate, 'hour')),
			to: moment(endDate).subtract(moment(endDate).diff(startDate, 'hour')),
			org: o.org,
			...o,
			name: 'test',
			data: regenerateData(prevData, 'hour'),
			backgroundColor: '#5c5c5c33',
			fill: true,
			color: '#5c5c5c33',
		}
		dataSet = {
			name: o.name,
			from: from,
			to: to,
			id: v,
			lat: o.lat,
			long: o.long,
			org: o.org,
			fill: false,
			// data: regenerateData(data, 'hour'),
			data: data,
			// data: Array.isArray(data) ? data.map(u => ({ x: u.datetime, y: u[v] })) : [],
			...o,
		}
		return dataArr.push(dataSet, prevDataSet)
	}))
	//Filter nulls
	dataArr = dataArr.reduce((newArr, d) => {
		if (d)
			if (d.data !== null)
				newArr.push(d)
		return newArr
	}, [])
	dataArr = handleRequestSort('name', 'asc', dataArr)
	let newState = setHourlyData(dataArr, from, to, hoverId)
	let exportData = setExportData(dataArr, 'hour')
	return { ...newState, exportData, dataArr }
}


export const setMeterData = (dataArr, hoverID) => {
	// let labels = dataArr.map(p => {return allHoursToArr(p.from, p.to)}).flat()
	let labels = dataArr[0].data.map(d => d.created)
	// let labels = dataArr.map(d => d.data.map(d => d.created)).flat()
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
				datasets: dataArr.map((d, i) => {
					return ({
						// ...d,
						id: d.id,
						lat: d.lat,
						long: d.long,
						backgroundColor: d.color,
						// colors: [d.color],
						borderColor: d.color,
						// borderWidth: hoverID === d.id ? 8 : 1,
						pointRadius: 10,
						pointStyle: 'cross',
						fill: d.fill,
						label: [`${moment(d.from).format('lll')} - ${moment(d.to).format('lll')}`],
						data: d.data.map(f => ({ x: f.created, y: f.data.value + Math.random() * 10 })),
						// data: d.data
					})
				})
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
			roundDataSets:
				dataArr.map(d => ({
					name: d.name,
					color: d.color,
					labels: Object.entries(d.data).map(l => ['', moment(l[0]), l[1]]),
					datasets: [{
						id: d.id,
						lat: d.lat,
						long: d.long,
						backgroundColor: Object.entries(d.data).map((d, i) => colors[i]),
						data: Object.entries(d.data).map(d => d[1])
					}]
				}))
		}
	}
	return state
}