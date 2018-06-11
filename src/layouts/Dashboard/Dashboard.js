import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { withStyles } from "material-ui";

import { Header, /* Footer, */ Sidebar } from "components";

import dashboardRoutes from "routes/dashboard.js";

import appStyle from "assets/jss/material-dashboard-react/appStyle.js";

// import image from "assets/img/sidebar-2.jpg";
import logo from "../../logo.svg";

const switchRoutes = (
	<Switch>
		{dashboardRoutes.map((prop, key) => {
			if (prop.redirect)
				return <Redirect from={prop.path} to={prop.to} key={key} />;
			return <Route path={prop.path} component={prop.component} key={key} />;
		})}
	</Switch>
);

class App extends React.Component {
	state = {
		mobileOpen: false
	};
	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};
	getRoute() {
		return this.props.location.pathname !== "/maps";
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
		console.log(rest)
		return (
			<div className={classes.wrapper}>

				<div className={classes.mainPanel} ref="mainPanel">
					<Header
						routes={dashboardRoutes}
						handleDrawerToggle={this.handleDrawerToggle}
						{...rest}
					/>
					<Sidebar
						routes={dashboardRoutes}
						logo={logo}
						handleDrawerToggle={this.handleDrawerToggle}
						open={this.state.mobileOpen}
						color="senti"
						{...rest}
					/>
					<div className={classes.content}>
						<div className={classes.container}>{switchRoutes}</div>
					</div>

				</div>
			</div>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(App);
