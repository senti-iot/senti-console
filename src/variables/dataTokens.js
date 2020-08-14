import { externalAPI } from './data';

export const getAllTokens = async userId => {
	let response = await externalAPI.get(`/tokens/${userId}`).then(rs => rs.ok ? rs.data : [])
	return response
}

export const generateToken = async token => {
	let response = await externalAPI.post(`/generateToken`, token).then(rs => rs.ok ? rs.data : null)
	return response
}

export const deleteTokens = async tokens => {
	let response = Promise.all(tokens.map(t => externalAPI.post(`/deletetoken/${t}`))).then(rs => {
		if (rs.find(f => f === false))
			return false
		else
			return true
	})
	return response
}