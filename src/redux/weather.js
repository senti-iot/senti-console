import { getWeather as getWfromS } from 'variables/dataDevices';
import { get, set } from 'variables/storage';
import moment from 'moment'

const gW = 'getWeather'
const getWeatherFromServer = async ({ lat, long }, date, language) => {
	return await getWfromS({ lat, long }, date, language)
}
export const getWeather = async (device, date, language) => {
	return async (dispatch, getState) => {
		dispatch({
			type: gW,
			payload: {
				loading: true
			}
		})
		let weatherValues = getState().weather.weatherValues
		let weather = null
		if (weatherValues)
		{
			weather = weatherValues.find(f => { 
				console.log(f.lat === device.lat, moment(f.date).diff(date) === 0, moment(f.date).diff(date))
				return f.lat === device.lat && moment(f.date).diff(date) === 0 ? f : null
			})
			console.log(weather)
		}
		if (weather) {
			dispatch({
				type: gW,
				payload: {
					loading: false,
					weather: weather
				} 
			})
		}
		else {
			let weather = await getWeatherFromServer(device, date, language)
			weatherValues.push({ ...weather, lat: device.lat, long: device.long, language: language, date: date })
			set('weather', weatherValues)
			dispatch({
				type: gW,
				payload: {
					loading: false, 
					weather: weather,
					weatherValues: weatherValues
				}
			})
		}
	}
}
const initialState = {
	loading: true,
	weatherValues: get('weather') ? get('weather') : [],
	weather: null
}

export const weather = (state = initialState, { type, payload }) => {
	switch (type) {

		case gW:
			return { ...state, ...payload }

		default:
			return state
	}
}
