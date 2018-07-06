import { loginApi } from "./data";
import cookie from "react-cookies";

export const loginUser = async (username, password) => {
	var session = await loginApi.post('/auth/basic', JSON.stringify({ username: username, password: password })).then(rs => rs.data)
	return session
}
export const logOut = async () => {
	var session = cookie.load('loginData')
	var data = await loginApi.delete('/auth/basic', JSON.stringify(session.sessionID))
	cookie.remove('loginData')
	return data
}