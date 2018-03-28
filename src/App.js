import React, { Component } from 'react'
import { AppContainer, Header, MenuPanel, Menu, Tab, Footer, LoginForm, Protected } from 'odeum-app'
import theme from './utils/theme'
import Home from './content/Home/Homepage'
import ViewContainer from 'content/Views/ViewContainer'
import mockData from './utils/mockData'

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loggedIn: false
		}
	}
	handleLogin = () => {
		this.setState({ loggedIn: true })
	}
	render() {
		return (
			<AppContainer theme={theme}>
				<Header logo={theme.logo} />
				<MenuPanel
					login={true}
					redirectTo={'/login'}
					isLoggedIn={this.state.loggedIn}
					quickNavigation={false}
				>
					{LoginForm(this.state.loggedIn, this.handleLogin)}
					<Menu route={'/'}>
						<Home />
					</Menu>
					<Protected>
						<Menu label={'Dashboard'}>
							<Tab route={''}>
								Hello World
							</Tab>
						</Menu>
						<Menu label={'Projekter'} route={'/projekter'}>
							<Tab label={'Projekter'} icon={'view_module'} route={''}>
								<ViewContainer items={mockData} />
							</Tab>
						</Menu>
					</Protected>
				</MenuPanel>
				<Footer />
			</AppContainer>
		)
	}
}

export default App
