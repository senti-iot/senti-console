import { loginApi } from "./data";

export const loginUser = async (username, password) => {
	var session = await loginApi.post('/auth/basic', JSON.stringify({ username: username, password: password })).then(rs => rs.data)
	return session
}