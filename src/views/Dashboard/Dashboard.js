import { Button, withStyles, Fade } from '@material-ui/core';
// import imgs from 'assets/img/Squared';
import dashboardStyle from 'assets/jss/material-dashboard-react/dashboardStyle';
import GridContainer from 'components/Grid/GridContainer';
import withLocalization from 'components/Localization/T';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import DiscoverSenti from 'views/Dashboard/DiscoverSenti';
import DashboardPanel from './DashboardPanel.js';
// import { teal } from '@material-ui/core/colors';
// import { Add } from 'variables/icons';
import CreateDashboard from './CreateDashboard.js';
import { Add, ImportExport } from 'variables/icons.js';
import { ThemeProvider } from '@material-ui/styles';
import { darkTheme, lightTheme } from 'variables/themes/index.js';
import EditDashboard from './EditDashboard.js';
import { reset } from 'redux/dsSystem.js';
import { finishedSaving } from 'redux/dsSystem';
import withSnackbar from 'components/Localization/S.js';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';

class Dashboard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: 0,
			projects: [],
			devices: 0,
			openAddDash: false,
			openEditDash: false,
			eDash: null,
			openSpeed: false
		}

	}


	componentDidMount = async () => {
		this.props.setHeader('Senti', false, '', 'dashboard')
		this.props.setBC('dashboard', '', '', true)
		this.props.setTabs({
			id: 'dashboard',
			dontShow: true,
			tabs: [],
			// content: [
			// 	<Hidden smDown key={'createDash'}>

			// 	</Hidden>]
		})
	}

	componentDidUpdate = () => {
		if (this.props.saved) {
			this.props.s(this.props.saved)
			this.props.finishedSaving()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	handleOpenSpeed = () => {
		console.log("Opened")
		this.setState({
			openSpeed: true
		})
	}
	handleCloseSpeed = () => {
		console.log("Closed")
		this.setState({
			openSpeed: false
		})
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
		this.props.resetDash()
		this.setState({
			openAddDash: false
		})
	}
	handleOpenEDT = (eDash) => {
		this.setState({
			openEditDash: true,
			eDash: eDash
		})
	}
	handleCloseEDT = () => {
		this.props.resetDash()
		this.setState({
			openEditDash: false,
			eDash: null
		})
	}
	renderEditDashboard = () => {
		const { t } = this.props
		const { openEditDash, eDash } = this.state
		const { handleCloseEDT } = this
		return <EditDashboard
			eDash={eDash}
			open={openEditDash}
			handleClose={handleCloseEDT}
			t={t}
		/>
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
	renderTheme = t => {
		return t === 1 ? darkTheme : lightTheme
	}
	render() {
		const { /* discoverSenti, */ t, /* history */ } = this.props
		return (
			<Fragment>
				{/* {discoverSenti ? <DiscoverSenti t={t} history={history} /> : null} */}
				<Fade in={true} style={{
					transitionDelay: 200,
				}}>
					<div style={{ position: 'relative' }}>
						<ThemeProvider theme={this.renderTheme(this.props.dsTheme)}>
							{this.renderAddDashboard()}
							{this.renderEditDashboard()}
						</ThemeProvider>
						<GridContainer spacing={2}>
							{this.props.dashboards.map((d, i) => {
								return <DashboardPanel
									handleOpenEDT={this.handleOpenEDT}
									key={i}
									d={d}
									t={t}
								/>
							})}
						</GridContainer>


						{/* <div style={{ position: 'relative' }}> */}

						<SpeedDial
							ariaLabel="SpeedDial tooltip example"
							className={this.props.classes.speedDial}
							// hidden={true}
							icon={<SpeedDialIcon />}
							onBlur={this.handleCloseSpeed}
							onClick={this.handleOpenSpeed}
							onClose={this.handleCloseSpeed}
							// onFocus={this.handleOpenSpeed}
							onMouseEnter={this.handleOpenSpeed}
							onMouseLeave={this.handleCloseSpeed}
							open={this.state.openSpeed}
							direction={'up'}
						>
							<SpeedDialAction
								icon={<ImportExport />}
								tooltipTitle={`${this.props.t('actions.import')} ${this.props.t('sidebar.dashboard')}`}
								tooltipOpen
								onClikc={this.handleOpenImport}
							/>
							<SpeedDialAction
								icon={<Add />}
								tooltipTitle={`${this.props.t('actions.create')} ${this.props.t('sidebar.dashboard')}`}
								tooltipOpen
								onClick={this.handleOpenDT}
							/>
							{/* <Tooltip title={`${this.props.t('actions.create')} ${this.props.t('sidebar.dashboard')}`}>
							<IconButton
							onClick={this.handleOpenDT}
							style={{ color: '#fff', borderRadius: 4, marginRight: 8, padding: '12px' }}>
								<Add />
								</IconButton>
							</Tooltip> */}
						</SpeedDial>
						{/* </div> */}
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
	dsTheme: state.settings.dsTheme,
	dashboards: state.dsSystem.dashboards,
	saved: state.dsSystem.saved
})

const mapDispatchToProps = dispatch => ({
	resetDash: () => dispatch(reset()),
	finishedSaving: () => dispatch(finishedSaving())
})

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar()(withLocalization()(withStyles(dashboardStyle)(Dashboard))))
