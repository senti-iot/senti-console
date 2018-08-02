import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { withStyles } from "@material-ui/core";
import { Header, /* Footer, */ Sidebar } from "components";

import dashboardRoutes from "routes/dashboard.js";

import appStyle from "assets/jss/material-dashboard-react/appStyle.js";

// import image from "assets/img/sidebar-2.jpg";
import logo from "../../logo.svg";
import cookie from "react-cookies";
// import GeoLocation from "components/Geolocation/Geolocation";

class App extends React.Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 	mobileOpen: false,
			headerTitle: '',
			goBackButton: false
	  }
	}
	
	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};
	handleSetHeaderTitle = (title, goBackButton) => {
		if (title !== this.state.headerTitle)
			this.setState({
				headerTitle: title,
				goBackButton: goBackButton
			})
	};
	handleGoBackButton = () => {
		this.props.history.goBack()
	}
	componentDidMount() {
		if (navigator.platform.indexOf('Win') > -1) {
			// eslint-disable-next-line
			const ps = new PerfectScrollbar(this.refs.mainPanel);
		}
	}
	componentDidUpdate() {
		this.refs.mainPanel.scrollTop = 0;
	}
	render() {
		const { classes, ...rest } = this.props;
		return (
			<div className={classes.wrapper}>
				{/* <GeoLocation/> */}
				<div className={classes.mainPanel} ref="mainPanel">
					<Header
						routes={dashboardRoutes}
						handleDrawerToggle={this.handleDrawerToggle}
						goBackButton={this.state.goBackButton}
						gbbFunc={this.handleGoBackButton}
						{...rest}
						headerTitle={this.state.headerTitle}
					/>
					<Sidebar
						routes={dashboardRoutes}
						logo={logo}
						handleDrawerToggle={this.handleDrawerToggle}
						open={this.state.mobileOpen}
						color="senti"
						{...rest}
					/>
					{/* <Provider store={store}> */}
					<div className={classes.content}>
						<div className={classes.container}><Switch>
							{cookie.load('SESSION') ? dashboardRoutes.map((prop, key) => {
								if (prop.redirect)
									return <Redirect from={prop.path} to={prop.to} key={key} />;
								return <Route path={prop.path} render={(routeProps) => <prop.component {...routeProps} setHeader={this.handleSetHeaderTitle} />} key={key} />;
								// return <Route path={prop.path} component={prop.component} key={key} exact={prop.exact ? true : false} />;

							}) : <Redirect from={window.location.pathname} to={{ pathname: '/login', state: {
								prevUrl: window.location.pathname
							} }}/>}
						</Switch></div>
					</div>
					{/* </Provider> */}
				</div>
			</div >
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(App)
