import React, { Component } from 'react'
import App from './App'
import LoginForm from './LoginForm'
import { ThemeProvider } from 'styled-components'
import theme from 'utils/theme'
import { loginUser, getUserInfo, getOrgs } from 'utils/data'
import cookie from 'react-cookies'

export const AppContext = React.createContext()
class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			login: false,
			loginData: null,
			error: false
		}
	}
	componentDidMount = () => {
		var getCookieLogin = cookie.load('loginData')
		if (getCookieLogin) {
			this.getUser(getCookieLogin.userID)
			this.setState({ loginData: getCookieLogin, login: true, error: false })
			this.getOrgs()
		}
		else {
			this.getOrgs()
		}
	}
	getOrgs = async () => {
		var orgs = await getOrgs()
		this.setState({ orgs: orgs })
	}
	getUser = async (userID) => {
		var user = await getUserInfo(userID)
		this.setState({ user: user })
	}
	logOut = () => {
		this.setState({
			login: false,
			loginData: false,
			error: false,
			user: null
		})
		cookie.remove('loginData')
	}
	reset = () => {
		this.setState({ error: false })
	}

	login = async (username, password) => {
		var loginData = await loginUser(username, password)
		if (loginData) {
			cookie.save('loginData', loginData)
			var user = await getUserInfo(loginData.userID)
			this.setState({ login: true, loginData: loginData, error: false, user: user })
		}
		else {
			this.setState({ error: true, login: false, loginData: null, user: null })
		}

	}

	render() {
		const { login } = this.state
		return <ThemeProvider theme={theme}>
			{login ? <AppContext.Provider value={{
				logOut: this.logOut,
				loginData: this.state.loginData,
				user: this.state.user,
				orgs: this.state.orgs
			}}><App /></AppContext.Provider> : <LoginForm orgs={this.state.orgs} reset={this.reset} error={this.state.error} login={this.login} />}
		</ThemeProvider>
	}
}
export default Login