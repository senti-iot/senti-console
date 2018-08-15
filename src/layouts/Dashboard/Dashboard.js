import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { withStyles } from "@material-ui/core";
import { Header, /* Footer, */ Sidebar, CircularLoader } from "components";

import dashboardRoutes from "routes/dashboard.js";

import appStyle from "assets/jss/material-dashboard-react/appStyle.js";

// import image from "assets/img/sidebar-2.jpg";
import logo from "../../logo.svg";
import cookie from "react-cookies";
import withLocalization from "components/Localization/T";
import { connect } from "react-redux"
import { getSettings } from 'redux/settings';
// import GeoLocation from "components/Geolocation/Geolocation";

class App extends React.Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 	mobileOpen: false,
			headerTitle: '',
			goBackButton: false,
	  }
	}
	
	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};
	handleSetHeaderTitle = (title, goBackButton) => {
		if (this._isMounted)
			if (title !== this.state.headerTitle)
				this.setState({
					headerTitle: title,
					goBackButton: goBackButton
				})
	};
	handleGoBackButton = () => {
		this.props.history.goBack()
	}
	componentDidMount = async () => {
		this._isMounted = 1
		if (navigator.platform.indexOf('Win') > -1) {
			// eslint-disable-next-line
			const ps = new PerfectScrollbar(this.refs.mainPanel);
		}
		// if (cookie.load('SESSION')) 
		// {
		await this.props.getSettings()
		// }	
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	
	componentDidUpdate() {
		// if (cookie.load('SESSION')) 
		// {
		//eslint-disable-next-line
			this.refs.mainPanel ? this.refs.mainPanel.scrollTop = 0 : null
		// }
	}
	render() {
		const { classes, t, loading, ...rest } = this.props;
		// const { loading } = this.state
		return (
			!loading ? 
				<div className={classes.wrapper}>
					{/* <GeoLocation/> */}
					<div className={classes.mainPanel} ref="mainPanel">
						<Header
							routes={dashboardRoutes}
							handleDrawerToggle={this.handleDrawerToggle}
							goBackButton={this.state.goBackButton}
							gbbFunc={this.handleGoBackButton}
							headerTitle={this.state.headerTitle}
							t={t}
							{...rest}
						/>
						<Sidebar
							routes={dashboardRoutes}
							logo={logo}
							handleDrawerToggle={this.handleDrawerToggle}
							open={this.state.mobileOpen}
							color="senti"
							t={t}
							{...rest}
						/>
						<div className={classes.content}>
							<div className={classes.container}><Switch>
								{cookie.load('SESSION') ? dashboardRoutes.map((prop, key) => {
									if (prop.redirect) {
										return <Redirect from={prop.path} to={prop.to} key={key} />;
									}
									return <Route path={prop.path} render={(routeProps) => <prop.component {...routeProps} setHeader={this.handleSetHeaderTitle} />} key={key} />;
								}) : <Redirect from={window.location.pathname} to={{ pathname: '/login', state: {
									prevUrl: window.location.pathname
								} }}/>}
							</Switch></div>
						</div>
					</div>
				</div > : <CircularLoader />
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

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(appStyle)(App)))
