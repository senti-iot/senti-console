import React, { Component } from 'react'
import App from './App'
import LoginForm from './LoginForm'
import { ThemeProvider } from 'styled-components'
import theme from 'utils/theme'
import { loginUser, getUserInfo, getOrgs } from 'utils/data'
import cookie from 'react-cookies'
import { LoaderSmall, LoaderContainer, ErrorText, ErrorHeader, ErrorModalContainer } from 'LoginStyles'
import Modal from 'content/Aux/Modal/Modal'
import { Button } from 'odeum-ui'
export const AppContext = React.createContext()
class Login extends Component {
	constructor(props) {
		super(props)
		var getOrgName = cookie.load('orgName')
		this.state = {
			login: false,
			loginData: null,
			error: false,
			orgName: getOrgName ? getOrgName : '',
			orgs: []
		}
	}
	componentDidMount = () => {
		this._isMounted = 1
		var getCookieLogin = cookie.load('loginData')
		if (getCookieLogin && this._isMounted) {
			this.getUser(getCookieLogin.userID)
			this.setState({ loginData: getCookieLogin, login: true, error: false })
			this.getOrgs()
		}
		else {
			this.getOrgs()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	getOrgs = async () => {
		var orgs = await getOrgs()
		if (this._isMounted)
			this.setState({ orgs: orgs })
	}
	getUser = async (userID) => {
		var user = await getUserInfo(userID)
		if (this._isMounted)
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
		const { login, user, orgName, error, loginData, orgs } = this.state
		return <ThemeProvider theme={theme}>
			{login ?
				<AppContext.Provider
					value={{
						logOut: this.logOut,
						loginData: loginData,
						user: user,
						orgs: orgs
					}}>
					{user ?
						<App management={user.management} />
						: <LoaderContainer> <LoaderSmall /> </LoaderContainer>}
				</AppContext.Provider> :
				<React.Fragment>
					<LoginForm orgName={orgName} reset={this.reset} error={error} login={this.login} />
					<Modal width={'20%'} height={'20%'}
						expand={error}
						horizontalControls={false}
						verticalControls={false}
						handleOverlay={this.reset}
					>
						<ErrorModalContainer>
							<ErrorHeader >Error!</ErrorHeader>
							<ErrorText>Username or password wrong or <br />there is a problem with the server.</ErrorText>
							<ErrorText> Please try again!</ErrorText>
							<Button label={'Luk'} color={'crimson'} onClick={this.reset} />
						</ErrorModalContainer>
					</Modal>
				</React.Fragment>}
		</ThemeProvider>
	}
}
export default Login