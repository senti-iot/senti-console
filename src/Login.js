import React, { Component } from 'react'
import App from './App'
import LoginForm from './LoginForm'
import { ThemeProvider } from 'styled-components'
import theme from 'utils/theme'

export default class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			login: false
		}
	}
	login = () => {
		this.setState({ login: true })
	}
	render() {
		const { login } = this.state
		return <ThemeProvider theme={theme}>
			{login ? <App /> : <LoginForm login={this.login} />}
		</ThemeProvider>
	}
}
