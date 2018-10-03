import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { withStyles, Snackbar, Button } from "@material-ui/core";
import { Header, /* Footer, */ Sidebar, CircularLoader } from "components";

import dashboardRoutes from "routes/dashboard.js";

import appStyle from "assets/jss/material-dashboard-react/appStyle.js";

// import image from "assets/img/sidebar-2.jpg";
import logo from "../../logo.svg";
import cookie from "react-cookies";
import withLocalization from "components/Localization/T";
import { connect } from "react-redux"
import { getSettings } from 'redux/settings';
import withSnackbar from 'components/Localization/S';
import {  Close } from 'variables/icons';
// import GeoLocation from "components/Geolocation/Geolocation";
class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mobileOpen: false,
			headerTitle: '',
			goBackButton: false,
			url: '',
			menuRoute: 0,
			openSnackbar: false
		}
		// this.mainPanel = React.createRef()
	}

	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};
	handleSetHeaderTitle = (headerTitle, goBackButton, url, menuRoute) => {
		if (this._isMounted) {
			// console.log(headerTitle, typeof headerTitle, this.state.headerTitle, headerTitle !== this.state.headerTitle)
			if (headerTitle !== this.state.headerTitle) {
				if (typeof headerTitle === 'string') {
					if (headerTitle !== this.state.headerTitle.id) {
						this.setState({
							headerTitle: {
								id: headerTitle,
								options: null
							},
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
		}
	};
	handleGoBackButton = () => {
		this.props.history.push(this.state.url)
		this.setState({ url: '' })
	}
	componentDidMount = async () => {
		this._isMounted = 1
		if (this._isMounted) {
			this.handleSetHeaderTitle("Senti.Cloud", false, '', "dashboard")
		}
		await this.props.getSettings().then(rs => {
			if (navigator.platform.indexOf('Win') > -1) {
				if (!this.props.loading) {
					if (this.refs.mainPanel) {
						//eslint-disable-next-line
						const ps = new PerfectScrollbar(this.refs.mainPanel);
					}
				}
			}
		})
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	componentDidUpdate = (prevProps, prevState) => {
		//eslint-disable-next-line
		this.refs.mainPanel ? this.refs.mainPanel.scrollTop = 0 : null
		if (prevProps.sId !== this.props.sId && this.props.sId !== "")
			this.setState({ openSnackbar: true })
	}
	closeSnackBar = () => {
		this.setState({ openSnackbar: false })
		this.props.s("", {})
	}
	render() {
		const { classes, t, loading, ...rest } = this.props;
		return (

			<div className={classes.wrapper}>
				{/* <GeoLocation/> */}
				<div className={classes.mainPanel} ref={"mainPanel"}>
					<Header
						routes={dashboardRoutes}
						handleDrawerToggle={this.handleDrawerToggle}
						goBackButton={this.state.goBackButton}
						gbbFunc={this.handleGoBackButton}
						headerTitle={this.state.headerTitle}
						t={t}
						{...rest}
					/>
					<Fragment>
						<Sidebar
							routes={dashboardRoutes}
							logo={logo}
							handleDrawerToggle={this.handleDrawerToggle}
							open={this.state.mobileOpen}
							color="senti"
							t={t}
							menuRoute={this.state.menuRoute}
							{...rest}
						/>
						{!loading ? <div className={classes.content}>
							<div className={classes.container}>
								<Switch>
									{cookie.load('SESSION') ?
										dashboardRoutes.map((prop, key) => {
											if (prop.redirect) {
												return <Redirect from={prop.path} to={prop.to} key={key} />;
											}
											return <Route path={prop.path} render={(routeProps) => <prop.component {...routeProps} setHeader={this.handleSetHeaderTitle} />} key={key} />;
										})
										: <Redirect from={window.location.pathname} to={{
											pathname: '/login', state: {
												prevUrl: window.location.pathname
											}
										}} />}
								</Switch>
							</div>
							<Snackbar
								anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
								open={this.state.openSnackbar}
								onClose={this.closeSnackBar}
								ContentProps={{
									'aria-describedby': 'message-id',
								}}
								ClickAwayListenerProps={{
									mouseEvent: false,
									touchEvent: false
								}}
								autoHideDuration={3000}
								message={t(this.props.sId, this.props.sOpt)}
								action={
									<Button size={"small"} variant={"text"} onClick={this.closeSnackBar} >
										<Close style={{ color: "white" }}/>
									</Button>
								}
							/>
						</div> : <CircularLoader />}
					</Fragment>
				</div>
			</div >
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
	loading: state.settings.loading
})

const mapDispatchToProps = dispatch => ({
	getSettings: async () => dispatch(await getSettings())
})

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar()((withLocalization()(withStyles(appStyle)(App)))))
