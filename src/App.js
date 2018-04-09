import React, { Component } from 'react'
import { AppContainer, Header, MenuPanel, Menu, Tab, Footer, LoginForm, Protected } from 'odeum-app'
import theme from './utils/theme'
import Home from './content/Home/Homepage'
import ViewContainer from 'content/Views/ViewContainer'
import mockData from './utils/mockData'
import { CookiesProvider } from 'react-cookie'
import User from './content/User/User'

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loggedIn: true,
			onMenuClickClose: false
		}
	}
	handleLogin = () => {
		this.setState({ loggedIn: true })
	}
	handleOnMenuClickClose = () => {
		this.setState({ onMenuClickClose: !this.state.onMenuClickClose })
	}
	render() {
		return (
			<CookiesProvider>
				<AppContainer theme={theme}>
					<Header logo={theme.logo} userLogin={true} userComponent={User} />
					<MenuPanel
						login={true}
						redirectTo={'/login'}
						isLoggedIn={this.state.loggedIn}
						quickNavigation={false}
						onMenuClickClose={this.state.onMenuClickClose}>

						{LoginForm(this.state.loggedIn, this.handleLogin)}

						<Menu route={'/'}>
							<Home />
						</Menu>

						<Protected>
							<Menu label={'Dashboard'} icon={'dashboard'}>
								<Tab route={''}>
									Hello World
								</Tab>
							</Menu>
							<Menu label={'Projekter'} route={'/projekter'} icon={'view_module'}>
								<Tab label={'Projekter'} icon={'view_module'} route={''}>
									<ViewContainer items={mockData} />
								</Tab>
							</Menu>
							<Menu label={'Indstillinger'} route={'/settings'} icon={'settings'}>
								<Tab label={'Projekter'} icon={'settings'} route={''}>
									{/* <ViewContainer items={mockData} /> */}
									<div style={{ display: 'inline-flex' }}>
										<div style={{ marginRight: 10 }}>Automatisk lås menupanelet </div>
										<button style={{ height: '23px', margin: 0, padding: 0, background: this.state.onMenuClickClose ? 'green' : 'red' }} onClick={this.handleOnMenuClickClose}> {this.state.onMenuClickClose ? 'ON' : 'OFF'} </button>
									</div>
								</Tab>
							</Menu>
						</Protected>
					</MenuPanel>
					<Footer />
				</AppContainer>
			</CookiesProvider>
		)
	}
}

export default App
