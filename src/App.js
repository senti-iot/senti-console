import React, { Component } from 'react'
import { AppContainer, Header, MenuPanel, Menu, Tab, Footer, LoginForm, Protected } from 'odeum-app'
import theme from './utils/theme'
import Home from './content/Home/Homepage'
import ViewContainer from 'content/Views/ViewContainer'
import User from './content/User/User'
import UserAdmin from './content/Management/Users/UserAdminContainer'
import OrgAdmin from './content/Management/Orgs/OrgAdminContainer'
import MyProfileSettings from 'content/User/MyProfileContainer'

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loggedIn: true,
			onMenuClickClose: false
		}
	}

	handleOnMenuClickClose = () => {
		this.setState({ onMenuClickClose: !this.state.onMenuClickClose })
	}
	render() {
		return (
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
						<Menu label={'Projekter'} route={'/projekter'} icon={'view_module'}>
							<Tab label={'Projekter'} icon={'view_module'} route={''}>
								<ViewContainer />
							</Tab>
						</Menu>
						{this.props.management ? <Menu label={'Management'} route={'/management'} icon={'people'}>
							<Tab label={'Users'} icon={'people'} route={'/users'}>
								<UserAdmin />
							</Tab>
							<Tab label={'Organisations'} icon={'language'} route={'/orgs'}>
								<OrgAdmin />
							</Tab>
						</Menu> : null}
						<Menu label={'Indstillinger'} route={'/settings'} icon={'settings'}>
							<Tab label={'Indstillinger'} icon={'settings'} route={''}>
								<div style={{ display: 'inline-flex' }}>
									<div style={{ marginRight: 10 }}>Automatisk lås menupanelet </div>
									<button style={{ height: '23px', margin: 0, padding: 0, background: this.state.onMenuClickClose ? 'green' : 'crimson' }} onClick={this.handleOnMenuClickClose}> {this.state.onMenuClickClose ? 'ON' : 'OFF'} </button>
								</div>
							</Tab>
							<Tab label={'My Profile'} icon={'people'} route={'/profile'}>
								<MyProfileSettings />
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
