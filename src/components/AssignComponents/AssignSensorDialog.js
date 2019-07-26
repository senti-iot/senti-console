import { AppBar, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography, withStyles, Hidden, Tooltip } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
// import { getAllSensors } from 'variables/dataSensors';
import { ItemG, CircularLoader } from 'components';
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import assignStyles from 'assets/jss/components/assign/assignStyles';
import { connect } from 'react-redux'
import TP from 'components/Table/TP';

class AssignSensorDialog extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			sensors: [],
			selectedSensor: null,
			page: 0,
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		// await getAllSensors().then(rs => this._isMounted ? this.setState({ sensors: rs }) : null)
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}
	assignSensor = sId => e => {
		// let sId = this.state.selectedSensor
		let sensors = this.props.sensors
		let org = sensors[sensors.findIndex(o => o.id === sId)]
		this.props.callBack(org)
	}
	Transition(props) {
		return <Slide direction='up' {...props} />;
	}
	selectSensor = pId => e => {
		e.preventDefault()
		this.setState({ selectedSensor: pId })
	}
	closeDialog = () => {
		this.props.handleClose(false)
	}
	handleFilterKeyword = value => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}
	handleChangePage = (event, page) => {
		this.setState({ page });
	}

	render() {
		const { filters, page } = this.state
		const { sensors, classes, open, t } = this.props;

		let height = window.innerHeight
		let rows = Math.round((height - 85 - 49 - 49) / 49)
		let rowsPerPage = rows

		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return (

			<Dialog
				fullScreen
				open={open}
				onClose={this.handleClose}
				TransitionComponent={this.Transition}
			>
				<AppBar className={classes.appBar + appBarClasses}>
					<Toolbar>
						<Hidden smDown>
							<ItemG container alignItems={'center'}>
								<ItemG xs={3} container alignItems={'center'}>
									<Typography variant='h6' color='inherit' className={classes.flex}>
										{t('sidebar.devices')}
									</Typography>
								</ItemG>
								<ItemG xs>
									<Search
										fullWidth
										open={true}
										focusOnMount
										suggestions={sensors ? suggestionGen(sensors) : []}
										handleFilterKeyword={this.handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
								<ItemG xs={1}>
									<Tooltip title={t('actions.cancel')}>
										<IconButton color='inherit' onClick={this.closeDialog} aria-label='Close'>
											<Close />
										</IconButton>
									</Tooltip>
								</ItemG>
							</ItemG>
						</Hidden>
						<Hidden mdUp>
							<ItemG container alignItems={'center'}>
								<ItemG xs={12} container alignItems={'center'}>
									<IconButton color={'inherit'} onClick={this.closeDialog} aria-label='Close'>
										<Close />
									</IconButton>
									<Typography variant='h6' color='inherit' className={classes.flex}>
										{t('sensors.pageTitle')}
									</Typography>
								</ItemG>
								<ItemG xs={12} container alignItems={'center'} justify={'center'}>
									<Search
										noAbsolute
										fullWidth
										open={true}
										focusOnMount
										suggestions={sensors ? suggestionGen(sensors) : []}
										handleFilterKeyword={this.handleFilterKeyword}
										searchValue={filters.keyword} />
								</ItemG>
							</ItemG>
						</Hidden>
					</Toolbar>
				</AppBar>
				<List>
					{sensors ? filterItems(sensors, filters).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p, i) => (
						<Fragment key={i}>
							<ListItem button onClick={this.assignSensor(p.id)} value={p.id}
								classes={{
									root: this.state.selectedSensor === p.id ? classes.selectedItem : null
								}}
							>
								<ListItemText
									primaryTypographyProps={{
										className: this.state.selectedSensor === p.id ? classes.selectedItemText : null
									}}
									secondaryTypographyProps={{
										classes: { root: this.state.selectedSensor === p.id ? classes.selectedItemText : null }
									}}
									primary={p.name} />
							</ListItem>
							<Divider />
						</Fragment>
					)
					) : <CircularLoader />}
					<TP
						disableRowsPerPage
						count={sensors ? sensors.length : 0}
						page={page}
						t={t}
						handleChangePage={this.handleChangePage}
					/>
				</List>
			</Dialog>

		);
	}
}
const mapStateToProps = (state, props) => ({
	sensors: props.all ? [{ id: 'all', name: props.t('dashboard.devices.all') }, ...state.data.sensors] : state.data.sensors,
	rowsPerPage: state.appState.trp > 0 ? state.appState.trp : state.settings.trp,
})

const mapDispatchToProps = {

}

AssignSensorDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(assignStyles)(AssignSensorDialog))