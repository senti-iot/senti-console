import React, { Component } from 'react'
// import logo from './logo.svg'
// import './App.css'
import { AppContainer, Header, MenuPanel, Menu, Tab, Footer } from 'odeum-app'
import theme from './utils/theme'
import Home from './content/Home/Homepage'
import ViewContainer from 'content/Views/ViewContainer'
import { Helmet } from 'react-helmet'
import mockData from './utils/mockData'
import ExpandedCardItem from './content/Card/ExpandedCardItem'
class App extends Component {
	render() {
		return (
			<AppContainer theme={theme}>
				<Helmet>
					<title>Senti</title>
				</Helmet>
				<Header logo={theme.logo} />
				<MenuPanel>
					<Menu route={'/'}>
						<Home />
					</Menu>
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
				</MenuPanel>
				<Footer />
			</AppContainer>
		)
	}
}

export default App
