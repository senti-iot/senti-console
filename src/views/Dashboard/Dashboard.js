import { Button, withStyles, Fade } from '@material-ui/core';
// import imgs from 'assets/img/Squared';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import GridContainer from 'components/Grid/GridContainer';
import withLocalization from 'components/Localization/T';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DiscoverSenti from 'views/Dashboard/DiscoverSenti';
import DashboardPanel from './DashboardPanel.js';

class Dashboard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: 0,
			projects: [],
			devices: 0
		}
		props.setHeader('Senti', false, '', 'dashboard')
		props.setBC('dashboard', '', '', false)
		props.setTabs({
			id: 'dashboard',
			tabs: [],
			// dontShow: true
		})
	}


	componentDidMount = async () => {
		this.props.setHeader('Senti', false, '', 'dashboard')
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}

	handleChange = (value) => {
		this.setState({ value })
	}

	handleChangeIndex = index => {
		this.setState({ value: index })
	}
	
	renderAction = (text, loc, right) => {
		const { t, /* history */ } = this.props
		return <Button size={'small'} color={'primary'} component={Link} to={loc} style={right ? { marginLeft: 'auto' } : null}>{t(text)}</Button>
	}

	render() {
		const { discoverSenti, t, history } = this.props
		return (
			<Fragment>
				{discoverSenti ? <DiscoverSenti t={t} history={history}/> : null}
				<Fade in={true} style={{
					transitionDelay: 200,
				}}>
					<GridContainer spacing={8}>

						{this.props.dashboards.map((d, i) => {
							return <DashboardPanel 
								d={d}
							/>
						})}
					</GridContainer>
				</Fade>
			</Fragment>
		)
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
	// discoverSenti: state.settings.discSentiVal
	dashboards: state.appState.dashboards
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(dashboardStyle)(Dashboard)))
