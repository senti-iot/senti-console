import React, { Component } from 'react'
import App from './App'
import LoginForm from './LoginForm'
import { ThemeProvider } from 'styled-components'
import theme from 'utils/theme'
import { loginUser, getUserInfo, getOrgs } from 'utils/data'
import cookie from 'react-cookies'
import { LoaderSmall } from 'LoginStyles'

export const AppContext = React.createContext()
class Login extends Component {
	constructor(props) {
		super(props)
		var getOrgName = cookie.load('orgName')
		this.state = {
			login: false,
			loginData: null,
			error: false,
			orgName: getOrgName ? getOrgName : ''
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
		console.log(user)
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

	login = async (username, password, orgStore, organisation) => {

		var loginData = await loginUser(username, password)
		if (loginData) {
			cookie.save('loginData', loginData)
			if (orgStore) {
				cookie.save('orgName', organisation)
			}
			var user = await getUserInfo(loginData.userID)
			this.setState({ login: true, loginData: loginData, error: false, user: user })
		}
		else {
			this.setState({ error: true, login: false, loginData: null, user: null })
		}

	}

	render() {
		const { login, user } = this.state
		return <ThemeProvider theme={theme}>
			{login ? <AppContext.Provider value={{
				logOut: this.logOut,
				loginData: this.state.loginData,
				user: this.state.user,
				orgs: this.state.orgs
			}}>{user ? <App management={user.management} /> : <div style={{ width: '100vw', height: '100vh' }}><LoaderSmall /></div>}</AppContext.Provider> : <LoginForm orgName={this.state.orgName} reset={this.reset} error={this.state.error} login={this.login} />}
		</ThemeProvider>
	}
}
export default Login