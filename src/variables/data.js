import { create } from 'apisauce'
import cookie from 'react-cookies'
// https://betabackend.senti.cloud/
// https://senti.cloud
let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === 'console.senti.cloud') {
	backendHost = 'https://senti.cloud/rest/';
} else if (hostname === 'beta.senti.cloud') {
	backendHost = 'https://betabackend.senti.cloud/rest/';
} else {
	backendHost = 'https://betabackend.senti.cloud/rest/';
}
export const loginApi = create({
	baseURL: backendHost,
	timout: 30000,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})
export const weatherApi = create({
	baseURL: `https://api.senti.cloud/weather/v1/`,
	timeout: 30000,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})
export const mapApi = create({
	baseURL: 'https://maps.googleapis.com/maps/api/geocode/',
	timeout: 30000,
	params: {
		key: process.env.REACT_APP_SENTI_MAPSKEY
	}
})
export const imageApi = create({
	baseURL: backendHost,
	timeout: 30000,
	headers: {
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		'Content-Type': 'multipart/form-data',
		'ODEUMAuthToken': ''
	},
})
export const api = create({
	baseURL: backendHost,
	timeout: 30000,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'ODEUMAuthToken': ''
	}
})

export const setToken = () => {
	try {
		var OAToken = cookie.load('SESSION').sessionID
		api.setHeader('ODEUMAuthToken', OAToken)
		imageApi.setHeader('ODEUMAuthToken', OAToken)
		return true
	}
	catch (error) {
		return false
	}

}
setToken()