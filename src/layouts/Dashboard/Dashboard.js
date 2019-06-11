import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withStyles, Snackbar, IconButton } from '@material-ui/core';
import { Header, /* Sidebar,  */CircularLoader } from 'components';
import cx from 'classnames'
import dashboardRoutes from 'routes/dashboard.js';
import appStyle from 'assets/jss/material-dashboard-react/appStyle.js';
import { MuiThemeProvider } from '@material-ui/core/styles'
import logo from '../../logo.svg';
import cookie from 'react-cookies';
import withLocalization from 'components/Localization/T';
import { connect } from 'react-redux'
import { getSettings } from 'redux/settings';
import withSnackbarHandler from 'components/Localization/SnackbarHandler';
import { Close } from 'variables/icons';
import { lightTheme, darkTheme } from 'variables/themes'
import { getDaysOfInterest } from 'redux/doi';
import Cookies from 'components/Cookies/Cookies';
import Sidebar from 'components/Sidebar/Sidebar';
import BC from 'components/Breadcrumbs/BC';
import { changeTabs } from 'redux/appState';
import Toolbar from 'components/Toolbar/Toolbar';
import { getSuggestions } from 'redux/globalSearch';
// import _ from 'lodash'

class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mobileOpen: false,
			headerTitle: {
				id: '',
				options: null
			},
			goBackButton: false,
			url: '',
			menuRoute: '',
			bc: {
				name: '',
				id: ''
			},
		}
	}

	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};
	handleSetBreadCrumb = (id, name, extra, dontShow) => {
		const { bc } = this.state
		if (bc.id !== id || name !== bc.name)
			this.setState({
				bc: {
					id: id,
					name: name,
					extra: extra,
					dontShow: dontShow
				}
			})
	}
	handleSetHeaderTitle = (headerTitle, goBackButton, url, menuRoute, bcname) => {

		if ((headerTitle !== this.state.headerTitle) || (url !== this.state.url)) {
			if (typeof headerTitle === 'string') {
				if ((headerTitle !== this.state.headerTitle.id) || (url !== this.state.url)) {
					this.setState({
						headerTitle: {
							id: headerTitle,
							options: null
						},
						BCTitle: bcname,
						goBackButton: goBackButton,
						url,
						menuRoute
					})
				}
			}
			else {
				this.setState({
					headerTitle: headerTitle,
					goBackButton: goBackButton,
					url,
					menuRoute
				})
			}
		}
		// }
	};
	handleGoBackButton = () => {
		this.props.history.push(this.state.url)
		this.setState({ url: '' })
	}
	componentDidMount = async () => {
		this._isMounted = 1
		if (this._isMounted) {
			if (this.props.defaultRoute === '/')
				this.handleSetHeaderTitle('Senti', false, '', 'dashboard')
		}

		await this.props.getSettings().then(async rs => {
			// this.props.getSuggestions()
			await this.props.getDaysOfIterest()
			if (this.props.theme === 1) {
				document.body.style = 'background: #2e2e2e;';
				// if (this.props.user.id === 136550100000003) {
				// 	document.body.style = 'background: #2e2e2e;transform:rotate(18deg);transition: all 300ms ease;';
				// 	setTimeout(() => {
				// 		document.body.style = 'background: #2e2e2e;transform:rotate(0deg);transition: all 300ms ease;';
				// 	}, 3000);
				// }
			}
			else {
				document.body.style = 'background: #eee;';
				// if (this.props.user.id === 136550100000003) {
				// 	document.body.style = 'background: #eee;transform:rotate(18deg);transition: all 300ms ease;';
				// 	setTimeout(() => {
				// 		document.body.style = 'background: #eee;transform:rotate(0deg);transition: all 300ms ease;';
				// 	}, 3000);
				// }
			}
		})
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevState.headerTitle.id !== this.state.headerTitle.id && this.refs.mainPanel)
			this.refs.mainPanel.scrollTop = 0
		if (prevProps.sId !== this.props.sId && this.props.sId !== '')
			this.setState({ openSnackbar: true })
		if (this.props.theme !== prevProps.theme) {
			if (this.props.theme === 1) {
				document.body.style = 'background: #2e2e2e;';
			}
			else {
				document.body.style = 'background: #eee';
			}
		}
	}
	setTabs = (tabs) => {
		if (tabs.id !== this.props.tabs.id) {
			this.props.changeTabs(tabs)
		}
		if (tabs.id === this.props.tabs.id && tabs.route !== this.props.tabs.route) {
			this.props.changeTabs(tabs)
		}
	}
	render() {
		const { classes, t, loading, sOpt, defaultRoute, snackbarLocation, defaultView, smallMenu, drawer, tabs, ...rest } = this.props;
		console.log(this.props.theme)
		return (
			<MuiThemeProvider theme={this.props.theme === 0 ? lightTheme : darkTheme}>

				<div className={classes.wrapper + ' ' + (this.props.theme === 0 ? '' : classes.darkBackground)}>
					<Header
						defaultRoute={defaultRoute}
						logo={logo}
						routes={dashboardRoutes}
						handleDrawerToggle={this.handleDrawerToggle}
						goBackButton={this.state.goBackButton}
						gbbFunc={this.handleGoBackButton}
						headerTitle={this.state.headerTitle}
						t={t}
						{...rest}
					/>
					<div className={cx({
						[classes.mainPanelDrawerPersClosed]: !smallMenu && drawer === 'persistent',
						[classes.mainPanelDrawerPermClosed]: !smallMenu && drawer === 'permanent',
						[classes.mainPanelDrawerOpen]: smallMenu,
						[classes.mainPanel]: true
					})} ref={'mainPanel'}>
						<Fragment>
							<Sidebar
								defaultView={defaultView}
								defaultRoute={defaultRoute}
								routes={dashboardRoutes}
								logo={logo}
								handleDrawerToggle={this.handleDrawerToggle}
								open={this.state.mobileOpen}
								color='senti'
								t={t}
								menuRoute={this.state.menuRoute}
								{...rest}
							/>
							{!loading ?
								<Fragment>
									<div className={classes.container} id={'container'}>
										<Toolbar history={this.props.history} {...tabs} />
										<BC
											defaultRoute={defaultRoute}
											bc={this.state.bc}
											t={t}
										/>
										<Switch>
											{cookie.load('SESSION') ?
												dashboardRoutes.map((prop, key) => {
													if (prop.dropdown) {
														return prop.items.map((r, key) => {
															return <Route path={r.path}
																render={rProps =>
																	<r.component {...rProps}
																		setBC={this.handleSetBreadCrumb}
																		setHeader={this.handleSetHeaderTitle}
																		setTabs={this.setTabs} />
																}
																key={r.menuRoute + key}
															/>
														})
													}
													if (prop.redirect) {
														return <Redirect from={prop.path} to={prop.to} key={key} />;
													}
													return <Route path={prop.path}
														render={(routeProps) =>
															<prop.component {...routeProps}
																setBC={this.handleSetBreadCrumb}
																setHeader={this.handleSetHeaderTitle}
																setTabs={this.setTabs}
															/>} key={key} />;
												})
												: <Redirect from={window.location.pathname} to={{
													pathname: '/login', state: {
														prevURL: window.location.pathname
													}
												}} />}
										</Switch>
									</div>

									<Cookies />
									<Snackbar
										anchorOrigin={{ vertical: 'bottom', horizontal: snackbarLocation }}
										open={this.props.sOpen}
										onClose={this.props.sClose}
										onExited={this.props.handleNextS}
										ContentProps={{
											'aria-describedby': 'message-id',
										}}
										ClickAwayListenerProps={{
											mouseEvent: false,
											touchEvent: false
										}}
										autoHideDuration={3000}
										message={<span>{t(this.props.sId, this.props.sOpt)}</span>}
										action={
											<IconButton color={'primary'} size={'small'} onClick={this.props.sClose} >
												<Close />
											</IconButton>
										}
									/>

								</Fragment>
								: <CircularLoader />}
						</Fragment>
					</div>

				</div >
			</MuiThemeProvider>

		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
	loading: state.settings.loading,
	theme: state.settings.theme,
	defaultRoute: state.settings.defaultRoute,
	defaultView: state.settings.defaultView,
	snackbarLocation: state.settings.snackbarLocation,
	smallMenu: state.appState.smallMenu,
	drawer: state.settings.drawer,
	tabs: state.appState.tabs,
	user: state.settings.user
})

const mapDispatchToProps = dispatch => ({
	getSettings: async () => dispatch(await getSettings()),
	getDaysOfIterest: async () => dispatch(await getDaysOfInterest()),
	changeTabs: tabs => dispatch(changeTabs(tabs)),
	getSuggestions: () => dispatch(getSuggestions())
	// acceptCookies: async (val) => dispatch(await acceptCookiesFunc(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbarHandler()((withLocalization()(withStyles(appStyle)(App)))))
