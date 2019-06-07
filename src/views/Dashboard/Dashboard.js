import { Button, withStyles, Fade, IconButton, Dialog, AppBar, Toolbar, Hidden } from '@material-ui/core';
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
import { Add, Close } from 'variables/icons';
import { teal } from '@material-ui/core/colors';
import { T, ItemG } from 'components';
import cx from 'classnames'
class Dashboard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: 0,
			projects: [],
			devices: 0,
			openAddDash: false
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
		const { t, classes } = this.props
		const { openAddDash } = this.state
		const { handleCloseDT } = this
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openAddDash}
			onClose={handleCloseDT}
			TransitionComponent={this.transition}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseDT} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('dashboard.createDashboard')}
								</T>
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={4} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseDT} aria-label='Close'>
									<Close />
								</IconButton>
								<T variant='h6' color='inherit' className={classes.flex}>
									{t('dashboard.createDashboard')}
								</T>
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<div>
				Here will be the create Dashboard
			</div>
		</Dialog>
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
						<GridContainer spacing={8}>
							{this.props.dashboards.map((d, i) => {
								return <DashboardPanel
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
	dashboards: state.appState.dashboards
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(dashboardStyle)(Dashboard)))
