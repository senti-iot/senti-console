import React, { Component } from 'react'
// import logo from './logo.svg'
// import './App.css'
import { AppContainer, Header, MenuPanel, Menu, Tab, Footer, LoginForm, Protected } from 'odeum-app'
import theme from './utils/theme'
import Home from './content/Home/Homepage'
import ViewContainer from 'content/Views/ViewContainer'
// import { Helmet } from 'react-helmet'
import mockData from './utils/mockData'
import ExpandedCardItem from './content/Card/ExpandedCardItem'

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
				{/* <Helmet>
					<title>Senti Dashboard</title>
				</Helmet> */}
				<Header logo={theme.logo} />
				<MenuPanel
					login={true}
					redirectTo={'/login'}
					isLoggedIn={this.state.loggedIn}
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
						<Menu label={'Expanded'}>
							<ExpandedCardItem item={mockData[0]} />
						</Menu>
					</Protected>
				</MenuPanel>
				<Footer />
			</AppContainer>
		)
	}
}

export default App
