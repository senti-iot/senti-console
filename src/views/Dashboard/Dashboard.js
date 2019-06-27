import { Button, withStyles, Fade, IconButton, /* IconButton, */  } from '@material-ui/core';
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
// import { teal } from '@material-ui/core/colors';
// import { Add } from 'variables/icons';
import CreateDashboard from './CreateDashboard.js';
import { Add } from 'variables/icons.js';
import { teal } from '@material-ui/core/colors';

class Dashboard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: 0,
			projects: [],
			devices: 0,
			openAddDash: true
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
	handleOpenDT = () => {
		this.setState({
			openAddDash: true
		})
	}
	handleCloseDT = () => {
		this.setState({
			openAddDash: false
		})
	}
	renderAddDashboard = () => {
		const { t } = this.props
		const { openAddDash } = this.state
		const { handleCloseDT } = this
		return <CreateDashboard
			openAddDash={openAddDash}
			handleCloseDT={handleCloseDT}
			t={t}
		/>
		
	}
	render() {
		const { discoverSenti, t, history } = this.props
		return (
			<Fragment>
				{discoverSenti ? <DiscoverSenti t={t} history={history} /> : null}
				<Fade in={true} style={{
					transitionDelay: 200,
				}}>
					<div style={{ position: 'relative' }}>
						{this.renderAddDashboard()}
						<GridContainer>
							{this.props.dashboards.map((d, i) => {
								return <DashboardPanel
									key={i}
									d={d}
									t={t}
								/>
							})}
						</GridContainer>
						<IconButton
							onClick={this.handleOpenDT} 
							style={{ position: 'absolute', top: 0, right: 0, background: teal[500], color: '#fff', borderRadius: 4, marginRight: 8, padding: '8px' }}>
							<Add />
						</IconButton>
					</div>
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
	dashboards: state.dsSystem.dashboards
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(dashboardStyle)(Dashboard)))
