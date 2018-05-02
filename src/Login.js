import React, { Component } from 'react'
import App from './App'
import LoginForm from './LoginForm'
import { ThemeProvider } from 'styled-components'
import theme from 'utils/theme'
import { loginUser } from 'utils/data'
import { withCookies } from 'react-cookie'


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
		var getCookieLogin = this.props.cookies.get('loginData')
		if (getCookieLogin)
			this.setState({ loginData: getCookieLogin, login: true, error: false })
	}

	reset = () => {
		this.setState({ error: false })
	}

	login = async (username, password) => {
		var loginData = await loginUser(username, password)
		if (loginData) {
			this.props.cookies.set('loginData', loginData)
			this.setState({ login: true, loginData: loginData, error: false })
		}
		else {
			this.setState({ error: true, login: false })
		}

	}

	render() {
		const { login } = this.state
		return <ThemeProvider theme={theme}>
			{login ? <App user={this.state.loginData} /> : <LoginForm reset={this.reset} error={this.state.error} login={this.login} />}
		</ThemeProvider>
	}
}
export default withCookies(Login)