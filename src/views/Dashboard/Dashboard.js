import { Button, withStyles, Fade, Hidden, DialogContent, DialogActions, DialogTitle, Dialog } from '@material-ui/core';
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
import { reset, importDashboard } from 'redux/dsSystem.js';
import { finishedSaving } from 'redux/dsSystem';
import withSnackbar from 'components/Localization/S.js';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';
import { TextF } from 'components/index.js';

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
			openSpeed: false,
			openImport: false
		}

	}


	componentDidMount = async () => {
		this.props.setHeader('Senti', false, '', 'dashboard')
		this.props.setBC('dashboard', '', '', true)
		this.props.setTabs({
			id: 'dashboard',
			dontShow: true,
			tabs: []
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
		this.setState({
			openSpeed: true
		})
	}
	handleCloseSpeed = () => {
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
	handleOpenDT = e => {
		e.stopPropagation()
		e.preventDefault()
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
	handleOpenImport = e => {
		e.preventDefault()
		e.stopPropagation()
		this.setState({
			openImport: true
		})
	}
	handleCloseImport = () => {
		this.setState({
			openImport: false,
			error: false
		})
	}
	handleCheckJSON = e => {
		try {
			let newD = JSON.parse(e.target.value)
			console.log(newD)
			this.setState({ newD: newD })
		} catch (error) {
			console.log(error.message)
			this.setState({
				error: true
			})
		}
	}
	handleImport = () => {
		let newD = this.state.newD
		if (newD) {
			this.props.importDashboard(newD)
			this.setState({
				newD: null,
				openImport: false
			})
		}
	}
	renderImportDashboard = () => {
		const { t } = this.props
		const { openImport, error } = this.state
		return <Dialog
			open={openImport}
			onClose={this.handleCloseImport}
			PaperProps={{
				style: {
					width: '100%'
				}
			}}
		>
			<DialogTitle>{`${t('actions.import')} ${t('sidebar.dashboard')}`}</DialogTitle>
			<DialogContent>
				<TextF
					id={'importDashboard'}
					fullWidth
					multiline
					rows={10}
					handleChange={this.handleCheckJSON}
					error={error}
				/>
			</DialogContent>
			<DialogActions>
				<Button variant={'outlined'} color={'primary'} onClick={this.handleImport} disabled={error}>{t('actions.import')}</Button>
			</DialogActions>

		</Dialog>
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
						{this.renderImportDashboard()}
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
						<div style={{ height: 80 }} />

						<Hidden xsDown>

							<SpeedDial
								ariaLabel="SpeedDial tooltip example"
								className={this.props.classes.speedDial}
								icon={<SpeedDialIcon />}
								onBlur={this.handleCloseSpeed}
								onClick={this.handleOpenSpeed}
								onClose={this.handleCloseSpeed}
								onMouseEnter={this.handleOpenSpeed}
								onMouseLeave={this.handleCloseSpeed}
								open={this.state.openSpeed}
								direction={'up'}
							>
								<SpeedDialAction
									icon={<ImportExport />}
									tooltipTitle={`${this.props.t('actions.import')} ${this.props.t('sidebar.dashboard')}`}
									tooltipOpen
									onClick={this.handleOpenImport}
								/>
								<SpeedDialAction
									icon={<Add />}
									tooltipTitle={`${this.props.t('actions.create')} ${this.props.t('sidebar.dashboard')}`}
									tooltipOpen
									onClick={this.handleOpenDT}
								/>

							</SpeedDial>
						</Hidden>
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
	finishedSaving: () => dispatch(finishedSaving()),
	importDashboard: (d) => dispatch(importDashboard(d))
})

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar()(withLocalization()(withStyles(dashboardStyle)(Dashboard))))
