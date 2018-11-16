import { dateTimeFormatter, datesToArr, hoursToArr, minutesToArray } from 'variables/functions';
import { teal } from '@material-ui/core/colors'

export const setSummaryData = (dataArr, from, to) => {
	let displayTo = dateTimeFormatter(to)
	let displayFrom = dateTimeFormatter(from)
	let state = {
		title: `${displayFrom} - ${displayTo}`,
		loading: false,
		timeType: 3,
		roundDataSets: {
			labels: dataArr.map(d => d.name),
			datasets: [{
				backgroundColor: dataArr.map(d => d.color),
				fill: false,
				data: dataArr.map(d => d.data)
			}]
		}
	}
	return state
}
export const setDailyData = (dataArr, from, to, hoverID) => {
	let state = {
		loading: false,
		timeType: 2,
		lineDataSets: {
			labels: datesToArr(from, to),
			datasets: dataArr.map((d) => ({
				id: d.id,
				lat: d.lat,
				long: d.long,
				backgroundColor: d.color,
				borderColor: d.color,
				borderWidth: hoverID === d.id ? 8 : 3,
				fill: false,
				label: [d.name],
				data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
			}))
		},
		barDataSets: {
			labels: datesToArr(from, to),
			datasets: dataArr.map((d) => ({
				id: d.id,
				lat: d.lat,
				long: d.long,
				backgroundColor: d.color,
				borderColor: teal[500],
				borderWidth: hoverID === d.id ? 4 : 0,
				fill: false,
				label: [d.name],
				data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
			}))
		},
		roundDataSets: null
	}
	return state
}
export const setHourlyData = (dataArr, from, to, hoverID) => {
	let state = {
		loading: false,
		timeType: 1,
		lineDataSets: {
			labels: hoursToArr(from, to),
			datasets: dataArr.map((d) => ({
				id: d.id,
				lat: d.lat,
				long: d.long,
				backgroundColor: d.color,
				borderColor: d.color,
				borderWidth: hoverID === d.id ? 8 : 3,
				fill: false,
				label: [d.name],
				data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
			}))
		},
		barDataSets: {
			labels: hoursToArr(from, to),
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
		roundDataSets: null
	}
	return state
}
export const setMinutelyData = (dataArr, from, to, hoverID) => {
	let state = {
		loading: false,
		lineDataSets: {
			labels: minutesToArray(from, to),
			datasets: dataArr.map((d) => ({
				id: d.id,
				lat: d.lat,
				long: d.long,
				backgroundColor: d.color,
				borderColor: d.color,
				borderWidth: hoverID === d.id ? 8 : 3,
				fill: false,
				label: [d.name],
				data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
			})),
			barDataSets: {
				labels: hoursToArr(from, to),
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
			roundDataSets: null
		}
	}
	return state
}