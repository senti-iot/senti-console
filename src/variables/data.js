import { create } from 'apisauce'
import cookie from 'react-cookies'
import crypto from 'crypto'


// https://betabackend.senti.cloud/
// https://senti.cloud

const { REACT_APP_ENCRYPTION_KEY } = process.env // Must be 256 bytes (32 characters)
const IV_LENGTH = 16 // For AES, this is always 16
const encrypt = (text) => {
	let iv = crypto.randomBytes(IV_LENGTH)
	let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer.from(REACT_APP_ENCRYPTION_KEY), iv)
	let encrypted = cipher.update(text)
	encrypted = Buffer.concat([encrypted, cipher.final()])
	return iv.toString('hex') + ':' + encrypted.toString('hex')
}

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
// const apiRoute = '/holidays/v1/2018-01-01/2018-12-31/da'
export const holidayApi = create({
	baseURL: `https://api.senti.cloud/holidays/v1`,
	timeout: 30000,
	headers: {
		'auth': encrypt(process.env.REACT_APP_ENCRYPTION_KEY),
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})
export const weatherApi = create({
	baseURL: `https://api.senti.cloud/weather/v1/`,
	timeout: 30000,
	headers: {
		'auth': encrypt(process.env.REACT_APP_ENCRYPTION_KEY),
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